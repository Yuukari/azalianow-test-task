import { RequestContext } from '../types';
import { BaseController } from '../baseController';

export default class MessagesController extends BaseController {
    public async create({ req, res }: RequestContext) {
        try {
            const body = await this.getRequestBody(req);

            res.statusCode = 201;
            return this.sendJSON(res, {
                status: 'success'            
            });
        } catch (e){
            res.statusCode = 500;

            this.sendJSON(res, {
                error: {
                    message: (e as Error).message
                }
            })
        }
    }
}