import { useEffect, useState } from "react";
import { StudentService } from "../api";
import type { BodyCorte2, StudentsByTeacherId } from "../types/global";
import { StudentCardCorte } from "../components/StudentCardCorte";
import { ScoresService } from "../services/scores.service";
import { Jornada } from "../enums/Jornada";

export default function Corte2() {
  const [students, setStudents] = useState<StudentsByTeacherId[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJornada, setSelectedJornada] = useState<string>('');
  const [selectedGrado, setSelectedGrado] = useState<string>('');
  const [selectedMateria, setSelectedMateria] = useState<string>('');
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

  // Obtener materias únicas
  const materias = Array.from(new Set(students.map(s => s.nombre_asignatura)));

  // Filtrar estudiantes según término de búsqueda, jornada, grado y materia
  const filteredStudents = students
    .filter(s => selectedMateria ? s.nombre_asignatura === selectedMateria : true)
    .map(s => ({
      ...s,
      students: s.students
        .filter(student => {
          const search = searchTerm.trim().toLowerCase();
          const nombre = student.nombres_apellidos.toLowerCase();
          // Permite buscar por cualquier palabra del nombre o apellido
          return (
            search === "" ||
            nombre.split(" ").some(word => word.startsWith(search)) ||
            nombre.includes(search)
          );
        })
        .filter(student =>
          (selectedJornada ? s.jornada === selectedJornada : true) &&
          (selectedGrado ? student.grado === selectedGrado : true)
        )
        .sort((a, b) => a.nombres_apellidos.localeCompare(b.nombres_apellidos))
    }))
    .filter(s => s.students.length > 0);

  const handleSaveGrade = async (id: number, grade: number) => {
    try {
      if (typeof grade === "number") {
        const data: BodyCorte2 = { corte2: grade };
        const response = await ScoresService.updateCorte2(id, data);
        return response.data;
      }
    } catch (error) {
      // Manejo de error
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Ingrese las notas del Segundo Corte</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Buscar estudiante..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {materias.length > 0 && (
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMateria}
              onChange={e => setSelectedMateria(e.target.value)}
            >
              <option value="">Todas las materias</option>
              {materias.map(materia => (
                <option key={materia} value={materia}>{materia}</option>
              ))}
            </select>
          )}
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
            {[1,2,3,4,5,6,7,8,9,10,11].map(grado => (
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
                          <StudentCardCorte key={student.id} student={student} corte={2} onSaveGrade={handleSaveGrade}/>
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