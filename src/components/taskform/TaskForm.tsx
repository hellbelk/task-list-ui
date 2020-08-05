import React, {ChangeEvent} from 'react';
import {ITaskData, ITask} from '../../model/task.model';
import styles from './TaskForm.module.css';
import {join} from '../../util';
import {ISort} from '../../model/sort.model';
import {IFilters} from '../../model/filter.model';

interface TaskFormProps {
    mode: 'edit' | 'search';
    currentSort?: ISort;
    filters?: IFilters;
    save: (task: ITaskData) => Promise<boolean>;
    onChange?: (filterData: IFilters) => void;
    onSort?: (sort: ISort) => void;
}

export default class TaskForm extends React.Component<TaskFormProps>{
    constructor(props: TaskFormProps) {
        super(props);
    }

    validate(): boolean {
        const {priority, name} = this.props.filters || {};

        return !!(priority && name);
    }

    onPriorityChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const data = this.props.filters || {};

        const rawValue = e.target.value;
        const value = Number(e.target.value);

        const change: IFilters = {...data};

        if (!rawValue.length || value > 0) {
            change.priority = value;
        }

        this.onChange(change);
    }

    onNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const data = this.props.filters || {};
        const value = e.target.value;

        const change: IFilters = {...data};

        if (value.length < 100) {
            change.name = value;
        }

        this.onChange(change);
    }

    onDescriptionChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const data = this.props.filters || {};
        const value = e.target.value;

        const change: IFilters = {...data};

        if (value.length < 2000) {
            change.description = value;
        }

        this.onChange(change);
    }

    onChange = (change: IFilters) => {
        const {priority, name, description} = this.props.filters || {};
        const data: IFilters = {}

        if (priority) {
            data.priority = priority;
        }

        if (name && name.toString().length) {
            data.name = name;
        }

        if (description && description.toString().length) {
            data.description = description;
        }

        this.onFilter({...data, ...change});
    }

    onSave = () => {
        const {priority, name, description} = this.props.filters || {};
        const {save} = this.props;

        if (name && priority) {
            save({
                priority,
                name,
                description
            } as ITaskData);
        }
    }

    onFilter(filterData: IFilters) {
        const {onChange} = this.props;
        if (onChange) {
            onChange(filterData);
        }
    }

    onSort(property: string) {

        return () => {
            const {onSort, currentSort} = this.props;

            const newSort = currentSort ? {...currentSort} : {};

            switch (newSort[property]) {
                case 'asc': newSort[property] = 'desc'; break;
                case 'desc': delete newSort[property]; break;
                default: newSort[property] = 'asc';
            }

            if (onSort) {
                onSort(newSort);
            }
        }

    }

    render() {
        const {priority, name, description} = this.props.filters || {};

        const {mode} = this.props;
        const {onSort, currentSort} = this.props;

        const sortElement = (label: string, property: string) => {
            let sortMarker = null;
            if (currentSort) {
                const sortDirection = currentSort[property];

                const text = sortDirection ? sortDirection === 'asc' ? (<>&darr;</>) : (<>&uarr;</>) : (<>&#x21C5;</>);

                sortMarker = (<span className={styles['sort-marker']}>{text}</span>);
            }
            return onSort ? (
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
                        <input className={join('text-field')} value={name || ''} onChange={this.onNameChanged}/>
                    </label>
                    <label className={styles.description}>
                        {sortElement('Описание', 'description')}
                        <textarea className={join('text-field')} value={description || ''} onChange={this.onDescriptionChanged}/>
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