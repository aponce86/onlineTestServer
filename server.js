const http = require('https');
const app = require('./app');

const port = process.env.PORT || 5000;

//const server = http.createServer(app);

const server = http.createServer((req, res) => {
    res.end('lololololol');
});

server.listen(port);
