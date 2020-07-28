export interface TaskData {
    priority: number;
    name: string,
    description: string;
}

export interface TaskModel extends TaskData{
    id: string,
}