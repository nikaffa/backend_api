const axios = require('axios');

//Helper for fetching data
const getData = (tag, sortBy, direction) => {
  return axios.get(`https://app.hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
    .then(response => {
      let data = response.data.posts;
      if (data.length) {
        return data;
      } else {
        console.log('error');
      }
    })
    .catch(err => {
      console.error(err.message);
    });
};

//Helper for sorting data
const getDataSorted = (data, sortBy, direction) => {
  if (sortBy) {
    if (direction && direction === 'desc') {
      data = data.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
    } else if (direction && direction === 'asc' || !direction) {
      data = data.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
    }
  }
  return data;
};

module.exports = { getData, getDataSorted };