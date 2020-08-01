import React, {ChangeEvent} from 'react';
import {ITaskData, ITask} from '../../model/task.model';
import styles from './TaskForm.module.css';
import {join} from '../../util';
import {ISort} from '../../model/sort.model';

interface TaskFormProps {
    task?: ITask | null;
    mode: 'edit' | 'search';
    currentSort?: ISort;
    save: (task: ITaskData) => Promise<boolean>;
    filter?: (filterData: ITaskData) => void;
    sort?: (sort: ISort) => void;
}

interface TaskFormState {
    priority?: number;
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
        const rawValue = e.target.value;
        const value = Number(e.target.value);

        if (!rawValue.length || !isNaN(value) && value > 0) {
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

    onFilter(filterData: ITaskData) {
        const {filter} = this.props;
        if (filter) {
            filter(filterData);
        }
    }

    onSort(property: string) {

        return () => {
            const {sort, currentSort} = this.props;

            const newSort = currentSort ? {...currentSort} : {};

            switch (newSort[property]) {
                case 'asc': newSort[property] = 'desc'; break;
                case 'desc': delete newSort[property]; break;
                default: newSort[property] = 'asc';
            }

            if (sort) {
                sort(newSort);
            }
        }

    }

    render() {
        const {mode} = this.props;
        const {priority, name, description, expanded} = this.state;
        const {sort, currentSort} = this.props;

        const sortElement = (label: string, property: string) => {
            let sortMarker = null;
            if (currentSort) {
                const sortDirection = currentSort[property];

                const text = sortDirection ? sortDirection === 'asc' ? (<>&darr;</>) : (<>&uarr;</>) : (<>&#x21C5;</>);

                sortMarker = (<span className={styles['sort-marker']}>{text}</span>);
            }
            return sort ? (
                <span onClick={this.onSort(property)} className={styles.sort}>{label}{sortMarker}</span>
            ) : (
                <span>{label}{sortMarker}</span>
            )
        }


        return (
            <div className={styles.root}>
                <div className={styles.form}>
                    <label className={styles.priority}>
                        {sortElement('Приоритет', 'priority')}
                        <input className={join('text-field')} value={priority || ''} onChange={this.onPriorityChanged}/>
                    </label>
                    <label className={styles.name}>
                        {sortElement('Заголовок', 'name')}
                        <input className={join('text-field')} value={name} onChange={this.onNameChanged}/>
                    </label>
                    <label className={styles.description}>
                        {sortElement('Описание', 'description')}
                        <textarea className={join('text-field')} value={description} onChange={this.onDescriptionChanged}/>
                    </label>
                </div>
                {mode === 'edit' ? (
                    <div className={styles.controls}>
                        <button disabled={!this.validate()} onClick={this.onSave} className="button primary">Добавить</button>
                    </div>
                ):null}
            </div>
        )
    }
}