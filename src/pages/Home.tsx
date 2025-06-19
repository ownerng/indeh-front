import { useEffect, useState } from "react";
import { StudentCard } from "../components/Card";
import { StudentService } from "../api";
import type { Student } from "../types/global";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/UserRole";

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const { userRole } = useAuth();

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

  const filteredStudents = students.filter(student =>
    student.nombres_apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grado.toLowerCase().includes(searchTerm.toLowerCase()) 
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
                  filteredStudents.map(student => (
                    // Pass the student object (matching StudentView) to StudentCard
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