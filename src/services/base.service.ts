const BASE_API_URL = 'http://localhost:3000/';

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