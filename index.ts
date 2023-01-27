import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.HOST;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
    res.end('I\'m OK');
});

server.listen({ host, port }, () => {
    console.log(`Server available at http://${host}:${port}/`);
});