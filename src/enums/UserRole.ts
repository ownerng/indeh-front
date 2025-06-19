export const UserRole = {
  EJECUTIVO: 'ejecutivo',
  PROFESOR: 'profesor',
} as const; // 'as const' es crucial para inferir los tipos literales

// Definir el tipo UserRole a partir de las propiedades del objeto UserRole
export type UserRole = typeof UserRole[keyof typeof UserRole];