/* eslint no-console:0, no-unused-vars:0, no-undef:0 */

const axios = require('axios')
const express = require('express')
const WPAPI = require('wpapi')
const host = 'https://staging.advantplus.com.au'
const app = express()
const port = 3000

app.listen(port, () => console.log(`press-serving ${port}`))

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
      const post = data
      const api = getApi(post)
      const wpPost = createPost(api, post)
      console.log(wpPost)

      const wpMedia = createMedia(api, post)
      console.log(wpMedia)
    })
    .catch(err => console.log(err))
}

const getApi = (post) => {
  const wpapi = new WPAPI({
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
      status: 'draft',
      excerpt: post.document.excerpt,
      comment_status: 'open'
    })
    .then(res => res)
    .catch(err => console.log(err))
}

const createMedia = (api, post) => {
  api.media()
    .file(post.image_path)
    .create({ title: post.document.title })
    // .then(res => wp.media().id(res.id).update({ post: id }))
    .then(res => res)
    .catch(err => console.log(err))
}
