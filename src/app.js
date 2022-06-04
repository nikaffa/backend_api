const express = require("express");
const app = express();
const apicache = require('apicache');
const cache = apicache.middleware;

//Grouping routes
const postsRoutes = require("../routes/posts");

//Step1 route
app.get('/api/ping', cache('5 minutes'), (req, res) => {
  res.status(200).send({ "success":true });
});
//Step2 route
app.get('/api/posts', cache('5 minutes'), postsRoutes(app));


module.exports = app;