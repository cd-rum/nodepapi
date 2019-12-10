#!/usr/bin/env node

/* eslint no-console:0, no-unused-vars:0, no-undef:0 */
const cloud = process.env.CLOUD
const host = process.env.HOST

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const WPAPI = require('wpapi')
const axios = require('axios')
const express = require('express')
const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
const winston = require('winston')
const winstonExRegLogger = require('winston-express-request-logger')
const app = express()

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
      console.log(post)

      const api = buildApi(post)
      const res = run(api, post)
      return res
    })
    .catch(err => console.log(err))
}

const buildApi = (post) => {
  const api = new WPAPI({
    endpoint: `${post.authorisation.page_id}/wp-json`,
    username: post.authorisation.name,
    password: post.authorisation.other_token
  })
  return api
}

const createPost = (api, mediaId, post, tags) => {
  api.posts()
    .create({
      title: post.document.title,
      content: post.document.content,
      excerpt: post.document.excerpt,
      comment_status: 'open',
      status: post.draft ? 'draft' : 'publish',
      featured_media: mediaId,
      tags: tags
    })
    .then(res => res)
    .catch(err => console.log(err))
}

const createTags = (api, local, post) => {
  const remoteTags = []
  for (const tag of post.document.tags) {
    api.tags()
      .create({
        name: tag
      })
      .then(res => {
        remoteTags.push(res.id)
      })
      .catch(err => {
        console.log(err)

        if (err.code === 'term_exists') remoteTags.push(err.data.term_id)
      })
  }
  createMedia(api, local, post, remoteTags)
}

const createMedia = (api, local, post, tags) => {
  api.media().setHeaders('Content-Disposition', 'inline')
    .file(local)
    .create({
      title: `Featured image for ${post.document.title}`
    })
    .then(res => {
      const mediaId = res.id
      createPost(api, mediaId, post, tags)
      return res
    })
    .catch(err => console.log(err))
}

const run = (api, post) => {
  const filepath = `./tmp/${path.basename(post.image_path)}`
  // if (fs.existsSync(filepath)) return filepath
  // else {
  fetch(`https://${cloud}.cloudfront.net/${remote}`)
    .then(res => {
      const dest = fs.createWriteStream(filepath)
      res.body.pipe(dest)

      const resp = createTags(api, filepath, post)
      return resp
    })
    .catch(err => console.log(err))
  // }
}
