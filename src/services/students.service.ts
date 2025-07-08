import { apiInstance } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { Jornada } from "../enums/Jornada";
import type { CreateStudentDTO, Observaciones, Student, StudentsByTeacherId } from "../types/global";

export const StudentService = {
    async createStudent(data: CreateStudentDTO) {
        try {
            const response = await apiInstance.post(ENDPOINTS.STUDENTS.CREATE, data);
            return response;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    async getAllStudents(): Promise<Student[]> {
        try {
            const response = await apiInstance.get(ENDPOINTS.STUDENTS.GETALL);
            const students: Student[] = response.data;
            return students;
        } catch (error) {
            console.error('Error fetching all students:', error);
            throw error;
        }
    },
    async getStudentsByTeacher(): Promise<StudentsByTeacherId[]> {
        try {
            const response = await apiInstance.get(ENDPOINTS.STUDENTS.GETBYTEACHER);
            const students: StudentsByTeacherId[] = response.data;
            return students;
        } catch (error) {
            console.error('Error fetching all students:', error);
            throw error;
        }
    },

    async getStudentById(id: number) {
        try {
            const response = await apiInstance.get(ENDPOINTS.STUDENTS.GETBYID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching STUDENTS:', error);
            throw error;
        }
    },
    async promoteStudent(student: Student) {
        try {
            const grado = student.grado;
            const response = await apiInstance.put(ENDPOINTS.STUDENTS.PROMOTESTUDENT(student.id), {
                grado
            });
            return response;
        } catch (error) {
            console.error('Error fetching STUDENTS:', error);
            throw error;
        }
    },
    async getStudentByGrade(grado: string, jornada: Jornada) {
        try {
            const response = await apiInstance.post(
                ENDPOINTS.STUDENTS.GETBYGRADE,
                { grado, jornada }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching STUDENTS:', error);
            throw error;
        }
    },
    async updateStudentById(id: number, data: CreateStudentDTO) {
        try {
            const response = await apiInstance.put(ENDPOINTS.STUDENTS.UPDATEBYID(id), data);
            return response.status;
        } catch (error) {
            console.error('Error fetching STUDENTS:', error);
            throw error;
        }
    },
    async deleteStudentById(id: number) {
        try {
            const response = await apiInstance.delete(ENDPOINTS.STUDENTS.DELETEBYID(id));
            return response.status;
        } catch (error) {
            console.error('Error fetching STUDENTS:', error);
            throw error;
        }
    },


    async getBoletin(student: Student, obse: string, ciclo: string, is_final: boolean) {
        try {
            const grado = student.grado;
            const jornada = student.jornada;
            const obs: Observaciones = {
                id_student: student.id,
                nombres_apellidos: student.nombres_apellidos,
                obse: obse
            }

            const response = await apiInstance.post(
                ENDPOINTS.STUDENTS.BOLETIN(student.id),
                { grado, jornada, obs, ciclo, is_final },
                { responseType: 'blob' }
            );
            return response;
        } catch (error) {
            console.error('Error fetching boletin:', error);
            throw error;
        }
    },
    async getExcel() {
        try {
            const response = await apiInstance.get(
                ENDPOINTS.STUDENTS.EXCEL,
                { responseType: 'blob' }
            );
            return response;
        } catch (error) {
            console.error('Error fetching boletin:', error);
            throw error;
        }
    }
    
    ,  async getBoletinGrade(grado: string, obse: Observaciones[], ciclo: string, is_final: boolean) {
        try {
            const response = await apiInstance.post(
                ENDPOINTS.STUDENTS.BOLETINGRADE,
                { grado, obse, ciclo, is_final },
                { responseType: 'blob' }
            );
            return response;
        } catch (error) {
            console.error('Error fetching boletin:', error);
            throw error;
        }
    },

    async updateAllScores() {
        try {
            const response = await apiInstance.get(ENDPOINTS.STUDENTS.UPDATEALLSCORES);
            return response;
        } catch (error) {
            console.error('Error updating all scores:', error);
            throw error;
        }
    } 
};