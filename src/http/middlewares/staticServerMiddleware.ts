import * as fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

import { staticDir } from '../../../config';
import { RequestContext } from "../types";

const readFile = promisify(fs.readFile);

const getMimeType = (extension: string): string | null => {
    switch (extension){
        case ".html": return "text/html; charset=utf-8";
        case ".css": return "text/css";
        case ".js": return "application/javascript";
        case ".ttf": return "font/ttf";
        default: return null;
    }
}

const staticServerMiddleware = async ({ url, method, res }: RequestContext) => {
    if (res.writableEnded)
        return;

    if (method != 'GET')
        return;

    const filename = path.join(staticDir, url);
    const pageExists = fs.existsSync(`${filename}.html`);

    if (!fs.existsSync(filename) && !pageExists)
        return;
    
    const fileExt = path.extname(filename);
    const mimeType = getMimeType(pageExists ? '.html' : fileExt);
    if (mimeType == null)
        return;

    const fileData = await readFile(pageExists ? `${filename}.html` : filename);

    res.setHeader('Content-Type', `${mimeType}`);
    res.end(fileData);
}

export default staticServerMiddleware;