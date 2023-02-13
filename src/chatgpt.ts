import { ChatGPTAPI } from 'chatgpt';
import readline from 'readline';
import * as process from "process";
import { config } from 'dotenv';

config();

interface ClientTransaction {
    conversationId?: string,
    parentMessageId?: string
}

class ChatGptClient {
    static readonly KEY = process.env.API_KEY ?? '';

    private readonly api: ChatGPTAPI;
    private transaction: ClientTransaction = {};

    constructor() {
        this.api = new ChatGPTAPI({
            apiKey: ChatGptClient.KEY
        })
    }

    async send(message: string) {
        const response = await this.api.sendMessage(message, {
            conversationId: this.transaction.conversationId,
            parentMessageId: this.transaction.parentMessageId
        });

        this.transaction = {
            conversationId: response.conversationId,
            parentMessageId: response.parentMessageId
        };

        return response.text;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async () => {
    const client = new ChatGptClient();
    await client.send('speak korean');

    console.log('start');

    rl.on('line', async (line) => {
        if (line === '') return;

        const message = await client.send(line);
        console.log('================================= CHATGPT =================================');
        console.log(message);
        console.log('===========================================================================');
        console.log();
    });
})();
