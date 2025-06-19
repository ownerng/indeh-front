import { useEffect } from "react";    
import type { SubjectResponse } from "../types/global";
import { SubjectCard } from "./SubjectCard";
interface ListSubjectsProps {
  subjects: SubjectResponse[];
  loading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
}
export const ListSubjects = ({subjects, loading, error, fetchSubjects}: ListSubjectsProps) => {
      useEffect(() => {
      }, [fetchSubjects]); 
    
      
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Listado de Asignaturas</h2>
                    <div className="flex space-x-2">
                      
                    </div>
                  </div>
        
                  <div className="mt-6">
                    {loading && <div className="text-center py-8 text-gray-500">Cargando Asignaturas...</div>}
                    {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
                    {!loading && !error && (
                        subjects.length > 0 ? (
                          subjects.map(sub => (
                            // Pass the student object (matching StudentView) to StudentCard
                            <SubjectCard key={sub.id} subject={sub} onUserAction={fetchSubjects}/>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No se encontraron Asignaturas
                          </div>
                        )
                    )}
                  </div>
        </div>
    );
}