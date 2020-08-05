import {ISort} from '../model/sort.model';
import {BaseService} from './base.service';
import {ListDataModel} from '../model/list.data.model';
import {ITask, ITaskData} from '../model/task.model';
import {IFilters} from '../model/filter.model';
import {Option} from '../components/confirm/DeleteConfirm';

class TaskService extends BaseService {
    async getTasks(offset: number, limit: number, sort?: ISort, filters?: IFilters): Promise<ListDataModel<ITask>> {
        const params = new URLSearchParams();
        params.append('offset', offset.toString());
        params.append('limit', limit.toString());

        if (sort && Object.keys(sort).length) {
            Object.keys(sort).forEach((property: string) => params.append('sort', `${property}=${sort[property]}`));
        }

        if (filters && Object.keys(filters).length) {
            Object.keys(filters)
                .filter((property: string) => filters[property])
                .forEach((property: string) => params.append('filter', `${property}=${filters[property]}`))
        }

        const queryString = params.toString();

        const response = await this.request(`tasks/list${queryString.length ? `?${queryString}` : ''}`, 'GET');
        if (response.ok) {
            return response.json();
        }

        else throw new Error();
    }

    async deleteTask(id: string, option: Option, priority?: number) {
        const params = new URLSearchParams();
        if (option !== 'eq') {
            params.append('option', option)
        }

        if (priority) {
            params.append('priority', priority.toString());
        }

        const queryString = params.toString();

        return this.request(`tasks/${id}${queryString.length ? `?${queryString}` : ''}`, 'DELETE');
    }

    async createTask(data: ITaskData): Promise<ITask | undefined> {
        try {
            const response = await this.request(`tasks`, 'POST', JSON.stringify(data));
            if (response.ok) {
                return response.json();
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export default new TaskService();