import React from 'react';
import {TaskModel} from '../../model/task.model';
import Task from '../task/Task';
import styles from './TaskList.module.css';

interface TaskListProps {
    hasMore?: boolean;
    tasks: TaskModel[];
    onDelete?: (task: TaskModel) => void;
    onLoadMore?: () => void;
}

export default class TaskList extends React.Component<TaskListProps> {

    onLoadMore = () => {
        const {onLoadMore} = this.props;
        if (onLoadMore) {
            onLoadMore();
        }
    }

    render() {
        const {tasks, onDelete, hasMore} = this.props;
        return (
            <div className={styles.root}>
                {tasks.map(task => (<Task key={task.id} task={task} onDelete={onDelete}/>))}
                {hasMore ? (
                    <div className={styles['load-more']} onClick={this.onLoadMore}>Загрузить ещё</div>
                ) : null}
            </div>
        )
    }
}