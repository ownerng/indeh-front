import { PencilIcon, Trash } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { SubjectResponse } from '../types/global';
import { SubjectsService } from '../services/subjects.service';
import { UserRole } from '../enums/UserRole';

interface SubjectCardProps {
  subject: SubjectResponse; // Asegúrate de que UsersResponse tenga la estructura correcta para el usuario individual
  onUserAction: () => Promise<void>; // Callback para cuando una acción en UserCard requiera refrescar la lista
}

export const SubjectCard = ({ subject, onUserAction }: SubjectCardProps ) => {
    const { userRole } = useAuth();
    const navigate = useNavigate();


    const updateStudent = () => {
        navigate(`/admin/new-subject/${subject.id}/update`)
    }

    const deleteStudent = async () => {
        try {
            const response = await SubjectsService.deleteSubjectById(subject.id);
            if (response === 200 || response === 201) {
                await onUserAction();
            }
        } catch (error) {
            console.error('Error al borrar al studiante:', error);
            alert('Hubo un error al borrar al studiante. Inténtalo de nuevo más tarde.');
        }
    }

    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow">
            <div className="font-medium text-gray-800 w-1/3">{subject.nombre}</div>
            <div className="text-gray-600 w-1/3 text-center font-medium">{subject.jornada}</div>
            <div className="text-gray-600 w-1/3 text-center font-medium">
                {subject.profesor ? subject.profesor.username : "No asignado"}
            </div>
            <div className="flex space-x-2 w-1/3 justify-end">
                {userRole === UserRole.EJECUTIVO && (
                    <>
                        <button onClick={updateStudent} className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors">
                            <PencilIcon size={18} />
                        </button>
                        <button onClick={deleteStudent} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors">
                            <Trash size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};