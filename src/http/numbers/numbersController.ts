import { RequestContext } from '../types';
import { BaseController } from '../baseController';

export default class NumbersController extends BaseController {
    public async get({ res }: RequestContext) {
        this.sendJSON(res, [
            {
                prevValue: 1,
                value: 2,
                result: 3
            },
            {
                prevValue: 4,
                value: 5,
                result: 6
            }
        ]);
    }

    public async create({ req, res }: RequestContext) {
        try {
            const body = await this.getRequestBody(req);

            res.statusCode = 201;
            this.sendJSON(res, {
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