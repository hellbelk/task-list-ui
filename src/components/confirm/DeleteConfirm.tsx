import React, {ChangeEvent} from 'react';
import styles from './DeleteConfirm.module.css';

export type Option = 'eq' | 'lte' | 'gte';

interface DeleteConfirmProps {
    name: string;
    onConfirm: (option: Option) => void;
    onCancel: () => void;
}

interface DeleteConfirmState {
    option: Option;
}

export default class DeleteConfirm extends React.Component<DeleteConfirmProps, DeleteConfirmState>{
    constructor(props: DeleteConfirmProps) {
        super(props);

        this.state = {
            option: 'eq'
        }
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === 'eq' || value === 'lte' || value === 'gte') {
            this.setState({option: value})
        }
    }

    onConfirm = () => {
        this.props.onConfirm(this.state.option);
    }

    render() {
        const {name, onCancel} = this.props;
        const {option} = this.state;

        return (
            <React.Fragment>
                <div className={styles.root}></div>
                <div className={styles.dialog}>
                    <div className={styles.content}>
                        <div className={styles.text}>Удалить задачу "{name}".</div>
                        <div className={styles.options}>
                            <label><input type="radio" value="eq" name="option" checked={option === 'eq'} onChange={this.onChange}/> Удалить только эту задачу. </label>
                            <label><input type="radio" value="lte" name="option" checked={option === 'lte'} onChange={this.onChange}/> Удалить эту задачу и более приоритетные. </label>
                            <label><input type="radio" value="gte" name="option" checked={option === 'gte'} onChange={this.onChange}/> Удалить эту задачу и менее приоритетные. </label>
                        </div>
                        <div className={styles.controls}>
                            <button className="button primary" onClick={this.onConfirm}>Да</button>
                            <button className="button secondary" onClick={onCancel}>Нет</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}