export enum MessageType {
    TASK_CREATED = 'TASK_CREATED',
    TASKS_CREATED = 'TASKS_CREATED'
}

export interface Message {
    type: MessageType;
    body: any;
}

export type MessageListener = (message: Message) => void;