import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import type { AssignmentData, ScoreResponse, Student, Subject } from "../types/global";
import { StudentService } from "../api";
import { SubjectsService } from "../services/subjects.service";
import { ScoresService } from "../services/scores.service";
import { useNavigate, useParams } from "react-router-dom";



export function UpdateAssingSubject() {
  const { id} = useParams();
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // Cargar estudiantes
  useEffect(() => {
    const fetchId = async () => {
      try {
        setLoadingStudents(true);
        const data: ScoreResponse = await ScoresService.getScoreById(Number(id));
        console.log(data);
        setSelectedStudentId(data.id_student.id);
        setSelectedSubjectId(data.id_subject.id);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al treer los datos.',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        setLoadingStudents(false);
      }
    };
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
    fetchId();
  }, [id]);


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

      const response = await ScoresService.updateScoreById(Number(id),assignmentData);

      if(response === 200 || response === 201) {
        await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Asignatura actualizada exitosamente al estudiante.',
        confirmButtonColor: '#3085d6'
      });
      }
      setSelectedStudentId('');
      setSelectedSubjectId('');
      navigate('/admin/assign-subject')
    } catch (err) {
      console.error("Failed to assign subject:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar la asignatura.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setAssigning(false);
    }
  };

  const isLoading = loadingStudents || loadingSubjects;

  return (
    <>
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Actualizar Asignatura a Estudiante</h2>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="text-center py-8 text-gray-500">
            Cargando datos...
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            {/* Select para el estudiante */}
            <div>
              <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Estudiante
              </label>
              <select
                id="studentSelect"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}
                disabled={assigning}
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
            <div>
              <label htmlFor="subjectSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Asignatura
              </label>
              <select
                id="subjectSelect"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value ? Number(e.target.value) : '')}
                disabled={assigning}
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
            <div className="flex justify-end">
              <button
                onClick={handleAssignSubject}
                disabled={assigning || !selectedStudentId || !selectedSubjectId}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {assigning ? 'Actualizando...' : 'Actualizar Asignatura'}
              </button>
            </div>

            {/* Información adicional */}
            {selectedStudentId && selectedSubjectId && !assigning && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Resumen:</strong> Se actualizara la asignatura "
                  {subjects.find(s => s.id === selectedSubjectId)?.nombre}" 
                  al estudiante "
                  {students.find(s => s.id === selectedStudentId)?.nombres_apellidos}".
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </>
  );
}