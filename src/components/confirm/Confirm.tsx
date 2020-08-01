import React from 'react';
import styles from './Confirm.module.css';

interface ConfirmProps {
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
}
export default function Confirm (props: ConfirmProps) {
    const {text, onCancel, onConfirm} = props;
    return (
        <React.Fragment>
            <div className={styles.root}></div>
            <div className={styles.dialog}>
                <div className={styles.content}>
                    <div className={styles.text}>{text}</div>
                    <div className={styles.controls}>
                        <button className="button primary" onClick={onConfirm}>Да</button>
                        <button className="button secondary" onClick={onCancel}>Нет</button>
                    </div>
                </div>
            </div>
        </React.Fragment>


    )
}