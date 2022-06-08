const axios = require('axios');

//Helper for fetching data
const getData = (tag, sortBy, direction) => {
  let url = `https://api.hatchways.io/assessment/blog/posts?tag=${tag}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}`;
  }
  if (direction) {
    url += `&direction=${direction}`;
  }
  return axios.get(url)
    .then(response => {
      let data = response.data.posts;
      console.log('data', data)
      if (data.length) {
        return data;
      }
    })
    .catch(err => {
      console.error('error3', err.message);
    });
};

//Helper for sorting data
const getDataSorted = (data, sortBy, direction) => {
  if (sortBy) {
    if (direction && direction === 'desc') {
      data = data.sort((a, b) => (b[sortBy] > a[sortBy]) ? 100 : - 100);
    } else if (direction && direction === 'asc' || !direction) {
      data = data.sort((a, b) => (b[sortBy] < a[sortBy]) ? 100 : - 100);
    }
  }
  return data;
};

//Helper for validating parameters
const validateInputData = (tags, sortBy, direction) => {
  const sortByValidValues = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags'];
  const directionValidValues = ['asc', 'desc'];

  //checking invalid input values
  if (!tags) {
    return { error: 'Tags parameter is required' };
  }
  if (sortBy && !sortByValidValues.includes(sortBy)) {
    return { error: 'sortBy parameter is invalid' };
  }
  if (direction && !directionValidValues.includes(direction)) {
    return { error: 'sortBy parameter is invalid' };
  }
  return;
};

module.exports = { getData, getDataSorted, validateInputData };