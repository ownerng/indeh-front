import { useEffect, useState } from "react";
import { StudentService } from "../api";
import type {  StudentsByTeacherId } from "../types/global";
import { TeacherStudentCard } from "../components/TeacherStudentCard";
export default function HomeTeacher() {
  const [students, setStudents] = useState<StudentsByTeacherId[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors

          const studentsData = await StudentService.getStudentsByTeacher();
          console.log("Fetched students:", studentsData); 
          setStudents(studentsData);
        
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Error al cargar los estudiantes."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchStudents();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Filtrar estudiantes según término de búsqueda
  const filteredStudents = students.filter(s =>
    s.students.filter(student => student.nombres_apellidos.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Listado de Estudiantes</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            {loading && <div className="text-center py-8 text-gray-500">Cargando estudiantes...</div>}
            {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
            {!loading && !error && (
                filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <div className="m-5">
                      <h2 className="text-lg font-semibold text-gray-600 my-5">{s.nombre_asignatura} - {s.jornada.toUpperCase()}</h2>
                      {
                        s.students.length > 0 ? (
                          <>
                            {
                              s.students.map(student => (
                                <TeacherStudentCard key={student.id} student={student} />
                              ))
                            }</>
                        ):(
                          <div className=''>
                            No hay estudiantes asignados en esta materia
                          </div>
                        )
                      }
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron estudiantes
                  </div>
                )
            )}
          </div>
        </div>
  );
}