const http = require('http');

const server = http.createServer((req, res) => {
    console.log('creating server');
    res.end('tito loko');
});

//console.log(process.env);

//const hostname = 'https://cubapack-service.herokuapp.com/';

const port = process.env.PORT || 5000;

server.listen(port, ()=> {
    console.log('listening here');
});

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