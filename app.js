const express = require('express');
const app = express();
const packageRoute = require('./routes/package.route');

app.use('/api/v2/package', packageRoute);

module.exports = app;