import {API_HOST, WEB_SOCKET_PORT} from '../config';
import {Message, MessageListener} from '../model/message.model';

class EventService {
    ws?: WebSocket;
    listeners: Array<MessageListener> = [];


    constructor() {
        this.initWebSocket();
    }

    onMessage = (event: MessageEvent) => {
        if (event.data) {
            const message = JSON.parse(event.data);
            if (message.type && message.body) {
                this.dispatchEvent({type: message.type, body: message.body});
            }
        }
    }

    initWebSocket = () => {
        const ws = new WebSocket(`ws://${API_HOST}:${WEB_SOCKET_PORT}`);
        ws.addEventListener('open', () => {
            this.ws = ws;
        })
        ws.addEventListener('message', this.onMessage)
        ws.addEventListener('close', this.initWebSocket);
    }

    addMessageListener(listener: MessageListener): void {
        if (listener) {
            this.listeners.push(listener);
        }
    }

    dispatchEvent(event: Message) {
        this.listeners.forEach((listener: MessageListener) => {
            listener(event);
        })
    }

    removeMessageListener(listener: MessageListener): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}

export default new EventService();