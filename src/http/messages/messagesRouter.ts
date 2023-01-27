import { IRouter, RequestContext } from '../types';

import MessagesController from './messagesController';

export default class MessagesRouter implements IRouter {
    private controller: MessagesController;

    constructor(controller: MessagesController) {
        this.controller = controller;
    }

    public async handle(ctx: RequestContext) {
        if (ctx.res.writableEnded)
            return;

        switch (ctx.url){
            case '/messages':
                if (ctx.method == 'GET')
                    await this.controller.index(ctx);
                else if (ctx.method == 'POST')
                    await this.controller.create(ctx);
        }
    }
}