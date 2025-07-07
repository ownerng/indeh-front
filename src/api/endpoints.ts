export const ENDPOINTS = {
    STUDENTS : {
        CREATE : '/api/students/',
        GETALL : '/api/students/',
        GETBYID:(id:number) =>  `/api/students/${id}`,
        GETBYGRADE: `/api/students/grado/jornada`,
        UPDATEBYID:(id:number) =>  `/api/students/${id}`,
        DELETEBYID:(id:number) =>  `/api/students/${id}`,
        GETBYTEACHER: '/api/students/profesor',
        BOLETIN : (id: number) => `/api/students/boletin/${id}`,
        BOLETINGRADE : `/api/students/boletin`,
        UPDATEALLSCORES: '/api/students/update/scores/all',
    },
    SCORES : {
        UPDATECORTE1 : (id: number) => `/api/scores/corte1/${id}`,
        UPDATECORTE2 : (id: number) => `/api/scores/corte2/${id}`,
        UPDATECORTE3 : (id: number) => `/api/scores/corte3/${id}`,
        CREATE: '/api/scores/',
        LISTALL: '/api/scores/',
        GETBYID:(id:number) =>  `/api/scores/${id}`,
        GETBYSTUDENTID:(id:number) =>  `/api/scores/student/${id}`,
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
        CREATENUEVOCICLo: '/api/subjects/nuevo/ciclo',
        LIST: '/api/subjects/',
        LISTCICLOS: '/api/subjects/ciclos',
        GETBYID:(id:number) =>  `/api/subjects/${id}`,
        UPDATEBYID:(id:number) =>  `/api/subjects/${id}`,
        DELETEBYID:(id:number) =>  `/api/subjects/${id}`
    }
} as const; 