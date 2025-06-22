import { useEffect, useState } from "react";
import { StudentCard } from "../components/Card";
import { StudentService } from "../api";
import type { Student } from "../types/global";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/UserRole";
import { Jornada } from "../enums/Jornada";
import Swal from "sweetalert2";

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJornada, setSelectedJornada] = useState<string>('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const { userRole } = useAuth();

  // Agrega el estado para el grado
  const [selectedGrado, setSelectedGrado] = useState<string>("");

  const fetchStudents = async () => {
    try {
      setLoading(true); 
      setError(null); 
      if(userRole === UserRole.EJECUTIVO){
        const studentsData = await StudentService.getAllStudents();
        setStudents(studentsData);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Error al cargar los estudiantes."); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); 

  const filteredStudents = students
    .filter(student => {
      const search = searchTerm.trim().toLowerCase();
      const nombre = student.nombres_apellidos.toLowerCase();
      return (
        (search === "" ||
          nombre.split(" ").some(word => word.startsWith(search)) ||
          nombre.includes(search)
        ) &&
        (selectedJornada ? student.jornada === selectedJornada : true) &&
        (selectedGrado ? student.grado === selectedGrado : true)
      );
    })
    .sort((a, b) => a.nombres_apellidos.localeCompare(b.nombres_apellidos));

  // Nueva función para actualizar todos los scores de los estudiantes filtrados
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await StudentService.updateAllScores();
      console.log("Scores updated:", res);
      await fetchStudents();
      await Swal.fire({
        icon: "success",
        title: "Notas actualizadas correctamente.",
        confirmButtonText: "Aceptar"
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error al actualizar las notas.",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setLoading(false);
    }
  };

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
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleUpdate}
            disabled={loading || filteredStudents.length === 0}
            type="button"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading && <div className="text-center py-8 text-gray-500">Cargando estudiantes...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!loading && !error && (
          filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <StudentCard key={student.id} student={student} onUserAction={fetchStudents}/>
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