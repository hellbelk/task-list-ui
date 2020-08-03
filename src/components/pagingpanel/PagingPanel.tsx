import React, {ReactNode, ReactNodeArray} from 'react';
import styles from './PagingPanel.module.css';
import {join} from '../../util';

interface PageChangeButtonProps {
    children: ReactNodeArray | ReactNode;
    destinationPage: number;
    onPageChange: (pageNumber: number) => void;
}

const PageChangeButton = ({destinationPage, onPageChange, children}: PageChangeButtonProps) => {
    return (
        <div className={join('button', 'secondary', styles['page-change'])} onClick={() => onPageChange(destinationPage)}>{children}</div>
    )
}

interface PagingPanelProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (pageNumber: number) => void;
}

const PagingPanel = ({currentPage, totalItems, itemsPerPage, onPageChange}: PagingPanelProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
        <div className={styles.root}>
            {currentPage > 1 ? (
                <PageChangeButton destinationPage={0} onPageChange={onPageChange}>&lt;&lt; В начало</PageChangeButton>
            ) : null}
            {currentPage !== 0 ? (
                <PageChangeButton destinationPage={currentPage - 1} onPageChange={onPageChange}>&lt; Назад</PageChangeButton>
            ) : null}
            {currentPage < totalPages - 1 ? (
                <PageChangeButton destinationPage={currentPage + 1} onPageChange={onPageChange}>Далее &gt;</PageChangeButton>
            ) : null}
            {currentPage < totalPages - 2 ? (
                <PageChangeButton destinationPage={totalPages - 1} onPageChange={onPageChange}>В конец &gt;&gt;</PageChangeButton>
            ) : null}

            <div className={styles['current-page']}>{currentPage + 1}</div>
        </div>
    );
}

export default PagingPanel;
