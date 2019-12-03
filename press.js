/* eslint no-console:0, no-unused-vars:0, no-undef:0 */

const axios = require('axios')
const express = require('express')
const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
const Wordpress = require('wpapi')
const app = express()

app.listen(3000)

app.get('/', (req, res) => {
  res.json({ path: '/advant', status: 'okay' })
})

app.get('/api/v1/posts/:id/:token', (req, res) => {
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
    .then(post => {
      const api = buildApi(post)
      const local = downloadImg(post.image_path)
      const media = createMedia(api, local, post)
      return media
    })
    .catch(err => console.log(err))
}

const buildApi = (post) => {
  const api = new Wordpress({
    endpoint: `${post.authorisation.page_id}/wp-json`,
    username: post.authorisation.name,
    password: post.authorisation.other_token
  })
  return api
}

const createPost = (api, id, post) => {
  api.posts()
    .create({
      title: post.document.title,
      content: post.document.content,
      excerpt: post.document.excerpt,
      comment_status: 'open',
      status: post.draft ? 'draft' : 'publish',
      featured_media_id: id
    })
    .then(res => res)
    .catch(err => console.log(err))
}

const createMedia = (api, local, post) => {
  api.media().setHeaders('Content-Disposition', 'inline')
    .file(local)
    .create({
      title: `Featured image for ${post.document.title}`
    })
    .then(media => {
      createPost(api, media.id, post)
      return media
    })
    .catch(err => console.log(err))
}

const downloadImg = (remote) => {
  const filepath = `./tmp/${path.basename(remote)}`
  if (fs.existsSync(filepath)) return filepath
  else {
    fetch(`https://dlsauy9pfhfq1.cloudfront.net/${remote}`)
      .then(res => {
        const dest = fs.createWriteStream(filepath)
        res.body.pipe(dest)
        return filepath
      })
      .catch(err => console.log(err))
  }
}
