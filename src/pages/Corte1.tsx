import { useEffect, useState, useRef } from "react";
import { StudentService } from "../api";
import type { BodyCorte1, CicloResponse, StudentsByTeacherId } from "../types/global";
import { StudentCardCorte } from "../components/StudentCardCorte";
import { ScoresService } from "../services/scores.service";
import { Jornada } from "../enums/Jornada";
import { SubjectsService } from "../services/subjects.service";
import Swal from "sweetalert2";

export default function Corte1() {
  const [students, setStudents] = useState<StudentsByTeacherId[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJornada, setSelectedJornada] = useState<string>('');
  const [selectedGrado, setSelectedGrado] = useState<string>('');
  const [selectedMateria, setSelectedMateria] = useState<string>('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [savingAll, setSavingAll] = useState(false);

  const [ciclos, setCiclos] = useState<CicloResponse[]>([]);
  const [selectedCiclo, setSelectedCiclo] = useState<string>("");

  // Ref para almacenar las referencias a los componentes StudentCardCorte
  const studentCardRefs = useRef<Map<number, any>>(new Map());

  const fetchCiclos = async () => {
    try {
      const subjectsData = await SubjectsService.listCiclos();
      setCiclos(subjectsData);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } 
  };

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

    fetchCiclos();
    fetchStudents();
  }, []);

  // Obtener materias únicas
  const materias = Array.from(new Set(students.map(s => s.nombre_asignatura)));

  // Filtrar y ordenar estudiantes
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
          (selectedGrado ? student.grado === selectedGrado : true)&&
          (selectedCiclo ? s.ciclo === selectedCiclo : true)
        )
        .sort((a, b) => a.nombres_apellidos.localeCompare(b.nombres_apellidos))
    }))
    .filter(s => s.students.length > 0);

  const handleSaveGrade = async (id: number, grade: number) => {
    try {
      if (typeof grade === "number") {
        const data: BodyCorte1 = { corte1: grade };
        const response = await ScoresService.updateCorte1(id, data);
        console.log(`Nota guardada para el estudiante con ID ${id}:`, response);
        return response.data;
      }
    } catch (error) {
      // Manejo de error
      throw error;
    }
  };

  // Función para guardar todas las notas
  const handleSaveAll = async () => {
    const result = await Swal.fire({
      title: '¿Guardar todas las notas?',
      text: 'Se guardarán todas las notas visibles del primer corte.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar todas',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setSavingAll(true);
    let savedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    try {
      // Recopilar todas las notas de los estudiantes visibles
      const gradesToSave: { id: number, grade: number, studentName: string }[] = [];
      
      filteredStudents.forEach(subject => {
        subject.students.forEach(student => {
          const cardRef = studentCardRefs.current.get(student.id);
          if (cardRef && cardRef.getCurrentGrade) {
            const currentGrade = cardRef.getCurrentGrade();
            if (currentGrade !== null && currentGrade !== undefined && currentGrade >= 0) {
              gradesToSave.push({
                id: student.id_score,
                grade: currentGrade,
                studentName: student.nombres_apellidos
              });
            }
          }
        });
      });

      if (gradesToSave.length === 0) {
        await Swal.fire({
          icon: 'warning',
          title: 'No hay notas para guardar',
          text: 'No se encontraron notas válidas para guardar.',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      // Guardar cada nota
      for (const item of gradesToSave) {
        try {
          await handleSaveGrade(item.id, item.grade);
          savedCount++;
        } catch (error) {
          errorCount++;
          errors.push(`${item.studentName}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }

      // Mostrar resultado
      if (errorCount === 0) {
        await Swal.fire({
          icon: 'success',
          title: 'Notas guardadas exitosamente',
          text: `Se guardaron ${savedCount} notas correctamente.`,
          confirmButtonText: 'Aceptar'
        });
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Guardado parcialmente completado',
          html: `
            <p><strong>Guardadas:</strong> ${savedCount} notas</p>
            <p><strong>Errores:</strong> ${errorCount} notas</p>
            ${errors.length > 0 ? `<details><summary>Ver errores</summary><ul style="text-align: left; margin-top: 10px;">${errors.map(e => `<li>${e}</li>`).join('')}</ul></details>` : ''}
          `,
          confirmButtonText: 'Aceptar'
        });
      }

    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar las notas',
        text: error instanceof Error ? error.message : 'Error desconocido',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setSavingAll(false);
    }
  };

  // Función para registrar referencias de los componentes StudentCardCorte
  const registerStudentCardRef = (studentId: number, ref: any) => {
    if (ref) {
      studentCardRefs.current.set(studentId, ref);
    } else {
      studentCardRefs.current.delete(studentId);
    }
  };

  // Contar estudiantes visibles
  const totalVisibleStudents = filteredStudents.reduce((total, subject) => total + subject.students.length, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col justify-between items-start mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Ingrese las notas del Primer Corte
          </h2>
          
          {totalVisibleStudents > 0 && (
            <button
              onClick={handleSaveAll}
              disabled={savingAll || loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingAll ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Guardar todas ({totalVisibleStudents})
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 w-full">
          <input
            type="text"
            placeholder="Buscar estudiante..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
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
          
          {ciclos.length > 0 && (
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCiclo}
              onChange={e => setSelectedCiclo(e.target.value)}
            >
              <option value="">Todos los ciclos</option>
              {ciclos.map(materia => (
                <option key={materia.id} value={materia.nombre_ciclo}>{materia.nombre_ciclo}</option>
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
              <div className="m-5" key={s.nombre_asignatura + s.jornada + (s.ciclo ?? 'sin ciclo')+Math.random()}>
                <h2 className="text-lg font-semibold text-gray-600 my-5">{s.nombre_asignatura} - {s.jornada.toUpperCase()} - {s.ciclo ?? 'sin ciclo'}</h2>
                {
                  s.students.length > 0 ? (
                    <>
                      {
                        s.students.map(student => (
                          <StudentCardCorte 
                            key={student.id} 
                            student={student} 
                            corte={1} 
                            onSaveGrade={handleSaveGrade}
                            ref={(ref) => registerStudentCardRef(student.id, ref)}
                          />
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