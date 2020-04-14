const http = require('https');
const app = require('./app');

const server = http.createServer(app);
server.listen(8080);