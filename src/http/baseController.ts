import * as fs from 'node:fs';
import path from 'node:path';
import { URLSearchParams } from 'node:url';
import { promisify } from 'node:util';

import { templatesDir } from '../../config';

import { Request, Response } from './types';

const readFile = promisify(fs.readFile);

export class BaseController {
    protected getRequestBody(req: Request): Promise<URLSearchParams> {
        return new Promise<any>((resolve, reject) => {
            let body = "";

            req.on('data', (chunk) => body += chunk);
            req.on('end', () => {
                try {
                    const formData = new URLSearchParams(body);
                    resolve(formData);
                } catch {
                    reject(new Error('Request body must have x-www-form-urlencoded body'));
                }
            });
        });
    }

    protected async getTemplateData(template: string): Promise<string | null>{
        const templatePath = path.join(templatesDir, `${template}.html`);

        if (!fs.existsSync(templatePath))
            return null;

        return (await readFile(templatePath, { encoding: 'utf8' })).toString();
    }

    protected sendHTML(res: Response, content: string) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(content);
    }

    protected sendJSON(res: Response, data: any) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data))
    }
}