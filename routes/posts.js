//All routes for Posts are defined here
const express = require('express');
const router = express.Router();
const axios = require('axios');

const postsRoutes = (app) => {

  // GET all posts
  app.get('/:tags/:sortBy?/:direction?', (req, res) => {
    const { tags } = req.params;

    axios.get(`https://app.hatchways.io/api/assessment/blog/posts?tag=${tags}`)
      .then(response => {
        let data = response.data.posts;
        if (data.length) {
          res.status(200).send({ 'posts': data });
        } else {
          res.status(400).send({ 'error': 'Tags parameter is required' });
        }
      })
      .catch(err => {
        console.error('error', err.message);
      });
  });

  return router;
};

module.exports = postsRoutes;