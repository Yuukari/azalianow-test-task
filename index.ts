import http from 'node:http';
import * as fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

import { initHTTP } from './src/http';
import { staticServerMiddleware } from './src/http/middlewares'; 

import { RequestContext } from './src/http/types';

dotenv.config();

const host = process.env.HOST;
const port = process.env.PORT;

const routers = initHTTP();

const bootstrapChecks = () => {
    const storageDir = path.join(__dirname, '/storage');

    if (!fs.existsSync(storageDir)){
        fs.mkdirSync(storageDir);

        fs.writeFileSync(path.join(storageDir, '/messages.json'), '[{"text":"Hello, World!","author":"Yuukari"}]');
        fs.writeFileSync(path.join(storageDir, '/numbers.json'), '[]');
    }
}

const handleRequest = async (ctx: RequestContext) => {
    for (const router of routers)
        await router.handle(ctx);

    await staticServerMiddleware(ctx);

    if (ctx.res.writableEnded)
        return;

    ctx.res.statusCode = 404;
    ctx.res.end(`Not Found: ${ctx.req.method} ${ctx.req.url}`);
}

const server = http.createServer(async (req, res) => {
    const ctx: RequestContext = {
        url: req.url!,
        method: req.method!,

        req,
        res
    }

    try {
        await handleRequest(ctx);
    } catch (e){
        res.statusCode = 500;
        res.end(`Internal server error: ${(e as Error).message}`);
    }
});

server.listen({ host, port }, () => {
    bootstrapChecks();

    console.log(`Server available at http://${host}:${port}/`);
});