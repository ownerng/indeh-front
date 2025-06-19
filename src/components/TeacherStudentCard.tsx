import type { StudentCorte } from "../types/global";

export const TeacherStudentCard = ({ student }: { student: StudentCorte }) => {

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow">
      <div className="font-medium text-gray-800 w-1/3">{student.nombres_apellidos}</div>
      <div className="text-gray-600 w-1/3 text-center font-medium">{student.grado}</div>
      <div className="flex space-x-2 w-1/3 justify-end">        
      </div>
    </div>
  );
};