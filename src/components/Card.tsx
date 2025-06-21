import type { Student } from "../types/global";
import { FileText, PencilIcon, Trash } from 'lucide-react';
import { StudentService } from "../api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/UserRole";
import { saveAs } from 'file-saver'; // Importa saveAs de file-saver
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';

interface StudentCardProps {
  student: Student; // Asegúrate de que UsersResponse tenga la estructura correcta para el usuario individual
  onUserAction: () => Promise<void>; // Callback para cuando una acción en UserCard requiera refrescar la lista
}
export const StudentCard = ({ student, onUserAction }: StudentCardProps) => {
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();
  const navigate = useNavigate();


  const updateStudent = () => {
    navigate(`/admin/home/${student.id}/update`)
  }

  const deleteStudent = async () => {
    try {
      const response  = await StudentService.deleteStudentById(student.id);
      if(response === 200 || response === 201){
        await onUserAction(); 
      }
    } catch (error) {
      console.error('Error al borrar al studiante:', error);
      alert('Hubo un error al borrar al studiante. Inténtalo de nuevo más tarde.');
    }
  }

   const handleBoletin = async () => {
    const { value: obse } = await Swal.fire({
      title: 'Observaciones para el boletín',
      input: 'textarea',
      inputLabel: 'Trata de ser lo mas concreto posible',
      inputPlaceholder: 'Escribe aquí las observaciones...',
      showCancelButton: true,
      confirmButtonText: 'Generar boletín',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar una observación para continuar';
        }
        return null;
      }
    });

    if (!obse) return;

    setLoading(true);
    try {
      const response = await StudentService.getBoletin(student.id, obse);

      const pdfBlob = response.data;
      const contentDisposition = response.headers['content-disposition'];
      let filename = `boletin_${student.id}.pdf`; // Nombre por defecto
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      saveAs(pdfBlob, filename);

      console.log(`Boletín '${filename}' descargado exitosamente.`);
    } catch (error) {
      console.error('Error al abrir el boletín:', error);
      alert('Hubo un error al generar o abrir el boletín. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    {
        loading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="z-51 text-white text-2xl font-medium">
              Cargando boletin....
            </div>
          </div>
        )
      }
    
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow">
      
      <div className="font-medium text-gray-800 w-1/3">{student.nombres_apellidos}</div>
      <div className="text-gray-600 w-1/3 text-center font-medium">{student.grado}</div>
      <div className="flex space-x-2 w-1/3 justify-end">
        {userRole === UserRole.EJECUTIVO && (
          <><button onClick={handleBoletin} className="p-2 bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-colors">
              <FileText size={18} />
            </button>
          <button onClick={updateStudent} className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors">
              <PencilIcon size={18} />
            </button>
          <button onClick={deleteStudent} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors">
              <Trash size={18} />
            </button></>
        )
        }
        
      </div>
    </div>
  </>
  );
};