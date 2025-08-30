import React, { useState, useImperativeHandle, forwardRef } from 'react';
import type { StudentCorte, UpdateCorteResponse } from "../types/global";
import Swal from "sweetalert2";

interface StudentCardProps {
  student: StudentCorte;
  corte: number;
  onSaveGrade?: (id: number, grade: number) => Promise<UpdateCorteResponse>;
}

const StudentCardCorte = forwardRef<any, StudentCardProps>(
  ({ student, corte, onSaveGrade }, ref) => {
    // Initialize grade state with the current corte's score, or an empty string
    const initialGrade = student[`corte${corte}` as keyof StudentCorte] ?? '';
    const [grade, setGrade] = useState<number | string>(initialGrade);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Expose functions to the parent component via ref
    useImperativeHandle(ref, () => ({
      getCurrentGrade: () => {
        // Return the parsed grade, or null if it's not a valid number
        const parsedGrade = parseFloat(String(grade));
        return isNaN(parsedGrade) ? null : parsedGrade;
      }
    }));

    const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Allow empty string for initial input, and numbers (including decimals)
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setGrade(value);
      }
    };

    const handleSave = async () => {
      const parsedGrade = parseFloat(String(grade));

      if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 10) {
        setSaveError('La nota debe ser un número entre 0 y 10.');
        return;
      }

      setIsSaving(true);
      setSaveError(null);
      try {
        // CAMBIO PRINCIPAL: usar student.id_score en lugar de student.id
        await onSaveGrade!(student.id_score, parsedGrade);
        
        Swal.fire({
          icon: 'success',
          title: 'Nota guardada',
          showConfirmButton: false,
          timer: 800
        });
      } catch (err) {
        setSaveError('Error al guardar la nota.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar la nota.',
          confirmButtonText: 'Ok'
        });
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="bg-gray-50 p-4 mb-3 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex-1 mb-2 sm:mb-0 text-gray-700">
          <p className="font-medium text-lg">{student.nombres_apellidos}</p>
          <p className="text-sm">Grado: {student.grado}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={grade}
            onChange={handleGradeChange}
            className="w-24 px-3 py-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nota"
            aria-label={`Nota para ${student.nombres_apellidos} en Corte ${corte}`}
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
        {saveError && <p className="text-red-500 text-sm mt-1 sm:mt-0">{saveError}</p>}
      </div>
    );
  }
);

export { StudentCardCorte };