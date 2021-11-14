const express = require('express');
const app = express();
const interviewRoute = require('./routes/interview.route');

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST"
    );
  
    next();
  });

  app.use('/api/interview', interviewRoute);

module.exports = app;