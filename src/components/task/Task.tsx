import React from 'react';
import {TaskModel} from '../../model/task.model';
import styles from './Task.module.css';
import deleteIcon from '../../images/delete_forever-24px.svg';

interface TaskProps {
    task: TaskModel
    onDelete?: (task: TaskModel) => void;
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
            <div className={['task', styles.root].join(' ')}>
                <div className={styles.body}>
                    <div className={styles.header}>
                        <div>{priority}</div>
                        <div className="primary text">{name}</div>
                    </div>
                    {description && description.length ? (
                        <div className={['secondary text', styles.description].join(' ')}>{description}</div>
                    ) : null}

                </div>
                <div className={styles.controls}>
                    <div className={styles.delete} onClick={this.onDelete}><img src={deleteIcon}/></div>
                </div>
            </div>
        )
    }
}