import { useEffect, useState } from "react";
import { StudentCard } from "../components/Card";
import { StudentService } from "../api";
import type { Student, Observaciones } from "../types/global";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/UserRole";
import { Jornada } from "../enums/Jornada";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import { SubjectsService } from "../services/subjects.service";

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
  const [ciclos, setCiclos] = useState<{ id: number, nombre_ciclo: string }[]>([]);
  const [selectedCiclo, setSelectedCiclo] = useState<string>("");
  const [cicloBoletin, setCicloBoletin] = useState<string>("");
  const [definitivas, setDefinitivas] = useState(false);

  // New state for Excel loading
  const [loadingExcel, setLoadingExcel] = useState(false);

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
  const fetchCiclos = async () => {
    try {
      const ciclosData = await SubjectsService.listCiclos();
      setCiclos(ciclosData);
    } catch (err) {
      console.error("Failed to fetch ciclos:", err);
    }
  };
  useEffect(() => {
    fetchStudents();
    fetchCiclos();
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
    setCicloBoletin(""); // Reset cicloBoletin
    setStudentsByGrade([]);
    setObservaciones([]);
  };

  const handleCloseBoletinModal = () => {
    setShowBoletinModal(false);
    setGradoBoletin('');
    setJornadaBoletin(null);
    setCicloBoletin(""); // Reset cicloBoletin
    setStudentsByGrade([]);
    setObservaciones([]);
  };

  // Cambia handleSelectGrado para solo cargar estudiantes
  const handleSelectGrado = async (
    grado: string,
    jornada: Jornada,
  ) => {
    setLoadingBoletin(true);
    try {
      const studentsGrade = await StudentService.getStudentByGrade(grado, jornada);

      setStudentsByGrade(studentsGrade);
      if (studentsGrade.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No hay estudiantes",
          text: "No se encontraron estudiantes para el grado, jornada y ciclo seleccionados.",
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
      const obsToSend = observaciones.map(obs => ({
        ...obs,
        obse: obs.obse || ''
      }));
      const response = await StudentService.getBoletinGrade(
        gradoBoletin,
        jornadaBoletin!,
        obsToSend,
        cicloBoletin,
        definitivas
      );
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

  // --- Implementación de la lógica para handleExcel ---
  const handleExcel = async () => {
    setLoadingExcel(true); // Start loading
    try {
      const response = await StudentService.getExcel();
      const excelBlob = response.data;

      let filename = `estudiantes_data.xlsx`; // Default filename
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      saveAs(excelBlob, filename);

      Swal.fire({
        icon: 'success',
        title: 'Excel descargado exitosamente',
        text: 'El archivo de datos de estudiantes se ha descargado.',
        confirmButtonText: 'Aceptar'
      });
    } catch (error: any) {
      console.error('Error al descargar el archivo Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de descarga',
        text: error?.message || 'Hubo un problema al intentar descargar el archivo Excel.',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoadingExcel(false); // End loading
    }
  };

  return (
    <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4 mb-4">
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
          {ciclos.length > 0 && (
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              value={selectedCiclo}
              onChange={e => setSelectedCiclo(e.target.value)}
            >
              <option value="">Todos los ciclos</option>
              {ciclos.map(ciclo => (
                <option key={ciclo.id} value={ciclo.nombre_ciclo}>{ciclo.nombre_ciclo}</option>
              ))}
            </select>
          )}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
            onClick={handleUpdate}
            disabled={loading || filteredStudents.length === 0}
            type="button"
          >
            Actualizar
          </button>
          <div className="flex gap-2 w-full sm:w-auto"> {/* Flex container for boletines and excel buttons */}
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex-1"
              onClick={handleOpenBoletinModal}
              type="button"
            >
              Boletines por grado
            </button>
            {/* Excel Button */}
            <button
              className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              onClick={handleExcel}
              type="button"
              title="Exportar a Excel"
              disabled={loadingExcel} // Disable button while loading
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 8.586V5a1 1 0 112 0v3.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Boletines por grado */}
      {showBoletinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
            {loadingBoletin ? (
              <div className="flex flex-col items-center justify-center py-20">
                <span className="text-lg font-semibold text-gray-700 mb-4">Generando los boletines...</span>
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            ) : (
              <>
                {/* Header del modal */}
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-800">Generar boletines por grado</h3>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-1"
                    onClick={handleCloseBoletinModal}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                {/* Contenido del modal */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Formulario de selección */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {/* Grado */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Grado:</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                      {/* Jornada */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Jornada:</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                      {/* Ciclo */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Ciclo:</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={cicloBoletin}
                          onChange={e => setCicloBoletin(e.target.value)}
                        >
                          <option value="">Seleccionar ciclo</option>
                          {ciclos.map(ciclo => (
                            <option key={ciclo.id} value={ciclo.nombre_ciclo}>{ciclo.nombre_ciclo}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Checkbox y botón */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center">
                        <input
                          id="definitivas"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={definitivas}
                          onChange={e => setDefinitivas(e.target.checked)}
                        />
                        <label htmlFor="definitivas" className="ml-2 block text-sm text-gray-700">
                          Notas definitivas
                        </label>
                      </div>

                      <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={async () => {
                          if (gradoBoletin && jornadaBoletin && cicloBoletin) {
                            await handleSelectGrado(gradoBoletin, jornadaBoletin);
                          } else {
                            Swal.fire({
                              icon: "warning",
                              title: "Faltan datos",
                              text: "Debes seleccionar grado, jornada y ciclo.",
                              confirmButtonText: "Aceptar"
                            });
                          }
                        }}
                        disabled={!gradoBoletin || !jornadaBoletin || !cicloBoletin}
                        type="button"
                      >
                        Mostrar estudiantes
                      </button>
                    </div>
                  </div>

                  {/* Lista de estudiantes */}
                  {studentsByGrade.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Estudiantes del grado {gradoBoletin} - Jornada {jornadaBoletin && jornadaBoletin.charAt(0).toUpperCase() + jornadaBoletin.slice(1)}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {observaciones.map(obs => { // Iterate over observations to ensure consistency
                          const student = studentsByGrade.find(s => s.id === obs.id_student);
                          if (!student) return null; // Should not happen if data is consistent

                          return (
                            <div key={student.id} className="bg-gray-50 border rounded-lg p-4 space-y-3">
                              <div className="font-medium text-gray-800">{student.nombres_apellidos}</div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Observaciones:
                                </label>
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                  rows={2}
                                  placeholder="Observaciones (opcional)"
                                  value={obs.obse}
                                  onChange={e =>
                                    handleObservacionChange(student.id, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer del modal */}
                {studentsByGrade.length > 0 && (
                  <div className="border-t p-6 bg-gray-50">
                    <div className="flex justify-end">
                      <button
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Loading overlay for Excel download */}
      {loadingExcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-70 text-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <span className="text-lg font-semibold">Descargando Excel...</span>
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