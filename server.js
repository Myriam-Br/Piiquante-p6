const http = require('http');
const app = require('./app');
require('dotenv').config()

const port = process.env.PORT;
const host = process.env.HOST;
const server = http.createServer(app);


server.listen(port, host, () => {
  console.log(`Server is listening ${ host }:${port}`);
});

