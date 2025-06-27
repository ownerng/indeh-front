import { useEffect, useState } from "react";
import type { StudentCorte } from "../types/global";
import { ScoresService } from "../services/scores.service";

interface ScoreData {
  corte1: number | null;
  corte2: number | null;
  corte3: number | null;
  definitiva: number | null;
}

interface TeacherStudentCardProps {
  student: StudentCorte;
  nombre_asignatura: string;
}

export const TeacherStudentCard = ({ student, nombre_asignatura }: TeacherStudentCardProps) => {
  const [scores, setScores] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const data = await ScoresService.getScoreByStudentId(student.id);
        let score = null;
        if (Array.isArray(data)) {
          score = data.find(
            (item) =>
              item.id_subject &&
              item.id_subject.nombre === nombre_asignatura &&
              item.id_student &&
              item.id_student.id === student.id
          );
        } else if (
          data &&
          data.id_subject &&
          data.id_subject.nombre === nombre_asignatura &&
          data.id_student &&
          data.id_student.id === student.id
        ) {
          score = data;
        }
        if (score) {
          setScores({
            corte1: score.corte1 ?? 0,
            corte2: score.corte2 ?? 0,
            corte3: score.corte3 ?? 0,
            definitiva: score.notadefinitiva ?? 0,
          });
        } else {
          setScores({
            corte1: 0,
            corte2: 0,
            corte3: 0,
            definitiva: 0,
          });
        }
      } catch (error) {
        setScores({
          corte1: 0,
          corte2: 0,
          corte3: 0,
          definitiva: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, [student.id, nombre_asignatura]);

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow">
      <div className="w-2/5">
        <div className="font-medium text-gray-800">{student.nombres_apellidos}</div>
        <div className="text-xs text-gray-500">Grado: {student.grado}</div>
        <div className="flex space-x-2 mt-1 text-sm">
          <span>Corte 1: <b>{loading ? "..." : scores?.corte1 ?? 0}</b></span>
          <span>Corte 2: <b>{loading ? "..." : scores?.corte2 ?? 0}</b></span>
          <span>Corte 3: <b>{loading ? "..." : scores?.corte3 ?? 0}</b></span>
          <span>Def: <b>{loading ? "..." : scores?.definitiva ?? 0}</b></span>
        </div>
      </div>
      <div className="flex space-x-2 w-1/3 justify-end">        
        {/* Aquí puedes agregar más acciones si lo necesitas */}
      </div>
    </div>
  );
};