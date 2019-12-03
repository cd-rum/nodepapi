/* eslint no-console:0, no-unused-vars:0, no-undef:0 */

const axios = require('axios')
const express = require('express')
const WPAPI = require('wpapi')
const host = 'https://staging.advantplus.com.au'
const app = express()
const port = 3000

app.listen(port)
app.get('/posts/:id/:token', (req, res) => {
  http = axios.create({
    baseURL: `${host}/api/v4`,
    headers: { Authorization: `Bearer ${req.params['token']}` }
  })

  run(req.params['id'])
  res.json({ id: req.params['id'], token: req.params['token'] })
})

const run = (id) => {
  http.get(`/scheduled_posts/${id}`)
    .then(res => res.data.scheduled_post)
    .then(data => {
      post = data
      console.log(post)
    })
    .catch(err => console.log(err))
}

const getApi = (auth) => {
  const subApi = new WPAPI({
    endpoint: `${auth.page_id}/wp-json`,
    username: auth.name,
    password: auth.other_token
  })
  return subApi
}

const createPost = (post) => {
  api.posts()
    .create({
      title: post.document.title,
      content: post.document.content,
      status: 'draft',
      excerpt: post.document.excerpt,
      comment_status: 'open',
      tags: post.document.tags
    })
    .then(res => res)
}

const createMedia = (post) => {
  api.media()
    .file(post.image_path)
    .create({ title: post.document.title })
    .then(res => wp.media().id(res.id).update({ post: id }))
    .then(res => res)
}
