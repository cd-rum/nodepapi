/* eslint no-console:0, no-unused-vars:0, no-undef:0 */

const axios = require('axios')
const express = require('express')
const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
const Wordpress = require('wpapi')
const app = express()

app.listen(3000)
app.get('/posts/:id/:token', (req, res) => {
  http = axios.create({
    baseURL: `https://staging.advantplus.com.au/api/v4`,
    headers: { Authorization: `Bearer ${req.params['token']}` }
  })

  collectPost(req.params['id'])
  res.json({ id: req.params['id'], token: req.params['token'] })
})

const collectPost = (id) => {
  http.get(`/scheduled_posts/${id}`)
    .then(res => res.data.scheduled_post)
    .then(data => {
      const post = data
      const api = buildApi(post)
      const local = download(post.image_path)

      // createPost(api, post)
      // createMedia(api, local, post)
    })
    .catch(err => console.log(err))
}

const buildApi = (post) => {
  const wpapi = new Wordpress({
    endpoint: `${post.authorisation.page_id}/wp-json`,
    username: post.authorisation.name,
    password: post.authorisation.other_token
  })
  return wpapi
}

const createPost = (api, post) => {
  api.posts()
    .create({
      title: post.document.title,
      content: post.document.content,
      excerpt: post.document.excerpt,
      comment_status: 'open',
      status: 'draft'
    })
    .then(res => res)
    .catch(err => console.log(err))
}

const createMedia = (api, local, post) => {
  api.media()
    .file(local)
    .create({ title: post.document.title })
    .then(res => res)
    .catch(err => console.log(err))
}

const downloadImg = (remote) => {
  fetch(`https://dlsauy9pfhfq1.cloudfront.net/${remote}`)
    .then(res => {
      const dest = fs.createWriteStream(`./tmp/${path.basename(remote)}`)
      res.body.pipe(dest)
      return dest
    })
    .catch(err => console.log(err))
}
