#!/usr/bin/env node

/* eslint no-console:0, no-unused-vars:0, no-undef:0 */
const host = process.env.HOST

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1

const aws = require('aws-sdk')
const WPAPI = require('wpapi')
const axios = require('axios')
const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const S3ReadableStream = require('s3-readable-stream')
const winston = require('winston')
const winstonExRegLogger = require('winston-express-request-logger')

const app = express()
const s3 = new aws.S3({
  accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
  secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
  region: 'ap-southeast-2'
})

const gopressId = ''
const gopressName = ''
const gopressToken = ''

const decrypt = (key, ciphertext) => {
  key = Buffer.from(key, 'hex')
  ciphertext = Buffer.from(ciphertext, 'base64')

  const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, ciphertext.slice(0, 12))
  aesgcm.setAuthTag(ciphertext.slice(-16))
  const plaintext = aesgcm.update(ciphertext.slice(12, -16)) + aesgcm.final()

  return plaintext
}

winstonExRegLogger.createLogger({
  transports: [
    new (winston.transports.Console)({
      handleExceptions: true,
      timestamp: true,
      level: 'info'
    })
  ],
  exitOnError: false
})

app.listen(3000)
app.use(winstonExRegLogger.requestDetails)
app.set('trust proxy', true)
app.get('/', (req, res) => {
  res.json({ path: '/', status: 'okay' })
})

app.get('/api/v1/posts/:id/:token', (req, res) => {
  http = axios.create({
    baseURL: `https://${host}.com.au/api/v4`,
    headers: { Authorization: `Bearer ${req.params['token']}` }
  })

  collectPost(req.params['id'])
  res.json({ id: req.params['id'], token: req.params['token'] })
})

const collectPost = (id) => {
  http.get(`/scheduled_posts/${id}`)
    .then(res => res.data.scheduled_post)
    .then(post => {
      const api = buildApi(post)
      const res = run(id, api, post)
      return res
    })
    .catch(err => console.log(err))
}

const updatePost = (id, wordpressRes) => {
  http.put(`/scheduled_posts/${id}`, { post: { provider_response: wordpressRes } })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

const buildApi = (post) => {
  const id = decrypt(gopressId, post.authorisation.gopress_id_ciphertext)
  const name = decrypt(gopressName, post.authorisation.gopress_name_ciphertext)
  const token = decrypt(gopressToken, post.authorisation.gopress_token_ciphertext)

  const api = new WPAPI({
    endpoint: `${id}/wp-json`,
    username: name,
    password: token
  })
  return api
}

const createPost = (id, api, mediaId, post, tags) => {
  api.posts()
    .create({
      title: post.document.title,
      content: post.document.content,
      excerpt: post.document.excerpt,
      comment_status: 'open',
      status: post.draft === true ? 'draft' : 'publish',
      featured_media: mediaId,
      tags: tags
    })
    .then(res => {
      console.log(res)
      updatePost(id, res)
      return res
    })
    .catch(err => console.log(err))
}

const createTags = (id, api, local, post) => {
  const remoteTags = []
  for (const tag of post.document.tags) {
    api.tags()
      .create({ name: tag })
      .then(res => {
        console.log(`good tags: ${res}`)
        remoteTags.push(res.id)
      })
      .catch(err => {
        console.log(err)
        if (err.code === 'term_exists') remoteTags.push(err.data.term_id)
      })
  }
  createMedia(id, api, local, post, remoteTags)
}

const createMedia = (id, api, local, post, tags) => {
  api.media().setHeaders('Content-Disposition', 'inline')
    .file(local)
    .create({
      title: `Featured image for ${post.document.title}`
    })
    .then(res => {
      console.log(`good media: ${res}`)
      const mediaId = res.id
      createPost(id, api, mediaId, post, tags)
      return res
    })
    .catch(err => console.log(err))
}

const run = (id, api, post) => {
  const path = `./tmp/${post.filename}`
  const dest = fs.createWriteStream(path)
  const params = { Bucket: post.bucket, Key: post.key }
  const stream = new S3ReadableStream(s3, params)

  stream
    .on('error', (err) => console.log(err))
    .on('open', (data) => console.log(data))
    .on('close', () => {
      console.log(`close`)
      createTags(id, api, path, post)
      return dest
    })
    .on('end', () => {
      console.log(`end`)
      createTags(id, api, path, post)
      return dest
    })

  stream.pipe(dest)
}
