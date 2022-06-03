const apicache = require('apicache');
const cache = apicache.middleware;

const appRouter = (app) => {

  //Grouping routes
  const postsRoutes = require("./posts");
  
  //Mounting resource routes
  //Step1 route
  app.get('/api/ping', cache('500 minutes'), (req, res) => {
    res.status(200).send({ "success":true });
  });
  //Step2 route
  app.get('/api/posts', cache('500 minutes'), postsRoutes(app));
  
};

module.exports = appRouter;