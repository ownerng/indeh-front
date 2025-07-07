import { useState } from "react";
import type { CicloResponse, SubjectResponse } from "../types/global";
import { SubjectCard } from "./SubjectCard";
import { Jornada } from "../enums/Jornada";
import Swal from "sweetalert2";
import { SubjectsService } from "../services/subjects.service";

interface ListSubjectsProps {
  subjects: SubjectResponse[];
  ciclo: CicloResponse[];
  loading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
  fetchCiclo: () => Promise<void>;
}

export const ListSubjects = ({ subjects, ciclo, loading, error, fetchSubjects, fetchCiclo }: ListSubjectsProps) => {
  const [selectedJornada, setSelectedJornada] = useState<string>("");
  const [selectedCiclo, setSelectedCiclo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtrar las asignaturas según la jornada seleccionada y el nombre
  const filteredSubjects = subjects.filter(sub => {
    const matchesJornada = selectedJornada ? sub.jornada === selectedJornada : true;
    const matchesCiclo = selectedCiclo ? sub.ciclo === selectedCiclo : true;
    const matchesNombre = searchTerm.trim() === ""
      ? true
      : sub.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesJornada && matchesNombre && matchesCiclo;
  });

  const handleNewCiclo = async () => {
    const { value: ciclo } = await Swal.fire({
      title: 'Creacion de nuevo ciclo',
      input: 'text',
      inputLabel: 'Nombra el nuevo ciclo',
      inputPlaceholder: 'Escribe aquí el nombre del ciclo...',
      showCancelButton: true,
      confirmButtonText: 'Crear nuevo ciclo',
      cancelButtonText: 'Cancelar'
    });

    if (ciclo === undefined) return;
    const res = await SubjectsService.createNuevoCiclo(ciclo);

    if (res === 201 || res === 200) {
      Swal.fire({
        icon: "success",
        title: "Nuevo ciclo creado exitosamente, asigne los profesores para las materias",
        confirmButtonText: "Aceptar"
      });
      fetchSubjects();
      fetchCiclo();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear un nuevo ciclo",
        text: 'Hubo un error al crear un nuevo ciclo, por favor contacte con soporte',
        confirmButtonText: "Aceptar"
      });
    }


  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col justify-between items-start mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">Listado de Asignaturas</h2>
        <div className="flex items-center space-x-2 mt-5">
          <input
            type="text"
            placeholder="Buscar asignatura..."
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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
          <label htmlFor="jornada-select" className="text-gray-700 font-medium">Filtrar por ciclo:</label>
          <select
            id="ciclo-select"
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={selectedCiclo}
            onChange={e => setSelectedCiclo(e.target.value)}
          >
            <option value="">--</option>
            {ciclo.map(j => (
              <option key={j.id} value={j.nombre_ciclo}>{j.nombre_ciclo}</option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
            type="button"
            onClick={handleNewCiclo}
          >
            Nuevo ciclo
          </button>
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