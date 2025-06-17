import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import type { AssignmentData, Student, Subject, ScoreResponse } from "../types/global";
import { StudentService } from "../api";
import { SubjectsService } from "../services/subjects.service";
import { ScoresService } from "../services/scores.service";
import { ListScores } from "../components/ListScores";

export function AssingSubject() {
  // Estados para manejar los datos del formulario
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // --- NUEVOS ESTADOS Y FUNCIONES PARA EL LISTADO DE ASIGNACIONES ---
  const [scores, setScores] = useState<ScoreResponse[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [errorScores, setErrorScores] = useState<string | null>(null);

  // Cargar asignaciones
  const fetchScores = async () => {
    try {
      setLoadingScores(true);
      setErrorScores(null);
      const scoresData = await ScoresService.listAllScores();
      setScores(scoresData);
    } catch (err) {
      console.error("Failed to fetch scores:", err);
      setErrorScores("Error al cargar las asignaciones.");
    } finally {
      setLoadingScores(false);
    }
  };
  // --- FIN NUEVOS ESTADOS Y FUNCIONES ---

  // Cargar estudiantes y asignaturas
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const studentsData: Student[] = await StudentService.getAllStudents();
        setStudents(studentsData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los estudiantes.',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        setLoadingStudents(false);
      }
    };
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const subjectsData: Subject[] = await SubjectsService.listSubjects();
        setSubjects(subjectsData);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar las asignaturas.',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
    fetchStudents();
    fetchScores(); // Cargar asignaciones al montar
  }, []);

  // Función para manejar la asignación de asignatura
  const handleAssignSubject = async () => {
    if (!selectedStudentId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar un estudiante.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!selectedSubjectId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar una asignatura.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      setAssigning(true);

      const assignmentData: AssignmentData = {
        id_student: Number(selectedStudentId),
        id_subject: Number(selectedSubjectId)
      };

      const response = await ScoresService.createScores(assignmentData);

      if (response === 200 || response === 201) {
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Asignatura asignada exitosamente al estudiante.',
          confirmButtonColor: '#3085d6'
        });
        // Limpiar selects
        setSelectedStudentId('');
        setSelectedSubjectId('');
        // Recargar la lista de asignaciones
        await fetchScores();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al asignar la asignatura. Por favor, intente de nuevo.',
          confirmButtonColor: '#3085d6'
        });
      }
    } catch (err) {
      console.error("Failed to assign subject:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al asignar la asignatura.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setAssigning(false);
    }
  };

  const isLoading = loadingStudents || loadingSubjects;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-5">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Asignar Asignatura a Estudiante
          </h2>
          <div>
            {/* Select para el estudiante */}
            <div className="mb-4">
              <label htmlFor="studentSelect" className="block text-gray-700 text-sm font-bold mb-2">
                Estudiante *
              </label>
              <select
                id="studentSelect"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}
                disabled={assigning || isLoading}
                required
              >
                <option value="">Seleccione un estudiante...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.nombres_apellidos} - {student.grado}
                  </option>
                ))}
              </select>
            </div>

            {/* Select para la asignatura */}
            <div className="mb-6">
              <label htmlFor="subjectSelect" className="block text-gray-700 text-sm font-bold mb-2">
                Asignatura *
              </label>
              <select
                id="subjectSelect"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value ? Number(e.target.value) : '')}
                disabled={assigning || isLoading}
                required
              >
                <option value="">Seleccione una asignatura...</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón para asignar */}
            <div className="mb-4">
              <button
                onClick={handleAssignSubject}
                disabled={assigning || !selectedStudentId || !selectedSubjectId || isLoading}
                className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${assigning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {assigning ? 'Asignando...' : 'Asignar Asignatura'}
              </button>
            </div>

            {/* Información adicional */}
            {selectedStudentId && selectedSubjectId && !assigning && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Resumen:</strong> Se asignará la asignatura "
                  {subjects.find(s => s.id === selectedSubjectId)?.nombre}"
                  al estudiante "
                  {students.find(s => s.id === selectedStudentId)?.nombres_apellidos}".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ListScores
        scores={scores}
        loading={loadingScores}
        error={errorScores}
        fetchScores={fetchScores}
      />
    </div>
  );
}