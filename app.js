const express = require('express');
const app = express();
const packageRoute = require('./routes/package.route');


app.use('/', (req, res, next) => {
    res.send('here i am here');
});

app.use('/favicon.ico', (req, res)=>{
    res.send('favicon');
});



app.use('/api/v2/package', packageRoute);

module.exports = app;