import http from 'node:http';
import dotenv from 'dotenv';

import { initHTTP } from './src/http';
import { RequestContext } from './src/http/types';

dotenv.config();

const host = process.env.HOST;
const port = process.env.PORT;

const server = http.createServer(async (req, res) => {
    const routers = initHTTP();

    const ctx: RequestContext = {
        url: req.url!,
        method: req.method!,

        req,
        res
    }

    for (const router of routers){
        await router.handle(ctx);

        if (res.writableEnded)
            return;
    }

    res.statusCode = 404;
    res.end(`Not Found: ${req.method} ${req.url}`);
});

server.listen({ host, port }, () => {
    console.log(`Server available at http://${host}:${port}/`);
});