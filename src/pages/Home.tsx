import { useEffect, useState } from "react";
import { StudentCard } from "../components/Card";
import { StudentService } from "../api";
import type { Student, Observaciones } from "../types/global";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/UserRole";
import { Jornada } from "../enums/Jornada";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJornada, setSelectedJornada] = useState<string>('');
  const [selectedGrado, setSelectedGrado] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useAuth();

  // Para el modal de boletines por grado
  const [showBoletinModal, setShowBoletinModal] = useState(false);
  const [gradoBoletin, setGradoBoletin] = useState<string>('');
  const [jornadaBoletin, setJornadaBoletin] = useState<Jornada | null>();
  const [studentsByGrade, setStudentsByGrade] = useState<Student[]>([]);
  const [observaciones, setObservaciones] = useState<Observaciones[]>([]);
  const [loadingBoletin, setLoadingBoletin] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      if (userRole === UserRole.EJECUTIVO) {
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
      await StudentService.updateAllScores();
      await fetchStudents();
      await Swal.fire({
        icon: "success",
        title: "Notas actualizadas correctamente.",
        confirmButtonText: "Aceptar"
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error al actualizar las notas.",
        text: error?.message || JSON.stringify(error),
        confirmButtonText: "Aceptar"
      });
      console.error("Error en handleUpdate:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Boletines por grado ---
  const handleOpenBoletinModal = () => {
    setShowBoletinModal(true);
    setGradoBoletin('');
    setJornadaBoletin(null);
    setStudentsByGrade([]);
    setObservaciones([]);
  };

  const handleCloseBoletinModal = () => {
    setShowBoletinModal(false);
    setGradoBoletin('');
    setJornadaBoletin(null);
    setStudentsByGrade([]);
    setObservaciones([]);
  };

  // Cambia handleSelectGrado para solo cargar estudiantes
  const handleSelectGrado = async (grado: string, jornada: Jornada) => {
    setLoadingBoletin(true);
    try {
      const studentsGrade = await StudentService.getStudentByGrade(grado, jornada);

      setStudentsByGrade(studentsGrade);
      if (studentsGrade.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No hay estudiantes",
          text: "No se encontraron estudiantes para el grado y jornada seleccionados.",
          confirmButtonText: "Aceptar"
        });
      }
      setObservaciones(
        studentsGrade.map((student: Student) => ({
          id_student: student.id,
          nombres_apellidos: student.nombres_apellidos,
          obse: ''
        }))
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar los estudiantes del grado.",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setLoadingBoletin(false);
    }
  };

  const handleObservacionChange = (id_student: number, value: string) => {
    setObservaciones(prev =>
      prev.map(obs =>
        obs.id_student === id_student ? { ...obs, obse: value } : obs
      )
    );
  };

  const handleDownloadBoletines = async () => {
    try {
      setLoadingBoletin(true);
      // Si no hay observaciones, inicializa con '' para todos
      const obsToSend = observaciones.map(obs => ({
        ...obs,
        obse: obs.obse || ''
      }));
      const response = await StudentService.getBoletinGrade(gradoBoletin, obsToSend);
      const pdfBlob = response.data;
      // Intenta obtener el nombre del archivo del header
      let filename = `boletines_grado_${gradoBoletin}.pdf`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      saveAs(pdfBlob, filename);
      Swal.fire({
        icon: "success",
        title: "Boletines descargados correctamente.",
        confirmButtonText: "Aceptar"
      });
      handleCloseBoletinModal();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al descargar los boletines.",
        text: error?.message || JSON.stringify(error),
        confirmButtonText: "Aceptar"
      });
    } finally {
      setLoadingBoletin(false);
    }
  };

  return (
    <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
          Listado de Estudiantes
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            value={selectedJornada}
            onChange={e => setSelectedJornada(e.target.value)}
          >
            <option value="">Todas las jornadas</option>
            {Object.values(Jornada).map(j => (
              <option key={j} value={j}>{j.charAt(0).toUpperCase() + j.slice(1)}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            value={selectedGrado}
            onChange={e => setSelectedGrado(e.target.value)}
          >
            <option value="">Todos los grados</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(grado => (
              <option key={grado} value={String(grado)}>{grado}</option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
            onClick={handleUpdate}
            disabled={loading || filteredStudents.length === 0}
            type="button"
          >
            Actualizar
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto"
            onClick={handleOpenBoletinModal}
            type="button"
          >
            Boletines por grado
          </button>
        </div>
      </div>

      {/* Modal para Boletines por grado */}
      {showBoletinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[95vh] overflow-y-auto flex flex-col items-center justify-center transition-all">
            {loadingBoletin ? (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="text-lg font-semibold text-gray-700 mb-4">Generando los boletines...</span>
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 w-full">
                  <h3 className="text-lg font-semibold">Generar boletines por grado</h3>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-xl"
                    onClick={handleCloseBoletinModal}
                    type="button"
                  >
                    ×
                  </button>
                </div>
                <div className="mb-4 w-full flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Seleccionar grado:</label>
                    <select
                      className="px-4 py-2 border rounded-md w-full"
                      value={gradoBoletin}
                      onChange={e => {
                        setGradoBoletin(e.target.value);
                        setStudentsByGrade([]);
                        setObservaciones([]);
                      }}
                    >
                      <option value="">Seleccionar grado</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(grado => (
                        <option key={grado} value={String(grado)}>{grado}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Seleccionar jornada:</label>
                    <select
                      className="px-4 py-2 border rounded-md w-full"
                      value={jornadaBoletin ?? ""}
                      onChange={e => {
                        setJornadaBoletin(e.target.value as Jornada);
                        setStudentsByGrade([]);
                        setObservaciones([]);
                      }}
                    >
                      <option value="">Seleccionar jornada</option>
                      {Object.values(Jornada).map(j => (
                        <option key={j} value={j}>{j.charAt(0).toUpperCase() + j.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={async () => {
                        if (gradoBoletin && jornadaBoletin) {
                          await handleSelectGrado(gradoBoletin, jornadaBoletin);

                        }
                      }}
                      disabled={!gradoBoletin || !jornadaBoletin}
                      type="button"
                    >
                      Mostrar estudiantes
                    </button>
                  </div>
                </div>
                {studentsByGrade.length > 0 && (
                  <div className="w-full">
                    <h4 className="font-semibold mb-2">
                      Estudiantes del grado {gradoBoletin} - Jornada {jornadaBoletin && jornadaBoletin.charAt(0).toUpperCase() + jornadaBoletin.slice(1)}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {studentsByGrade.map(student => (
                        <div key={student.id} className="border rounded-md p-3 flex flex-col">
                          <span className="font-medium mb-2">{student.nombres_apellidos}</span>
                          <input
                            type="text"
                            className="px-2 py-1 border rounded-md"
                            placeholder="Observaciones (opcional)"
                            value={
                              observaciones.find(obs => obs.id_student === student.id)?.obse || ""
                            }
                            onChange={e =>
                              handleObservacionChange(student.id, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        onClick={handleDownloadBoletines}
                        disabled={loadingBoletin || studentsByGrade.length === 0}
                        type="button"
                      >
                        Descargar boletines
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        {loading && <div className="text-center py-8 text-gray-500">Cargando estudiantes...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!loading && !error && (
          filteredStudents.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredStudents.map(student => (
                <StudentCard key={student.id} student={student} onUserAction={fetchStudents} />
              ))}
            </div>
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