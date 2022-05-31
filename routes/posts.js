//All routes for Posts are defined here
const express = require('express');
const router = express.Router();

const postsRoutes = (app) => {

  // GET all posts
  app.get('/', (req, res) => {
    res.status(200).send({ "posts":true });
  });

  return router;
};

module.exports = postsRoutes;