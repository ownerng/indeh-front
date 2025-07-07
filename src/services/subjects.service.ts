import { apiInstance } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { SubjectData } from "../types/global";

export const SubjectsService = {
    async createSubject(data: SubjectData) {
        try {
            const response = await apiInstance.post(ENDPOINTS.SUBJECTS.CREATE, data);
            return response.status;
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    },
    async createNuevoCiclo(ciclo: string) {
        try {
            const response = await apiInstance.post(ENDPOINTS.SUBJECTS.CREATENUEVOCICLo, ciclo);
            return response.status;
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    },
    async listSubjects() {
        try {
            const response = await apiInstance.get(ENDPOINTS.SUBJECTS.LIST);
            return response.data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },

    async getSubjectById(id:number) {
        try {
            const response = await apiInstance.get(ENDPOINTS.SUBJECTS.GETBYID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },
     async updateSubjectById(id:number,data: SubjectData) {
        try {
            const response = await apiInstance.put(ENDPOINTS.SUBJECTS.UPDATEBYID(id), data);
            return response.status;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },
     async deleteSubjectById(id:number) {
        try {
            const response = await apiInstance.delete(ENDPOINTS.SUBJECTS.DELETEBYID(id));
            return response.status;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },
}