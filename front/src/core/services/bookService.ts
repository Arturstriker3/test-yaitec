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

        return axiosInstance.post(`${this.urlBase}/book`, formData);
    }

    deleteBook(bookId: number) {
        return axiosInstance.delete(`${this.urlBase}/book/${bookId}`);
    }
    
    ragBook(bookId: number, question: string) {

        return axiosInstance.post(`${this.urlBase}/book/${bookId}/rag`, {question});
    }
}

export default new bookService();