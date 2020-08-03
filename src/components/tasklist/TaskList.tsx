import React from 'react';
import {ITask} from '../../model/task.model';
import Task from '../task/Task';
import styles from './TaskList.module.css';

interface TaskListProps {
    tasks: ITask[];
    selectedTasks?: ITask[];
    onDelete?: (task: ITask) => void;
}

const TaskList = ({tasks, onDelete, selectedTasks}: TaskListProps) =>  {
    return (
        <div className={styles.root}>
            {tasks.map(task => (<Task selected={!!(selectedTasks && selectedTasks.find(t => t.id === task.id))} key={task.id} task={task} onDelete={onDelete}/>))}
        </div>
    )
}

export default TaskList;