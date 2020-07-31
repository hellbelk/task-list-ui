import {ISort} from '../model/sort.model';
import {BaseService} from './base.service';
import {ListDataModel} from '../model/list.data.model';
import {ITask} from '../model/task.model';
import {IFilters} from '../model/filter.model';

class TaskService extends BaseService{
    async getTasks(offset: number, limit: number, sort?: ISort[], filters?: IFilters): Promise<ListDataModel<ITask>> {
        const params = new URLSearchParams();
        params.append('offset', offset.toString());
        params.append('limit', limit.toString());

        if (sort && sort.length) {
            sort.forEach((model: ISort) => params.append('sort', `${model.property},${model.direction}`));
        }

        if (filters && Object.keys(filters).length) {
            Object.keys(filters)
                .forEach((property: string) => params.append('filter', `${property}=${encodeURIComponent(filters[property])}`))
        }

        const queryString = params.toString();

        const response = await this.request(`tasks${queryString.length ? `?${queryString}` : ''}`, 'GET');
        if (response.ok) {
            return response.json();
        }

        else throw new Error();
    }

    async deleteTask(id: string) {
        return this.request(`tasks/${id}`, 'DELETE');
    }
}

export default new TaskService();