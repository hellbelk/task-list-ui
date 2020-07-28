export interface ListDataModel<T> {
    data: T[];
    offset: number;
    limit: number;
    total: number;
}