import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class bookService {
    urlBase = apiService.usersCrud;

    getBooks({ page = 1, limit  = 6 }: { page?: number; limit?: number; } = {}) {
        const query = `?page=${page}&limit=${limit}`;
        return axiosInstance.get(`${this.urlBase}/books${query}`);
    }

    createBook(title: string, author: string, file: File) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('file', file);

        return axiosInstance.post(`${this.urlBase}/books`, formData);
    }
    
    getUser(userId: string) {
        return axiosInstance.get(`${this.urlBase}/users/${userId}`);
    }

    getUsers({ page = 1, per_page = 6 }: { page?: number; per_page?: number; } = {}) {
        const query = `?page=${page}&per_page=${per_page}`;
        return axiosInstance.get(`${this.urlBase}/users${query}`);
    }

    createUser(userFirstName: string, userLastName: string, userEmail: string) {
        const userInfo = {
            first_name: userFirstName,
            last_name: userLastName,
            email: userEmail
        };
        return axiosInstance.post(`${this.urlBase}/users`, userInfo);
    }

    editUser(userId: string, userFirstName: string, userLastName: string, userEmail: string) {
        const userInfo = {
            first_name: userFirstName,
            last_name: userLastName,
            email: userEmail
        };
        return axiosInstance.put(`${this.urlBase}/users/${userId}`, userInfo);
    }

    deleteUser(userId: string) {
        return axiosInstance.delete(`${this.urlBase}/users/${userId}`);
    }
}

export default new bookService();