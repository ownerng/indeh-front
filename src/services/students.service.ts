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
    
    ,  async getBoletinGrade(grado: string, jornada: Jornada,obse: Observaciones[], ciclo: string, is_final: boolean) {
        try {
            const response = await apiInstance.post(
                ENDPOINTS.STUDENTS.BOLETINGRADE,
                { grado, obse, jornada, ciclo, is_final },
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
    },

    async getProfessorValoracion() {
        try {
            const response = await apiInstance.get(
                ENDPOINTS.STUDENTS.PROFESSORVALORACION,
                { responseType: 'blob' }
            );
            return response;
        } catch (error: any) {
            console.error('Error fetching professor valoracion:', error);
            console.error('Error status:', error.response?.status);
            console.error('Error details:', error.response?.data || error.message);
            
            // Si es un error de red/CORS, intentar con fetch directo
            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                console.log('Attempting fallback with fetch...');
                try {
                    const token = localStorage.getItem('token');
                    const fetchResponse = await fetch(`https://capialti.shop${ENDPOINTS.STUDENTS.PROFESSORVALORACION}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/pdf, */*'
                        },
                    });
                    
                    if (!fetchResponse.ok) {
                        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
                    }
                    
                    const blob = await fetchResponse.blob();
                    return { data: blob, status: fetchResponse.status };
                } catch (fetchError) {
                    console.error('Fetch fallback also failed:', fetchError);
                    throw error; // Throw the original error
                }
            }
            
            throw error;
        }
    },

    async getProfessorValoracionById(professorId: number) {
        try {
            const response = await apiInstance.get(
                ENDPOINTS.STUDENTS.PROFESSORVALORACIONBYID(professorId),
                { responseType: 'blob' }
            );
            return response;
        } catch (error: any) {
            console.error('Error fetching professor valoracion by id:', error);
            console.error('Error status:', error.response?.status);
            console.error('Error details:', error.response?.data || error.message);
            
            // Si es un error de red/CORS, intentar con fetch directo
            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                console.log('Attempting fallback with fetch...');
                try {
                    const token = localStorage.getItem('token');
                    const fetchResponse = await fetch(`https://capialti.shop${ENDPOINTS.STUDENTS.PROFESSORVALORACIONBYID(professorId)}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/pdf, */*'
                        },
                    });
                    
                    if (!fetchResponse.ok) {
                        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
                    }
                    
                    const blob = await fetchResponse.blob();
                    return { data: blob, status: fetchResponse.status };
                } catch (fetchError) {
                    console.error('Fetch fallback also failed:', fetchError);
                    throw error; // Throw the original error
                }
            }
            
            throw error;
        }
    } 
};