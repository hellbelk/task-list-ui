import React from 'react';
import styles from './App.module.css';

import taskService from './services/task.service';
import TaskList from './components/tasklist/TaskList';
import {ITaskData, ITask} from './model/task.model';
import {ISort} from './model/sort.model';
import Confirm from './components/confirm/Confirm';
import TaskForm from './components/taskform/TaskForm';
import {IFilters} from './model/filter.model';
import PagingPanel from './components/pagingpanel/PagingPanel';


interface AppState {
    tasks: ITask[];
    offset: number;
    limit: number;
    sort: ISort;
    total: number;
    selectionMode: 'delete' | 'edit' | null;
    selectedTasks : ITask[];
    filters: IFilters;
}
export default class App extends React.Component<any, AppState>{
    defaultState: AppState = {
        tasks: [],
        offset: 0,
        limit: 20,
        sort: {},
        total: 0,
        selectedTasks: [],
        selectionMode: null,
        filters: {}
    }

    constructor(props: any) {
        super(props);

        this.state = {...this.defaultState};
    }

    async componentDidMount() {
        const height = window.innerHeight - 65;
        const limit = Math.ceil(height / 40);
        this.defaultState.limit = limit;
        this.setState({limit});
        setTimeout(() => {
            this.loadPage(0);
        })
    }

    loadPage = async (page: number) => {
        const {limit, sort, filters} = this.state;
        try {
            const offset = limit * page;

            const res = await this.loadData(offset, limit, sort, filters);
            this.setState({offset, tasks: res.tasks, total: res.total});
        } catch (e) {
            console.log('can\'t load tasks');
        }
    }

    async loadData(offset: number, limit: number, sort: ISort, filters: IFilters, currentTasks?: ITask[]): Promise<{offset: number, limit: number, tasks: ITask[], total: number}> {
        const listData = await taskService.getTasks(offset, limit, sort, filters);
        return {
            offset: listData.offset,
            limit: listData.limit,
            tasks: [...(currentTasks || []), ...(listData.data || [])],
            total: listData.total
        }
    }

    onDelete = (task: ITask) => {
        this.setState({selectionMode: 'delete', selectedTasks: [task]});
    }

    onDeleteConfirm = async () => {
        const {selectedTasks, tasks, offset, limit, total} = this.state;
        if (selectedTasks.length) {
            await taskService.deleteTask(selectedTasks[0].id);
            const index = tasks.findIndex(task => task.id === selectedTasks[0].id);
            if (index !== -1) {
                tasks.splice(index, 1);
            }
            this.setState({tasks, offset: offset - 1, selectedTasks: [], selectionMode: null})
            if (tasks.length < limit) {
                await this.loadPage(Math.ceil((total - 1) / offset));
            }
        }
    }

    onDeleteCancel = () => {
        this.setState({selectionMode: null, selectedTasks: []});
    }

    onSave = async (data: ITaskData) => {
        const {limit, total} = this.state;

        const newTask = await taskService.createTask(data);

        if (newTask) {
            const offset = (Math.ceil(total / limit) - 1) * limit;

            const res = await this.loadData(offset, limit, this.defaultState.sort, this.defaultState.filters);
            this.setState({
                offset: res.offset,
                limit: res.limit,
                tasks: res.tasks,
                total: res.total,
                sort: this.defaultState.sort,
                filters: this.defaultState.filters,
                selectedTasks: res.tasks.filter(t => t.id === newTask.id)
            });

            return true;
        }
        return false
    }

    onFilter = async (data: IFilters) => {
        if (Object.keys(this.state.filters).length !== Object.keys(data).length
            || Object.keys(this.state.filters).filter((property: string) => data[property] !== this.state.filters[property]).length) {
            const {limit, sort} = this.state;

            const res = await this.loadData(this.defaultState.offset, limit, sort, data);
            this.setState({offset: res.offset, tasks: res.tasks, filters: data});
        }
    }

    onSort = async (sort: ISort) => {
        const {filters} = this.state;
        const res = await this.loadData(this.defaultState.offset, this.defaultState.limit, sort, filters);
        this.setState({offset: res.offset, limit: res.limit, total: res.total, sort, tasks: res.tasks});
    }

    render() {
        const {tasks, total, offset, limit, selectedTasks, selectionMode, sort, filters} = this.state;

        return (
            <React.Fragment>
                <div className={styles.root}>
                    <div className={styles.header}>
                        <TaskForm save={this.onSave}
                                  onChange={this.onFilter}
                                  onSort={this.onSort}
                                  currentSort={sort}
                                  filters={filters}
                                  mode={tasks.length ? 'search' : 'edit'}/>
                    </div>
                    <div className={styles.content}>
                        <TaskList selectedTasks={selectedTasks} tasks={tasks} onDelete={this.onDelete}/>
                    </div>
                    <div className={styles.bottom}>
                        <PagingPanel currentPage={Math.ceil(offset / limit) || 0} totalItems={total} itemsPerPage={limit} onPageChange={this.loadPage}/>
                    </div>
                </div>
                {selectedTasks.length && selectionMode === 'delete' ? (
                    <Confirm text="Вы действительно хотите удалить задачу?" onConfirm={this.onDeleteConfirm} onCancel={this.onDeleteCancel}/>
                ) : null}
            </React.Fragment>
        )
    }
}