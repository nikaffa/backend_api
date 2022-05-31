// Web server config
const config = require('./config');

// Importing & defining the dependencies
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('PORT', config.PORT);

app.listen(app.get('PORT'), () => {
  console.log(`Example app listening on port ${app.get('PORT')}`);
});