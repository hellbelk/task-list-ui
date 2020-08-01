import React from 'react';
import {ITask} from '../../model/task.model';
import styles from './Task.module.css';
import deleteIcon from '../../images/delete_forever-24px.svg';
import {join} from '../../util';

interface TaskProps {
    task: ITask
    onDelete?: (task: ITask) => void;
}

export default class Task extends React.Component<TaskProps> {
    onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.task);
        }
    }

    render() {
        const {priority, name, description} = this.props.task;
        return (
            <div className={join('task', styles.root)}>
                <div className={styles.controls}>
                    <div className={styles.delete} onClick={this.onDelete}><img src={deleteIcon}/></div>
                </div>
                <div className={styles.priority}>{priority}</div>
                <div className={styles.name}>{name}</div>
                <div className={styles.description}>{description}</div>
            </div>
        )
    }
}