import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class userAutenticationService {
    urlBase = apiService.autentication;
    
    register({ email, password }: { email: string; password: string }) {
        return axiosInstance.post(`${this.urlBase}/register`, { email, password });
    }

    login({ email, password }: { email: string; password: string }) {
        return axiosInstance.post(`${this.urlBase}/login`, { email, password });
    }
}

export default new userAutenticationService();