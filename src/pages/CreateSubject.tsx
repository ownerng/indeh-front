import { useEffect, useState } from "react";
import type { SubjectResponse } from "../types/global";
import { SubjectsService } from "../services/subjects.service";
import { ListSubjects } from "../components/ListSubjects";

export function CreateSubject() {

  // Estados para la lista de asignaturas
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState<string | null>(null);

  // Estado para la carga de profesores



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
    fetchSubjects();
  }, []);

  

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