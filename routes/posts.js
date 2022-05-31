//All routes for Posts are defined here
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getData, getDataSorted } = require('../src/helpers');

const postsRoutes = (app) => {

  // GET all posts
  app.get('/:tags/:sortBy?/:direction?', (req, res) => {
    const { tags, sortBy,  direction } = req.params;

    const sortByValidValues = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags'];
    const directionValidValues = ['asc', 'desc'];

    //checking invalid input values
    if (!tags) {
      return res.status(400).send({ 'error': 'Tags parameter is required' });
    }
    if (sortBy && !sortByValidValues.includes(sortBy)) {
      return res.status(400).send({ error: 'sortBy parameter is invalid' });
    }
    if (direction && !directionValidValues.includes(direction)) {
      return res.status(400).send({ error: 'sortBy parameter is invalid' });
    }

  

    //If only one tag is specified
    if (!tags.includes(',')) {
      console.log('One tag');
      axios.get(`https://app.hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
        .then(response => {
          let data = response.data.posts;
          if (data.length) {
            getDataSorted(data, sortBy, direction);
            res.status(200).send({ 'posts': data });
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
    //If more than one tag specified
      console.log('More tags');
      let arrayOfTags = tags.split(',');

      //1. Fetching all unsorted posts async
      const promises = [
        getData(arrayOfTags[0], sortBy, direction),
        getData(arrayOfTags[1], sortBy, direction),
      ];

      // arrayOfTags.map((tag) => {
      //   promises.push(getTag(tag));
      // });

      const allDataFetched = Promise.all(promises)
        .then((all) => {
          return all;
        })
        .catch((err) => {
          console.log(err.message);
        });

      //All the further logic with returned data
      allDataFetched.then(alldata => {
        //2.Removing duplicates with hash
        let dataHash = {};
        alldata[0].forEach(post => {
          dataHash[post.id] = post;
        });
        for (let i = 1; i < alldata.length; i++) {
          alldata[i].forEach(post => {
            if (!dataHash[post.id]) {
              dataHash[post.id] = post;
            }
          });
        }

        //3.Converting hash to array
        let dataDuplicatesRemoved = [];
        for (let postId in dataHash) {
          dataDuplicatesRemoved.push(dataHash[postId]);
        }

        //4.Sorting posts
        getDataSorted(dataDuplicatesRemoved, sortBy, direction);
        res.status(200).send({ 'posts': dataDuplicatesRemoved });
      })
        .catch(err => {
          console.error(err.message);
        });
    }
  });

  return router;
};

module.exports = postsRoutes;