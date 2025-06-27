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
     
      <ListSubjects
        subjects={subjects}
        loading={loadingSubjects}
        error={errorSubjects}
        fetchSubjects={fetchSubjects}
      />
    </div>
  );
}