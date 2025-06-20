import { useEffect, useState } from "react";
import { StudentService } from "../api";
import type { StudentsByTeacherId } from "../types/global";
import { TeacherStudentCard } from "../components/TeacherStudentCard";
import { Jornada } from "../enums/Jornada";

export default function HomeTeacher() {
  const [students, setStudents] = useState<StudentsByTeacherId[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJornada, setSelectedJornada] = useState<string>('');
  const [selectedGrado, setSelectedGrado] = useState<string>('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const studentsData = await StudentService.getStudentsByTeacher();
        setStudents(studentsData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Error al cargar los estudiantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filtrar estudiantes según término de búsqueda, jornada y grado
  const filteredStudents = students
    .map(s => ({
      ...s,
      students: s.students.filter(student =>
        (student.nombres_apellidos.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedJornada ? s.jornada === selectedJornada : true) &&
        (selectedGrado ? student.grado === selectedGrado : true)
      )
    }))
    .filter(s => s.students.length > 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Estudiantes</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Buscar estudiante..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedJornada}
            onChange={e => setSelectedJornada(e.target.value)}
          >
            <option value="">Todas las jornadas</option>
            {Object.values(Jornada).map(j => (
              <option key={j} value={j}>{j.charAt(0).toUpperCase() + j.slice(1)}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedGrado}
            onChange={e => setSelectedGrado(e.target.value)}
          >
            <option value="">Todos los grados</option>
            {[6, 7, 8, 9, 10, 11].map(grado => (
              <option key={grado} value={String(grado)}>{grado}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        {loading && <div className="text-center py-8 text-gray-500">Cargando estudiantes...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!loading && !error && (
          filteredStudents.length > 0 ? (
            filteredStudents.map(s => (
              <div className="m-5" key={s.nombre_asignatura + s.jornada}>
                <h2 className="text-lg font-semibold text-gray-600 my-5">{s.nombre_asignatura} - {s.jornada.toUpperCase()}</h2>
                {
                  s.students.length > 0 ? (
                    <>
                      {
                        s.students.map(student => (
                          <TeacherStudentCard key={student.id} student={student} />
                        ))
                      }
                    </>
                  ) : (
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