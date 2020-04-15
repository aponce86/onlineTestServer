const http = require('http');
const app = require('./app');

const port = process.env.PORT || 5000;

/*
const server = http.createServer((req, res) => {
    console.log('creating server');
    res.end('tito loko');
});
*/

const server = http.createServer(app);


console.log(port);

server.listen(port);

/*
const http = require('https');
const app = require('./app');

const port = process.env.PORT || 5000;

//const server = http.createServer(app);

const server = http.createServer((req, res) => {
    res.end('lololololol');
});

server.listen(port);

*/