//All routes for Posts are defined here
const express = require('express');
const router = express.Router();
const { getData, getDataSorted, validateInputData } = require('../src/helpers');

const postsRoutes = (app) => {

  // GET all posts
  app.get('/api/posts/:tags?/:sortBy?/:direction?', (req, res) => {
    const { tags, sortBy,  direction } = req.params;

    //Validating parameters
    const validationError = validateInputData(tags, sortBy, direction);
    if (validationError) {
      return res.status(400).send(validationError);
    }
    
    //If only one tag is specified
    if (!tags.includes(',')) {
      getData(tags, sortBy, direction)
        .then((data) => {
          getDataSorted(data, sortBy, direction);
          res.status(200).send({ 'posts': data });
        })
        .catch(err => {
          console.log('error1', err.message);
        });
    } else {
    //If more than one tag specified
    
      //1. Fetching all unsorted posts async-ly
      let arrayOfTags = tags.split(',');
      let promises = [];

      arrayOfTags.forEach((tag) => {
        promises.push(getData(tag, sortBy, direction));
      });

      Promise.all(promises)
        .then(alldata => {
          console.log('2.allgata after promiseall', alldata)
          //2.Removing duplicates
          let dataHash = {};
          alldata[0].forEach(post => {
            dataHash[post.id] = post;
          });
          for (let i = 1; i < alldata.length; i++) {
            alldata[i].forEach(post => {
              dataHash[post.id] = post;
            });
          }

          //3.Converting hash to array
          let dataDuplicatesRemoved = [];
          for (let postId in dataHash) {
            dataDuplicatesRemoved.push(dataHash[postId]);
          }
          console.log('dataDuplicatesRemoved', dataDuplicatesRemoved)

          //4.Sorting posts
          const dataSorted = getDataSorted(dataDuplicatesRemoved, sortBy, direction);
          console.log("dataSorted", dataSorted)
          res.status(200).send({ 'posts': dataSorted });
        })
        .catch(err => {
          console.log('error2', err.message);
        });
    }
  });

  return router;
};

module.exports = postsRoutes;