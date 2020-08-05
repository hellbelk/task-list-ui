import {API_HOST, REST_API_PORT} from '../config';

const BASE_API_URL = `http://${API_HOST}:${REST_API_PORT}/`;

export abstract class BaseService {
    async request(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) {
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = body;
        }

        return fetch(`${BASE_API_URL}${url}`, options);
    }
}