export const ENDPOINTS = {
    STUDENTS : {
        CREATE : '/api/students/',
        GETALL : '/api/students/',
        GETBYID:(id:number) =>  `/api/students/${id}`,
        UPDATEBYID:(id:number) =>  `/api/students/${id}`,
        DELETEBYID:(id:number) =>  `/api/students/${id}`,
        GETBYTEACHER: '/api/students/profesor',
        BOLETIN : (id: number) => `/api/students/boletin/${id}`,
    },
    SCORES : {
        UPDATECORTE1 : (id: number) => `/api/scores/corte1/${id}`,
        UPDATECORTE2 : (id: number) => `/api/scores/corte2/${id}`,
        UPDATECORTE3 : (id: number) => `/api/scores/corte3/${id}`,
        CREATE: '/api/scores/',
        LISTALL: '/api/scores/',
        GETBYID:(id:number) =>  `/api/scores/${id}`,
        UPDATEBYID:(id:number) =>  `/api/scores/${id}`,
        DELETEBYID:(id:number) =>  `/api/scores/${id}`
    },
    AUTH: {
        LOGIN: '/api/auth/login',
        CREATEUSER: '/api/users/',
        LiSTPROFESORES: '/api/users/profesores',
        LISTALL: '/api/users/',
        GETBYID: (id: number) => `/api/users/${id}`,
        UPDATEBYID: (id: number) => `/api/users/${id}`,
        DELETEBYID: (id: number) => `/api/users/${id}`
        
    },
    SUBJECTS: {
        CREATE: '/api/subjects/',
        LIST: '/api/subjects/',
        GETBYID:(id:number) =>  `/api/subjects/${id}`,
        UPDATEBYID:(id:number) =>  `/api/subjects/${id}`,
        DELETEBYID:(id:number) =>  `/api/subjects/${id}`
    }
} as const; 