const http = require('http');

const server = http.createServer((req, res) => {
    console.log('creating server');
    res.end('tito loko');
});

//console.log(process.env);

const hostname = '127.0.0.1';

const port = process.env.PORT || 5000;

server.listen(port, hostname, ()=> {
    console.log('listening here');
});

/*
const http = require('https');
const app = require('./app');

const server = http.createServer(app);
server.listen(8080);
*/