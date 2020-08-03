export interface ITaskData {
    priority: number;
    name: string,
    description?: string;
}

export interface ITask extends ITaskData{
    id: string,
}