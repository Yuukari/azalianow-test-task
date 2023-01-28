import { RequestContext, Response } from '../types';
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
        await this.sendIndexPage(res);   
    }

    private async sendIndexPage(res: Response, successMessage?: string) {
        let templateData = await this.getTemplateData('messages');

        const messages = (await this.messageService.getMessages()).reverse();
        const messageBubbleTemplate = await this.getTemplateData('partials/message-bubble');

        const messagesHTML = messages.map(message => 
            messageBubbleTemplate
                .replace('{{text}}', message.text)
                .replace('{{author}}', message.author)
        );
        templateData = templateData.replace('{{messages}}', messagesHTML.join(""));

        if (successMessage != null){
            const successHintTemplate = await this.getTemplateData('partials/success-hint');
            templateData = templateData.replace('{{successHint}}', successHintTemplate.replace('{{text}}', successMessage));
        } else {
            templateData = templateData.replace('{{successHint}}', '');
        }

        this.sendHTML(res, templateData);
    }

    public async create({ req, res }: RequestContext) {
        try {
            const body = await this.getRequestBody(req);

            if (!body.has('text') || !body.has('author'))
                throw new Error(`Too few parameters. Required parameters: text, author`);

            const message: Message = {
                text: body.get('text')!,
                author: body.get('author')!
            }

            this.messageService.addMessage(message);

            await this.sendIndexPage(res, 'Сообщение отправлено');
        } catch (e){
            res.statusCode = 500;

            this.sendJSON(res, {
                error: {
                    message: (e as Error).message
                }
            });
        }
    }
}