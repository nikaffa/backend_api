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

module.exports = { getDataSorted };