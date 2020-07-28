import React from 'react';
import styles from './App.module.css';

import taskService from './services/task.service';
import TaskList from './components/tasklist/TaskList';
import {TaskData, TaskModel} from './model/task.model';
import {SortModel} from './model/sort.model';
import Confirm from './components/confirm/Confirm';
import TaskForm from './components/taskform/TaskForm';


interface AppState {
    tasks: TaskModel[];
    offset: number;
    limit: number;
    sort: SortModel[];
    total: number;
    selectionMode: 'delete' | 'edit' | null;
    selectedTask: TaskModel | null;
}
export default class App extends React.Component<any, AppState>{
    constructor(props: any) {
        super(props);

        this.state = {
            tasks: [],
            offset: 0,
            limit: 20,
            sort: [],
            total: 0,
            selectedTask: null,
            selectionMode: null
        }
    }

    async componentDidMount() {
        const height = window.innerHeight - 40;
        const limit = Math.ceil(height / 100);
        this.setState({limit});
        setTimeout(() => {
            this.loadPage();
        })
    }

    async loadPage() {
        try {
            const {tasks, offset, limit, sort} = this.state;
            const listData = await taskService.getTasks(offset, limit, sort);
            if (listData.data) {
                this.setState({tasks: [...tasks, ...listData.data], offset: offset + limit, total: listData.total});
            }
        } catch (e) {
            console.log('can\'t load tasks');
        }
    }

    onLoadMore = async () => {
        await this.loadPage();
    }

    onDelete = (task: TaskModel) => {
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

    onSave = (data: TaskData) => {
        return true;
    }

    render() {
        const {tasks, total, selectedTask, selectionMode} = this.state;

        return (
            <React.Fragment>
                <div className={styles.root}>
                    <div className={styles.header}>
                        <TaskForm save={this.onSave} task={selectionMode === 'edit' ? selectedTask : null}/>
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