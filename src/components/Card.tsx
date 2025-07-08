import type { CicloResponse, Student } from "../types/global";
import { FileText, PencilIcon, Trash, BookCheck } from "lucide-react";
import { StudentService } from "../api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/UserRole";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { SubjectsService } from "../services/subjects.service";

interface StudentCardProps {
  student: Student;
  onUserAction: () => Promise<void>;
}

export const StudentCard = ({ student, onUserAction }: StudentCardProps) => {
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedCiclo, setSelectedCiclo] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [observacion, setObservacion] = useState("");
  const [ciclos, setCiclos] = useState<CicloResponse[]>(
    []
  );

  const fetchCiclos = async () => {
    try {
      const data = await SubjectsService.listCiclos();
      setCiclos(data);
    } catch (error) {
      console.error("Error al cargar los ciclos", error);
      Swal.fire("Error", "No se pudieron cargar los ciclos", "error");
    }
  };

  const updateStudent = () => {
    navigate(`/admin/home/${student.id}/update`);
  };

  const deleteStudent = async () => {
    try {
      const response = await StudentService.deleteStudentById(student.id);
      if (response === 200 || response === 201) {
        await onUserAction();
      }
    } catch (error) {
      console.error("Error al borrar al estudiante:", error);
      alert("Hubo un error al borrar al estudiante. Inténtalo de nuevo más tarde.");
    }
  };

  const handlePromover = async () => {
    const confirm = await Swal.fire({
      title: "Promover estudiante",
      text: `¿Estás seguro de promover a ${student.nombres_apellidos} al siguiente grado?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, promover",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const response = await StudentService.promoteStudent(student);
        if (response.status === 200 || response.status === 201) {
          await onUserAction();
          Swal.fire("Promovido", response.data.message, "success");
        }
      } catch (error) {
        console.error("Error al promover al estudiante:", error);
        Swal.fire("Error", "No se pudo promover al estudiante. Inténtalo más tarde.", "error");
      } finally {
        setLoading(false);
      }
    }
  }

  const handleBoletin = async () => {
    await fetchCiclos();
    setSelectedCiclo("");
    setIsFinal(false);
    setObservacion("");
    setShowModal(true);
  };

  const generarBoletin = async () => {
    if (!selectedCiclo) {
      return Swal.fire("Ciclo requerido", "Debes seleccionar un ciclo.", "warning");
    }

    setLoading(true);
    try {
      const response = await StudentService.getBoletin(
        student,
        observacion || "",
        selectedCiclo,
        isFinal
      );

      const pdfBlob = response.data;
      const contentDisposition = response.headers["content-disposition"];
      let filename = `boletin_${student.id}.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }

      saveAs(pdfBlob, filename);
      setShowModal(false);
    } catch (error) {
      console.error("Error al generar boletín", error);
      Swal.fire("Error", "Hubo un error al generar el boletín.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="z-51 text-white text-2xl font-medium">Cargando boletín...</div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Generar boletín</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Selecciona un ciclo:</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedCiclo}
                onChange={(e) => setSelectedCiclo(e.target.value)}
              >
                <option value="">-- Selecciona --</option>
                {ciclos.map((ciclo) => (
                  <option key={ciclo.id} value={ciclo.nombre_ciclo}>
                    {ciclo.nombre_ciclo}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Observaciones (opcional):</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Observaciones para el boletín"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                id="isFinal"
                type="checkbox"
                className="mr-2"
                checked={isFinal}
                onChange={(e) => setIsFinal(e.target.checked)}
              />
              <label htmlFor="isFinal" className="text-sm text-gray-700">
                Notas definitivas
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={generarBoletin}
                disabled={loading}
              >
                {loading ? "Generando..." : "Descargar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow gap-2 sm:gap-0">
        <div className="font-medium text-gray-800 w-full sm:w-1/3 text-left">
          {student.nombres_apellidos}
        </div>
        <div className="text-gray-600 w-full sm:w-1/3 text-left sm:text-center font-medium">
          {student.grado}
        </div>
        <div className="flex w-full sm:w-1/3 justify-start sm:justify-end space-x-2 mt-2 sm:mt-0">
          {userRole === UserRole.EJECUTIVO && (
            <>
              <button
                onClick={handleBoletin}
                className="p-2 bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-colors"
              >
                <FileText size={18} />
              </button>
              <button
                onClick={updateStudent}
                className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
              >
                <PencilIcon size={18} />
              </button>
              <button
                onClick={deleteStudent}
                className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              >
                <Trash size={18} />
              </button>
              <button
                onClick={handlePromover}
                className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
              >
                <BookCheck size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
