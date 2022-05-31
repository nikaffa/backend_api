//All routes for Posts are defined here
const express = require('express');
const router = express.Router();
const axios = require('axios');

const postsRoutes = (app) => {

  // GET all posts
  app.get('/:tags/:sortBy?/:direction?', (req, res) => {
    axios.get(`https://app.hatchways.io/api/assessment/blog/posts?tag=tech`)
      .then(data => {
        res.status(200).send({ 'posts': data.data.posts });
      })
      .catch(err => {
        console.error('error', err.message);
      });
  });

  return router;
};

module.exports = postsRoutes;