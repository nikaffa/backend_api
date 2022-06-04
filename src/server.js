const config = require('./config');
const bodyParser = require('body-parser');
const app = require("./app");

app.use(bodyParser.json());

app.set('PORT', config.PORT);


app.listen(app.get('PORT'), () => {
  console.log(`Example app listening on port ${app.get('PORT')}`);
});

//module.exports = { srv };