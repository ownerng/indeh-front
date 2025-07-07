import { useState } from "react"; // Importa useState para el input
import type { StudentCorte, UpdateCorteResponse } from "../types/global";
import { Save } from 'lucide-react';
import Swal from "sweetalert2";

interface StudentCardProps {
  student: StudentCorte;
  corte: number;
  // Nueva prop: función para guardar la nota para un corte específico
  onSaveGrade?: (id: number, grade: number) => Promise<UpdateCorteResponse>;
}

export const StudentCardCorte = ({ student, onSaveGrade,corte }: StudentCardProps) => {
  const [currentGrade, setCurrentGrade] = useState<number | string>(''); // Estado para la nota del input
  const [isSaving, setIsSaving] = useState(false); // Estado para el loader del botón guardar


 
  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite cadena vacía para que el usuario pueda borrar el input
    if (value === '') {
      setCurrentGrade('');
      return;
    }
    const numValue = parseFloat(value);
    // Valida que sea un número y esté entre 1 y 5 (incluyendo decimales)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
      setCurrentGrade(value); // Guarda el string para permitir edición como texto
    }
  };

  const handleSave = async () => {
    const gradeNumber = typeof currentGrade === 'string' ? parseFloat(currentGrade) : currentGrade;
    if (onSaveGrade && !isNaN(gradeNumber) && gradeNumber >= 1 && gradeNumber <= 5) {
      setIsSaving(true);
      try {
        // Espera que la respuesta tenga la nota guardada en res.corte1
        const res = await onSaveGrade(student.id_score, gradeNumber);
        if(corte === 1){
          setCurrentGrade(res.corte1); 
        } else if(corte === 2){
          setCurrentGrade(res.corte2); 
        } else if(corte === 3){
          setCurrentGrade(res.corte3); 
        }
        Swal.fire({ // Muestra SweetAlert2 de éxito
          icon: 'success',
          title: '¡Nota guardada!',
          text: 'La nota se ha guardado correctamente.',
        });
      } catch (error) {
        console.error("Error al guardar la nota:", error);
                Swal.fire({ // Muestra SweetAlert2 de error
          icon: 'error',
          title: 'Error al guardar',
          text: 'Hubo un problema al intentar guardar la nota.',
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      Swal.fire({ // Muestra SweetAlert2 de validación
        icon: 'warning',
        title: 'Entrada inválida',
        text: 'La nota debe ser un número entre 1 y 5.',
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow">
      <div className="font-medium text-gray-800 w-full sm:w-1/3 mb-2 sm:mb-0">{student.nombres_apellidos}</div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-1/3 justify-end items-center">

        {onSaveGrade && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="number"
              min="1"
              max="5"
              step="0.1" // Permite decimales si es necesario, si no, quita esta línea
              value={currentGrade}
              onChange={handleGradeChange}
              placeholder="Nota (1-5)"
              className="w-28 px-3 py-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`p-2 rounded-md transition-colors w-full sm:w-auto
                ${isSaving ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}
              `}
            >
              {isSaving ? 'Guardando...' : <Save size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};