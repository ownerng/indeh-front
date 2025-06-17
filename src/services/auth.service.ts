import { apiInstance } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const authService = {
    async login(username: string, password: string) {
        try {
            const response = await apiInstance.post(ENDPOINTS.AUTH.LOGIN, { username, password });
            return response;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    async createUser(data: { username: string; password: string; role: string }) {
        try {
            const response = await apiInstance.post(ENDPOINTS.AUTH.CREATEUSER, data);
            return response;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    async listProfesores() {
        try {
            const response = await apiInstance.get(ENDPOINTS.AUTH.LiSTPROFESORES);
            return response.data;
        } catch (error) {
            console.error('Error fetching profesores:', error);
            throw error;
        }
    },

    async listAllUsers() {
        try {
            const response = await apiInstance.get(ENDPOINTS.AUTH.LISTALL);
            return response.data;
        } catch (error) {
            console.error('Error fetching profesores:', error);
            throw error;
        }
    },
     async getUserById(id:number) {
        try {
            const response = await apiInstance.get(ENDPOINTS.AUTH.GETBYID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching profesores:', error);
            throw error;
        }
    },
     async updateUserById(id:number,data: {username: string; role: string}) {
        try {
            const response = await apiInstance.put(ENDPOINTS.AUTH.UPDATEBYID(id), data);
            return response.status;
        } catch (error) {
            console.error('Error fetching profesores:', error);
            throw error;
        }
    },
     async deleteUserById(id:number) {
        try {
            const response = await apiInstance.delete(ENDPOINTS.AUTH.DELETEBYID(id));
            return response.status;
        } catch (error) {
            console.error('Error fetching profesores:', error);
            throw error;
        }
    },

}