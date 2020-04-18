const express = require('express');
const app = express();
const packageRoute = require('./routes/package.route');

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST"
    );
  
    //console.log('*** - ', req.body);
  
    next();
  });

app.use('/api/v2/package', packageRoute);

module.exports = app;