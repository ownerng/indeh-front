import { useState } from "react";
import type { SubjectResponse } from "../types/global";
import { SubjectCard } from "./SubjectCard";
import { Jornada } from "../enums/Jornada";

interface ListSubjectsProps {
  subjects: SubjectResponse[];
  loading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
}

export const ListSubjects = ({ subjects, loading, error, fetchSubjects }: ListSubjectsProps) => {
  const [selectedJornada, setSelectedJornada] = useState<string>("");

  // Filtrar las asignaturas según la jornada seleccionada
  const filteredSubjects = selectedJornada
    ? subjects.filter(sub => sub.jornada === selectedJornada)
    : subjects;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Asignaturas</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="jornada-select" className="text-gray-700 font-medium">Filtrar por jornada:</label>
          <select
            id="jornada-select"
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={selectedJornada}
            onChange={e => setSelectedJornada(e.target.value)}
          >
            <option value="">Todas</option>
            {Object.values(Jornada).map(j => (
              <option key={j} value={j}>{j.charAt(0).toUpperCase() + j.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        {loading && <div className="text-center py-8 text-gray-500">Cargando Asignaturas...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!loading && !error && (
          filteredSubjects.length > 0 ? (
            filteredSubjects.map(sub => (
              <SubjectCard key={sub.id} subject={sub} onUserAction={fetchSubjects} />
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