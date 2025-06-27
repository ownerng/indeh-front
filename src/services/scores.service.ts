import { apiInstance } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { AssignmentData, BodyCorte1, BodyCorte2, BodyCorte3 } from "../types/global";

export const ScoresService = {
    async createScores(data: AssignmentData) {
        try {
            const response = await apiInstance.post(ENDPOINTS.SCORES.CREATE, data);
            return response.status;
        } catch (error) {
            console.error('Error creating scores:', error);
            throw error;
        }
    },


    async updateCorte1(id: number, data: BodyCorte1) {
        try {
            const response = await apiInstance.put(ENDPOINTS.SCORES.UPDATECORTE1(id), data);
            return response;
        } catch (error) {
            console.error('Error updating Corte 1 scores:', error);
            throw error;
        }
    },
    async updateCorte2(id: number, data: BodyCorte2) {
        try {
            const response = await apiInstance.put(ENDPOINTS.SCORES.UPDATECORTE2(id), data);
            return response;
        } catch (error) {
            console.error('Error updating Corte 2 scores:', error);
            throw error;
        }
    },
    async updateCorte3(id: number, data: BodyCorte3) {
        try {
            const response = await apiInstance.put(ENDPOINTS.SCORES.UPDATECORTE3(id), data);
            return response;
        } catch (error) {
            console.error('Error updating Corte 3 scores:', error);
            throw error;
        }
    },
    async listAllScores() {
        try {
            const response = await apiInstance.get(ENDPOINTS.SCORES.LISTALL);
            return response.data;
        } catch (error) {
            console.error('Error fetching SCORES:', error);
            throw error;
        }
    },
    async getScoreById(id: number) {
        try {
            const response = await apiInstance.get(ENDPOINTS.SCORES.GETBYID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching SCORES:', error);
            throw error;
        }
    },
    async getScoreByStudentId(id: number) {
        try {
            const response = await apiInstance.get(ENDPOINTS.SCORES.GETBYSTUDENTID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching SCORES:', error);
            throw error;
        }
    },
    async updateScoreById(id: number, data: AssignmentData) {
        try {
            const response = await apiInstance.put(ENDPOINTS.SCORES.UPDATEBYID(id), data);
            return response.status;
        } catch (error) {
            console.error('Error fetching SCORES:', error);
            throw error;
        }
    },
    async deleteScoreById(id: number) {
        try {
            const response = await apiInstance.delete(ENDPOINTS.SCORES.DELETEBYID(id));
            return response.status;
        } catch (error) {
            console.error('Error fetching SCORES:', error);
            throw error;
        }
    },

}