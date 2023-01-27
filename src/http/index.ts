import { MessagesRouter, MessagesController } from './messages';
import { NumbersRouter, NumbersController } from './numbers';

import { IRouter } from './types';

const initHTTP = (): IRouter[] => {
    const routers: IRouter[] = [];
    
    routers.push(new MessagesRouter(new MessagesController()));
    routers.push(new NumbersRouter(new NumbersController()));

    return routers;
}

export {
    initHTTP
}