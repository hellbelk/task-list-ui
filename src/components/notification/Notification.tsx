import React from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
    message: string;
    buttonText: string;
    onButtonClick: () => void;
}

const Notification = (props: NotificationProps) => {
    const {buttonText, onButtonClick, message} = props;

    return (
        <div className={styles.root}>
            <div className={styles.notification}>
                <div>{message}</div>
                {buttonText && onButtonClick ? (
                    <div>
                        <button onClick={onButtonClick} className="button primary">{buttonText}</button>
                    </div>
                ) : null}
            </div>
        </div>
    )
};

export default Notification;