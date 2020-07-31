import React from 'react';
import styles from './App.module.css';

import taskService from './services/task.service';
import TaskList from './components/tasklist/TaskList';
import {ITaskData, ITask} from './model/task.model';
import {ISort} from './model/sort.model';
import Confirm from './components/confirm/Confirm';
import TaskForm from './components/taskform/TaskForm';
import {IFilters} from './model/filter.model';


interface AppState {
    tasks: ITask[];
    offset: number;
    limit: number;
    sort: ISort[];
    total: number;
    selectionMode: 'delete' | 'edit' | null;
    selectedTask: ITask | null;
    filters: IFilters;
}
export default class App extends React.Component<any, AppState>{
    defaultState: AppState = {
        tasks: [],
        offset: 0,
        limit: 20,
        sort: [],
        total: 0,
        selectedTask: null,
        selectionMode: null,
        filters: {}
    }

    constructor(props: any) {
        super(props);

        this.state = {...this.defaultState};
    }

    async componentDidMount() {
        const height = window.innerHeight - 40;
        const limit = Math.ceil(height / 100);
        this.setState({limit});
        setTimeout(() => {
            this.loadPage();
        })
    }

    async componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<AppState>, snapshot?: any) {
        if (prevState.filters !== this.state.filters) {
            if (Object.keys(prevState.filters).length !== Object.keys(this.state.filters).length
                || Object.keys(prevState.filters).filter((property: string) => this.state.filters[property] !== prevState.filters[property]).length) {
                const {limit, sort, filters} = this.state;

                const res = await this.loadData(this.defaultState.offset, limit, sort, filters);
                this.setState({offset: res.offset, tasks: res.tasks});
            }
        }
    }

    async loadPage() {
        try {
            const {tasks, offset, limit, sort, filters} = this.state;
            const res = await this.loadData(offset, limit, sort, filters, tasks);
            this.setState({offset: res.offset, tasks: res.tasks});
        } catch (e) {
            console.log('can\'t load tasks');
        }
    }

    async loadData(offset: number, limit: number, sort: ISort[], filters: IFilters, currentTasks?: ITask[]): Promise<{offset: number, limit: number, tasks: ITask[], total: number}> {
        const listData = await taskService.getTasks(offset, limit, sort, filters);
        return {
            offset: listData.offset + listData.limit,
            limit,
            tasks: [...(currentTasks || []), ...(listData.data || [])],
            total: listData.total
        }
    }

    onLoadMore = async () => {
        await this.loadPage();
    }

    onDelete = (task: ITask) => {
        this.setState({selectionMode: 'delete', selectedTask: task});
    }

    onDeleteConfirm = async () => {
        const {selectedTask, tasks, offset, limit} = this.state;
        if (selectedTask) {
            await taskService.deleteTask(selectedTask.id);
            const index = tasks.findIndex(task => task.id === selectedTask.id);
            if (index !== -1) {
                tasks.splice(index, 1);
            }
            this.setState({tasks, offset: offset - 1, selectedTask: null, selectionMode: null})
            if (tasks.length < limit) {
                await this.loadPage();
            }
        }
    }

    onDeleteCancel = () => {
        this.setState({selectionMode: null, selectedTask: null});
    }

    onSave = (data: ITaskData) => {
        return true;
    }

    onFilter = (data: ITaskData) => {
        if (data) {
            const filters: IFilters = {};

            if (data.priority) {
                filters.priority = data.priority;
            }

            if (data.name && data.name.length > 3) {
                filters.name = data.name;
            }

            if (data.description && data.description.length > 3) {
                filters.description = data.description;
            }

            this.setState({filters});
        }
    }

    render() {
        const {tasks, total, selectedTask, selectionMode} = this.state;

        return (
            <React.Fragment>
                <div className={styles.root}>
                    <div className={styles.header}>
                        <TaskForm save={this.onSave} filter={this.onFilter} task={selectionMode === 'edit' ? selectedTask : null} mode={tasks.length ? 'search' : 'edit'}/>
                    </div>
                    <div className={styles.content}>
                        <TaskList tasks={tasks} hasMore={tasks.length < total} onLoadMore={this.onLoadMore} onDelete={this.onDelete}/>
                    </div>
                </div>
                {selectedTask && selectionMode === 'delete' ? (
                    <Confirm text="Do you want to delete task?" onConfirm={this.onDeleteConfirm} onCancel={this.onDeleteCancel}/>
                ) : null}
            </React.Fragment>
        )
    }
}