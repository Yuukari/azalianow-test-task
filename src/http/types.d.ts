import http from 'node:http';

export type Request = http.IncomingMessage;
export type Response = http.ServerResponse;

export type RequestContext = {
    url: string,
    method: string,

    req: Request,
    res: Response
};

export interface IRouter {
    handle(ctx: RequestContext): Promise<void> 
}