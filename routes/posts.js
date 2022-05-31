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

    //If more than one tag specified

    //Fetching data
    const getTag = (tag) => {
      return axios.get(`https://app.hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
        .then(response => {
          let data = response.data.posts;
          if (data.length) {
            // return res.status(200).send({ 'posts': data });
            return data;
          } else {
            // return res.status(404).send({ 'error': 'Tags parameter is required' });
            console.log('error');
          }
        })
        .catch(err => {
          console.error(err.message);
        });
    };

    let arrayOfTags = tags.split(',');

    //1. Fetching all unsorted posts async
    const promises = [
      getTag(arrayOfTags[0]),
      getTag(arrayOfTags[1]),
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

    //2. All the further logic with returned data
    allDataFetched.then(alldata => console.log('allDataReturned', alldata));

    // //If only one tag is specified
    // axios.get(`https://app.hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
    //   .then(response => {

    //     let data = response.data.posts;
    //     if (data.length) {
    //       if (sortBy) {
    //         if (direction && direction === 'desc') {
    //           data = data.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
    //         } else if (direction && direction === 'asc' || !direction) {
    //           data = data.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
    //         }
    //       }
    //       res.status(200).send({ 'posts': data });
    //     } else {
    //       res.status(400).send({ 'error': 'Tags parameter is required' });
    //     }
    //   })
    //   .catch(err => {
    //     console.error('error', err.message);
    //   });

  });

  return router;
};

module.exports = postsRoutes;