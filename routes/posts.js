//All routes for Posts are defined here
const express = require('express');
const router = express.Router();
const axios = require('axios');

const postsRoutes = (app) => {

  // GET all posts
  app.get('/:tags/:sortBy?/:direction?', (req, res) => {
    const { tags, sortBy,  direction } = req.params;

    const sortByValidValues = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags'];
    const directionValidValues = ['asc', 'desc'];

    //checking invalid values
    if (sortBy && !sortByValidValues.includes(sortBy)) {
      return res.status(400).send({ error: 'sortBy parameter is invalid' });
    }
    if (direction && !directionValidValues.includes(direction)) {
      return res.status(400).send({ error: 'sortBy parameter is invalid' });
    }
    console.log(tags, sortBy, direction);
    //If only one tag is specified
    axios.get(`https://app.hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
      .then(response => {

        let data = response.data.posts;
        if (data.length) {
          if (sortBy) {
            if (direction && direction === 'desc') {
              data = data.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
            } else if (direction && direction === 'asc' || !direction) {
              data = data.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
            }
          }
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