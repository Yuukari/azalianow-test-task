import { RequestContext } from '../types';
import { BaseController } from '../baseController';

import { NumbersService } from '../../services';

export default class NumbersController extends BaseController {
    private numbersService: NumbersService;

    constructor() {
        super();
        this.numbersService = new NumbersService();
    }

    public async get({ res }: RequestContext) {
        const numberRecords = (await this.numbersService.getNumberRecords()).reverse();
        this.sendJSON(res, {'numberRecords': numberRecords});
    }

    public async create({ req, res }: RequestContext) {
        try {
            const body = await this.getRequestBody(req);

            if (!body.has('value'))
                throw new Error(`Too few parameters. Required parameters: value`);

            let value: number = body.has('option_float') ? 
                parseFloat(body.get('value')!) :
                parseInt(body.get('value')!);

            if (isNaN(value))
                throw new Error(`Parameter 'value' must be a numeric value`)

            if (body.has('option_negative'))
                value = value * -1;

            const newRecord = await this.numbersService.addNumberRecord(value);

            res.statusCode = 201;
            this.sendJSON(res, newRecord);
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