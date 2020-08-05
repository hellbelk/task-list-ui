import React from 'react';
import styles from './App.module.css';

import taskService from './services/task.service';
import TaskList from './components/tasklist/TaskList';
import {ITask, ITaskData} from './model/task.model';
import {ISort} from './model/sort.model';
import DeleteConfirm, {Option} from './components/confirm/DeleteConfirm';
import TaskForm from './components/taskform/TaskForm';
import {IFilters} from './model/filter.model';
import PagingPanel from './components/pagingpanel/PagingPanel';
import eventService from './services/event.service';
import {Message, MessageType} from './model/message.model';
import Notification from './components/notification/Notification';

interface AppState {
    tasks: ITask[];
    offset: number;
    limit: number;
    sort: ISort;
    total: number;
    selectionMode: 'delete' | 'edit' | null;
    markedTask?: ITask | null;
    filters: IFilters;
    taskNumbers: string[];
}
export default class App extends React.Component<any, AppState>{
    filterTimer: any = null;

    defaultState: AppState = {
        tasks: [],
        offset: 0,
        limit: 20,
        sort: {},
        total: 0,
        markedTask: null,
        selectionMode: null,
        filters: {},
        taskNumbers: []
    }

    constructor(props: any) {
        super(props);

        this.state = {...this.defaultState};
    }

    onMessage = (message: Message) => {
        switch (message.type) {
            case MessageType.TASK_CREATED.toString(): console.log(message.type, message.body); this.setState({taskNumbers: [message.body]}); break;
            case MessageType.TASKS_CREATED.toString(): console.log(message.type, message.body); this.setState({taskNumbers: message.body}); break;
        }
    }

    async componentDidMount() {
        const height = window.innerHeight - 65;
        const limit = Math.ceil(height / 40);
        this.defaultState.limit = limit;
        this.setState({limit});
        setTimeout(() => {
            this.loadPage(0);
        });

        eventService.addMessageListener(this.onMessage);
    }

    componentWillUnmount() {
        eventService.removeMessageListener(this.onMessage);
    }

    loadPage = async (page: number) => {
        const {limit, sort, filters} = this.state;
        try {
            const offset = limit * page;

            const res = await this.loadData(offset, limit, sort, filters);
            this.setState({offset, tasks: res.tasks, total: res.total, markedTask: null, selectionMode: null, taskNumbers: []});
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
        this.setState({selectionMode: 'delete', markedTask: task});
    }

    onDeleteConfirm = async (option: Option) => {
        const {markedTask, offset, limit, total, sort, filters} = this.state;
        if (markedTask) {
            await taskService.deleteTask(markedTask.id, option, markedTask.priority);

            let newOffset;

            switch (option) {
                case 'eq':
                case 'lte':
                    newOffset = Math.max(total-1 === offset ? offset - limit : offset, 0); break;
                default:
                    newOffset = 0; break;
            }

            const res = await this.loadData(newOffset, limit, sort, filters);

            this.setState({tasks: res.tasks, offset: res.offset, markedTask: null, selectionMode: null})
        }
    }

    onDeleteCancel = () => {
        this.setState({selectionMode: null, markedTask: null});
    }

    onSave = async (data: ITaskData) => {
        const {offset, limit, total, sort} = this.state;

        const newTask = await taskService.createTask(data);

        if (newTask) {
            // const offset = Math.floor(total / limit) * limit;

            const res = await this.loadData(offset, limit, sort, this.defaultState.filters);
            this.setState({
                offset: res.offset,
                limit: res.limit,
                tasks: res.tasks,
                total: res.total,
                filters: this.defaultState.filters
            });

            return true;
        }
        return false
    }

    onFilter = async (data: IFilters) => {
        if (Object.keys(this.state.filters).length !== Object.keys(data).length
            || Object.keys(this.state.filters).filter((property: string) => data[property] !== this.state.filters[property]).length) {
            const {limit, sort} = this.state;

            if (this.filterTimer) {
                clearTimeout(this.filterTimer);
            }
            this.filterTimer = setTimeout(async () => {
                this.filterTimer = null
                const res = await this.loadData(this.defaultState.offset, limit, sort, data);
                this.setState({offset: res.offset, tasks: res.tasks});
            }, 500);

            this.setState({filters: data, markedTask: null, selectionMode: null, taskNumbers: []});
        }
    }

    onSort = async (sort: ISort) => {
        const {filters} = this.state;
        const res = await this.loadData(this.defaultState.offset, this.defaultState.limit, sort, filters);
        this.setState({offset: res.offset, limit: res.limit, total: res.total, sort, tasks: res.tasks, markedTask: null, selectionMode: null, taskNumbers: []});
    }

    onGoToNew = async () => {
        const {limit, total} = this.state;

        const offset = Math.floor(total / limit) * limit;

        const res = await this.loadData(offset, limit, this.defaultState.sort, this.defaultState.filters);
        this.setState({
            offset: res.offset,
            limit: res.limit,
            tasks: res.tasks,
            total: res.total,
            sort: this.defaultState.sort,
            filters: this.defaultState.filters
        });
    }

    render() {
        const {tasks, total, offset, limit, markedTask, selectionMode, sort, filters, taskNumbers} = this.state;

        const newTasks = tasks.filter(task => taskNumbers.indexOf(task.id) !== -1);


        return (
            <React.Fragment>
                <div className={styles.root}>
                    <div className={styles.header}>
                        <TaskForm save={this.onSave}
                                  onChange={this.onFilter}
                                  onSort={this.onSort}
                                  currentSort={sort}
                                  filters={filters}
                                  mode={'edit'}/>
                    </div>
                    <div className={styles.content}>
                        <TaskList selectedTasks={newTasks} tasks={tasks} onDelete={this.onDelete}/>
                    </div>
                    <div className={styles.bottom}>
                        <PagingPanel currentPage={Math.ceil(offset / limit) || 0} totalItems={total} itemsPerPage={limit} onPageChange={this.loadPage}/>
                    </div>
                </div>
                {markedTask && selectionMode === 'delete' ? (
                    <DeleteConfirm name={markedTask.name} onConfirm={this.onDeleteConfirm} onCancel={this.onDeleteCancel}/>
                ) : null}
                {taskNumbers && taskNumbers.length && !newTasks.length ? (
                    <Notification message="Добавленны новые элементы." buttonText="Перейти" onButtonClick={this.onGoToNew}/>
                ) : null}
            </React.Fragment>
        )
    }
}