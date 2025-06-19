import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import type { Professor, SubjectData, SubjectResponse } from "../types/global";
import { authService } from "../services/auth.service";
import { SubjectsService } from "../services/subjects.service";
import { ListSubjects } from "../components/ListSubjects";

export function CreateSubject() {
  // Estados para el formulario
  const [subjectName, setSubjectName] = useState('');
  const [selectedProfessorId, setSelectedProfessorId] = useState<number | ''>('');
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [creating, setCreating] = useState(false);

  // Estados para la lista de asignaturas
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState<string | null>(null);

  // Estado para la carga de profesores
  const [loadingProfessors, setLoadingProfessors] = useState(true);

  // Cargar profesores
  const fetchProfessors = async () => {
    try {
      setLoadingProfessors(true);
      const professorsData: Professor[] = await authService.listProfesores();
      setProfessors(professorsData);
    } catch (err) {
      console.error("Failed to fetch professors:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los profesores.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoadingProfessors(false);
    }
  };

  // Cargar asignaturas
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      setErrorSubjects(null);
      const subjectsData = await SubjectsService.listSubjects();
      setSubjects(subjectsData);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setErrorSubjects("Error al cargar las asignaturas.");
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
    fetchSubjects();
  }, []);

  // Crear asignatura
  const handleCreateSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre de la asignatura es obligatorio.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!selectedProfessorId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar un profesor.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    setCreating(true);

    try {
      const subjectData: SubjectData = {
        nombre: subjectName.trim(),
        id_profesor: Number(selectedProfessorId)
      };

      const response = await SubjectsService.createSubject(subjectData);

      if (response === 200 || response === 201) {
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Asignatura creada exitosamente.',
          confirmButtonColor: '#3085d6'
        });
        setSubjectName('');
        setSelectedProfessorId('');
        await fetchSubjects(); // Recarga solo la lista, no la página completa
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear la asignatura. Por favor, intente de nuevo.',
          confirmButtonColor: '#3085d6'
        });
      }
    } catch (err) {
      console.error("Failed to create subject:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al crear la asignatura.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className='flex items-center justify-center '>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-5">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Crear Nueva Asignatura
          </h2>
          <form onSubmit={handleCreateSubject}>
            {/* Nombre de la asignatura */}
            <div className="mb-4">
              <label htmlFor="subjectName" className="block text-gray-700 text-sm font-bold mb-2">
                Nombre de la Asignatura *
              </label>
              <input
                id="subjectName"
                type="text"
                placeholder="Ingrese el nombre de la asignatura..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                disabled={creating}
                required
              />
            </div>
            {/* Profesor asignado */}
            <div className="mb-6">
              <label htmlFor="professorSelect" className="block text-gray-700 text-sm font-bold mb-2">
                Profesor Asignado *
              </label>
              <select
                id="professorSelect"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedProfessorId}
                onChange={(e) => setSelectedProfessorId(e.target.value ? Number(e.target.value) : '')}
                disabled={creating || loadingProfessors}
                required
              >
                <option value="">Seleccione un profesor...</option>
                {professors.map(professor => (
                  <option key={professor.id} value={professor.id}>
                    {professor.username}
                  </option>
                ))}
              </select>
            </div>
            {/* Botón crear */}
            <div className="mb-4">
              <button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${creating ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={creating || loadingProfessors}
              >
                {creating ? 'Creando...' : 'Crear Asignatura'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ListSubjects
        subjects={subjects}
        loading={loadingSubjects}
        error={errorSubjects}
        fetchSubjects={fetchSubjects}
      />
    </div>
  );
}