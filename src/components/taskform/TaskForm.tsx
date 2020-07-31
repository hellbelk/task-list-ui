import React, {ChangeEvent} from 'react';
import {ITaskData, ITask} from '../../model/task.model';
import styles from './TaskForm.module.css';
import {join} from '../../util';

interface TaskFormProps {
    task?: ITask | null;
    mode: 'edit' | 'search';
    save: (task: ITaskData) => boolean;
    filter?: (filterData: ITaskData) => void;
}

interface TaskFormState {
    priority: number | null;
    name: string;
    description: string;
    expanded: boolean;
}

export default class TaskForm extends React.Component<TaskFormProps, TaskFormState>{
    constructor(props: TaskFormProps) {
        super(props);

        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            priority: null,
            name: '',
            description: '',
            expanded: false
        }
    }

    validate(): boolean {
        const {priority, name, description} = this.state;

        return !!(priority && priority > 0
            && name && name.length && name.length < 100
            && (!description || !description.length || description.length < 2000));
    }

    onPriorityChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = this.state;
        const value = Number(e.target.value);
        if (!isNaN(value) && value > 0) {
            this.setState({priority: value})
            setTimeout(() => {
                this.onFilter({
                    priority: value,
                    name,
                    description: ''
                });
            })
        }
    }

    onNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const {priority} = this.state;
        const value = e.target.value;
        if (value.length < 100) {
            this.setState({name: value});
            this.onFilter({
                priority: priority || 0,
                name: value,
                description: ''
            })
        }
    }

    onDescriptionChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length < 2000) {
            this.setState({description: value});
        }
    }

    onSave = () => {
        const {save} = this.props;
        const {priority, name, description} = this.state;

        save({
            priority: priority || 0,
            name,
            description
        });

        this.setState(this.getInitialState());
    }

    toggle = () => {
        const {expanded} = this.state;

        this.setState({expanded: !expanded})
    }

    onFilter(filterData: ITaskData) {
        const {filter} = this.props;
        if (filter) {
            filter(filterData);
        }
    }

    render() {
        const {mode} = this.props;
        const {priority, name, description, expanded} = this.state;

        return (
            <div className={styles.root}>
                <div className={styles.form}>
                    <div className={styles['main-fields']}>
                        <label>
                            Priority
                            <input className={join('text-field')} value={priority || undefined} onChange={this.onPriorityChanged}/>
                        </label>
                        <label>
                            Name
                            <input className={join('text-field')} value={name} onChange={this.onNameChanged}/>
                        </label>
                    </div>
                    {mode === 'edit' ? (
                        <div>
                            <div onClick={this.toggle}>Description</div>
                            {expanded ? (
                                <textarea className={join('text-field', styles.description)} value={description} onChange={this.onDescriptionChanged}/>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                {mode === 'edit' ? (
                    <div>
                        <button disabled={!this.validate()} onClick={this.onSave} className="button primary">Добавить</button>
                    </div>
                ):null}
            </div>
        )
    }
}