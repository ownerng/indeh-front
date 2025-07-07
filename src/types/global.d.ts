import type { Jornada } from "../enums/Jornada";
import type { UserRole } from "../enums/UserRole";


export interface LayoutProps {
    children: React.ReactNode;
}

// Definición de tipos
export type IdentificationType = 'TI' | 'CC';
export type BloodType = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
export type GradeCycle = 'CICLO 1 (I)' | 'CICLO 2 (II)' | 'CICLO 3 (III)' | 'CICLO 4 (IV)' | 'CICLO 5 (V)';




export interface Calification {
    id: number, 
    calificacion: number | null
}
export interface Student {
    id: number,
    nombres_apellidos: string,
    tipo_documento: "CC" | "TI",
    numero_documento: string,
    expedicion_documento: string,
    fecha_nacimiento: Date,
    telefono: string,
    sexo: "M" | "F",
    direccion: string,
    eps: string,
    tipo_sangre: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-",
    email: string,
    estado: "Activo" | "Inactivo",
    fecha_creacion: Date,
    subsidio: string | null,
    categoria: string | null,
    jornada: Jornada,
    grado: string,
    discapacidad: string | null,
    fecha_modificacion: Date,
    nombres_apellidos_acudiente: string,
    numero_documento_acudiente: string,
    expedicion_documento_acudiente: string,
    telefono_acudiente: string,
    direccion_acudiente: string,
    email_acudiente: string,
    empresa_acudiente: string | null,
    nombres_apellidos_familiar1: string | null,
    numero_documento_familiar1: string | null,
    telefono_familiar1: string | null,
    parentesco_familiar1: string | null,
    empresa_familiar1: string | null,
    nombres_apellidos_familiar2: string | null,
    numero_documento_familiar2: string | null,
    telefono_familiar2: string | null,
    parentesco_familiar2: string | null,
    empresa_familiar2: string | null,
}

export interface CreateAnexoDTO {
    id_student: string,
    url: string,
    fecha_creacion: Date,
}

export interface CreateCalificationDTO {
        id_student: string,
        id_subject: string,
        calificacion: number | null,
        fecha_creacion: Date,
        fecha_modificacion: Date | null,
}

export interface updateStudentDTO {
    id: number,
    nombres_apellidos: string,
    tipo_documento: "CC" | "TI",
    numero_documento: string,
    expedicion_documento: string,
    fecha_nacimiento: Date,
    telefono: string,
    sexo: "M" | "F",
    direccion: string,
    eps: string,
    tipo_sangre: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-",
    email: string,
    estado: "Activo" | "Inactivo",
    fecha_creacion: Date,
    subsidio: string | null,
    categoria: string | null,
    jornada: Jornada,
    grado: string,
    discapacidad: string | null,
    fecha_modificacion: Date,
    nombres_apellidos_acudiente: string,
    numero_documento_acudiente: string,
    expedicion_documento_acudiente: string,
    telefono_acudiente: string,
    direccion_acudiente: string,
    email_acudiente: string,
    empresa_acudiente: string | null,
    nombres_apellidos_familiar1: string | null,
    numero_documento_familiar1: string | null,
    telefono_familiar1: string | null,
    parentesco_familiar1: string | null,
    empresa_familiar1: string | null,
    nombres_apellidos_familiar2: string | null,
    numero_documento_familiar2: string | null,
    telefono_familiar2: string | null,
    parentesco_familiar2: string | null,
    empresa_familiar2: string | null,
}


export interface CreateStudentDTO {
        nombres_apellidos: string,
    tipo_documento: "CC" | "TI",
    numero_documento: string,
    expedicion_documento: string,
    fecha_nacimiento: Date,
    telefono: string,
    sexo: "M" | "F",
    direccion: string,
    eps: string,
    tipo_sangre: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-",
    email: string,
    estado: "Activo" | "Inactivo",
    fecha_creacion: Date,
    subsidio: string | null,
    categoria: string | null,
    jornada: Jornada,
    grado: string,
    discapacidad: string | null,
    fecha_modificacion: Date,
    nombres_apellidos_acudiente: string,
    numero_documento_acudiente: string,
    expedicion_documento_acudiente: string,
    telefono_acudiente: string,
    direccion_acudiente: string,
    email_acudiente: string,
    empresa_acudiente: string | null,
    nombres_apellidos_familiar1: string | null,
    numero_documento_familiar1: string | null,
    telefono_familiar1: string | null,
    parentesco_familiar1: string | null,
    empresa_familiar1: string | null,
    nombres_apellidos_familiar2: string | null,
    numero_documento_familiar2: string | null,
    telefono_familiar2: string | null,
    parentesco_familiar2: string | null,
    empresa_familiar2: string | null,
}

export interface StudentView {
  id: string,
  nombres_apellidos: string;
  grado: string;
}


export interface LoginResponse {
    token: string;
    id: number;
    role: UserRole;
}

export interface UsersResponse{
  id: number;
  username:string;
  password: string;
  role: UserRole;
}

export interface StudentCorte {
    id: number;
    nombres_apellidos: string;
    grado:string;
    id_score: number;
}
export interface StudentsByTeacherId {
  nombre_asignatura: string;
  jornada: Jornada;
  ciclo:string | null;
  students: StudentCorte[];
}
export interface BodyCorte1 {
    corte1: number;
}

export interface BodyCorte2 {
    corte2: number;
}

export interface BodyCorte3 {
    corte3: number;
}

export interface UpdateCorteResponse {
	id: number;
	id_student: number;
	id_subject: number;
	corte1: number;
	corte2: number;
	corte3: number;
	notadefinitiva: number;
}

export interface CreateUserResponse {
	username: string,
	role: UserRole,
	id: number
}

// Tipos para TypeScript
export interface Professor {
  id: number;
  username: string;
  role: string;
}

export interface SubjectData {
  nombre: string;
  id_profesor: number;
}

// Tipos para TypeScript
export interface StudentSubject {
  id: number;
  nombres_apellidos: string;
  grado: string;
}

export interface Subject {
  id: number;
  nombre: string;
  id_profesor: number;
}
export interface CicloResponse {
  id: number;
  nombre_ciclo: string;
}
export interface SubjectResponse {
  id: number;
  nombre: string;
  jornada: Jornada;
  fecha_creacion: Date;
  ciclo: string | null;
  profesor:Professor | null;
}
export interface ScoreResponse {
  id: number;
  corte1: number;
  corte2: number;
  corte3: number;
  notadefinitiva: number;
  id_student: updateStudentDTO;
  id_subject: SubjectResponse
}

export interface AssignmentData {
  id_student: number;
  id_subject: number;
}


export interface Observaciones {
    id_student: number;
    nombres_apellidos: string;
    obse: string;

}