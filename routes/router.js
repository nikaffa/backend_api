const appRouter = (app) => {

  //Grouping routes
  const postsRoutes = require("./posts");
  
  //Mounting resource routes
  //Step1 route
  app.get('/api/ping', (req, res) => {
    res.status(200).send({ "success":true });
  });
  //Step2 route
  app.get('/api/posts', postsRoutes(app));
  
};

module.exports = appRouter;