import { IRouter, RequestContext } from '../types';

import NumbersController from './numbersController';

export default class NumbersRouter implements IRouter {
    private controller: NumbersController;
    
    constructor(controller: NumbersController) {
        this.controller = controller;
    }

    public async handle(ctx: RequestContext) {
        if (ctx.res.writableEnded)
            return;
            
        switch (ctx.url){
            case '/numbers/records':
                if (ctx.method == 'GET')
                    await this.controller!.get(ctx);
            case '/numbers':
                if (ctx.method == 'POST')
                    await this.controller!.create(ctx);
        }
    }
}