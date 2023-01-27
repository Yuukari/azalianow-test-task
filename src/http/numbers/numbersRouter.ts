import { IRouter, RequestContext } from '../types';

import NumbersController from './numbersController';

export default class NumbersRouter implements IRouter {
    private controller: NumbersController;
    
    constructor(controller: NumbersController) {
        this.controller = controller;
    }

    public async handle(ctx: RequestContext) {
        switch (ctx.url){
            case '/numbers':
                if (ctx.method == 'GET')
                    await this.controller!.get(ctx);
                if (ctx.method == 'POST')
                    await this.controller!.create(ctx);
        }
    }
}