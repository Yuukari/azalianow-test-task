import { RequestContext } from '../types';
import { BaseController } from '../baseController';

import { MessagesService } from '../../services';
import { Message } from '../../services/messagesService/types';

export default class MessagesController extends BaseController {
    private messageService: MessagesService;

    constructor() {
        super();
        this.messageService = new MessagesService();
    }

    public async index({ res }: RequestContext) {
        const templateData = await this.getTemplateData('messages');

        if (templateData == null)
            return;

        this.sendHTML(res, templateData);
    }

    public async create({ req, res }: RequestContext) {
        try {
            const body = await this.getRequestBody(req);

            if (body.text == undefined || body.author == undefined)
                throw new Error(`Too few parameters. Required parameters: text, author`);

            this.messageService.addMessage(body as Message);

            res.statusCode = 201;
            this.sendJSON(res, body);
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