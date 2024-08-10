import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class userAutenticationService {
    urlBase = apiService.usersCrud;
    
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

export default new userAutenticationService();