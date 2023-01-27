import { Request, Response } from './types';

export class BaseController {
    protected getRequestBody(req: Request): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let body = "";

            req.on('data', (chunk) => body += chunk);
            req.on('end', () => {
                try {
                    const jsonPayload = JSON.parse(body);
                    resolve(jsonPayload);
                } catch {
                    reject(new Error('Request body must be valid JSON object'));
                }
            });
        });
    }

    protected sendJSON(res: Response, data: any) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data))
    }
}