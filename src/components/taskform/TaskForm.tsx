import React, {ChangeEvent} from 'react';
import {TaskData, TaskModel} from '../../model/task.model';

interface TaskFormProps {
    task?: TaskModel | null;
    save: (task: TaskData) => boolean;
}

interface TaskFormState {
    priority: number;
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
            priority: 1,
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
        const value = Number(e.target.value);
        if (!isNaN(value) && value > 0) {
            this.setState({priority: value})
        }
    }

    onNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length < 100) {
            this.setState({name: value});
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
            priority,
            name,
            description
        });

        this.setState(this.getInitialState());
    }

    toggle = () => {
        const {expanded} = this.state;

        this.setState({expanded: !expanded})
    }

    render() {
        const {priority, name, description, expanded} = this.state;

        return (
            <div>
                <div>
                    <div>
                        <label>
                            Priority
                            <input value={priority} onChange={this.onPriorityChanged}/>
                        </label>
                        <label>
                            Name
                            <input value={name} onChange={this.onNameChanged}/>
                        </label>
                    </div>
                    <div>
                        <div onClick={this.toggle}>Description</div>
                        {expanded ? (
                            <textarea value={description} onChange={this.onDescriptionChanged}/>
                        ) : null}
                    </div>

                </div>
                <div>
                    <button disabled={!this.validate()} onClick={this.onSave} className="button primary">Save</button>
                </div>
            </div>
        )
    }
}