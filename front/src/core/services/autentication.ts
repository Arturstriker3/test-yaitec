import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class userAutenticationService {
    urlBase = apiService.autentication;
    
    register({ email, password }: { name:string; email: string; password: string }) {
        return axiosInstance.post(`${this.urlBase}/register`, { name, email, password });
    }

    login({ email, password }: { email: string; password: string }) {
        return axiosInstance.post(`${this.urlBase}/login`, { email, password });
    }
}

export default new userAutenticationService();