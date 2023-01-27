import Storage from './../../storage';

import { Message } from './types';

export default class MessagesService {
    private storage: Storage;
    
    constructor() {
        this.storage = new Storage('messages.json'); 
    }

    public async addMessage(message: Message) {
        await this.storage.add(message);
    }

    public async getMessages(): Promise<Message[]>{
        return await this.storage.get() as Message[];
    }
}