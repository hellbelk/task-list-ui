import {SortModel} from '../model/sort.model';
import {BaseService} from './base.service';
import {ListDataModel} from '../model/list.data.model';
import {TaskModel} from '../model/task.model';

class TaskService extends BaseService{
    async getTasks(offset: number, limit: number, sort?: SortModel[]): Promise<ListDataModel<TaskModel>> {
        const params = new URLSearchParams();
        params.append('offset', offset.toString());
        params.append('limit', limit.toString());

        if (sort && sort.length) {
            sort.forEach((model: SortModel) => params.append('sort', `${model.property},${model.direction}`));
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