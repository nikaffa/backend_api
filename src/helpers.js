const axios = require('axios');
require('dotenv').config();

//Helper for fetching data
const getData = (tag, sortBy, direction) => {
  const apiUrl = process.env.URL;
  let url = `${apiUrl}?tag=${tag}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}`;
  }
  if (direction) {
    url += `&direction=${direction}`;
  }
  return axios.get(url)
    .then(response => {
      const data = response.data.posts;
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
  const sortByValidValues = ['id', 'likes', 'popularity', 'reads'];
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