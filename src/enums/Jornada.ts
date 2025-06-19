
export const Jornada = {
    MANANA: "mañana",
    TARDE: "tarde",
    SABADO: "sabado",
    TUTORIAS: "tutorias"
} as const;

export type Jornada = typeof Jornada[keyof typeof Jornada];