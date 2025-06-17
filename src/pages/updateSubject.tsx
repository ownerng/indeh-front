import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import type { Professor, SubjectData } from "../types/global";
import { authService } from "../services/auth.service";
import { SubjectsService } from "../services/subjects.service";
import { useNavigate, useParams } from "react-router-dom";



export function UpdateSubject() {
    const {id} = useParams();
    const [subjectName, setSubjectName] = useState('');
    const [selectedProfessorId, setSelectedProfessorId] = useState<number | ''>('');
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    // Simular datos de profesores (en tu aplicación real, esto vendría de una API)
    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                setLoading(true);
                const res = await SubjectsService.getSubjectById(Number(id));
                setSubjectName(res.nombre);
                setSelectedProfessorId(res.profesor.id);
                const professorsData: Professor[] = await authService.listProfesores();

                setProfessors(professorsData);
            } catch (err) {
                console.error("Failed to fetch professors:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los profesores.',
                    confirmButtonColor: '#3085d6'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfessors();
    }, []);

    // Función para manejar la creación de la asignatura
    const handleCreateSubject = async () => {
        if (!subjectName.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'El nombre de la asignatura es obligatorio.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        if (!selectedProfessorId) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'Debe seleccionar un profesor.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        try {
            setCreating(true);

            const subjectData: SubjectData = {
                nombre: subjectName.trim(),
                id_profesor: Number(selectedProfessorId)
            };

            const response = await SubjectsService.updateSubjectById(Number(id),subjectData);
            if (response === 200 || response === 201) {

                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Asignatura creada exitosamente.',
                    confirmButtonColor: '#3085d6'
                });
            }
            setSubjectName('');
            setSelectedProfessorId('');
            navigate('/admin/new-subject');
        } catch (err) {
            console.error("Failed to create subject:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al crear la asignatura.',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Actualizar Asignatura</h2>
                </div>

                <div className="mt-6">
                    {loading && (
                        <div className="text-center py-8 text-gray-500">
                            Cargando profesores...
                        </div>
                    )}

                    {!loading && (
                        <div className="space-y-4">
                            {/* Campo para el nombre de la asignatura */}
                            <div>
                                <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la Asignatura
                                </label>
                                <input
                                    id="subjectName"
                                    type="text"
                                    placeholder="Ingrese el nombre de la asignatura..."
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                    disabled={creating}
                                />
                            </div>

                            {/* Select para el profesor */}
                            <div>
                                <label htmlFor="professorSelect" className="block text-sm font-medium text-gray-700 mb-2">
                                    Profesor Asignado
                                </label>
                                <select
                                    id="professorSelect"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedProfessorId}
                                    onChange={(e) => setSelectedProfessorId(e.target.value ? Number(e.target.value) : '')}
                                    disabled={creating}
                                >
                                    <option value="">Seleccione un profesor...</option>
                                    {professors.map(professor => (
                                        <option key={professor.id} value={professor.id}>
                                            {professor.username}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botón para crear */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleCreateSubject}
                                    disabled={creating || !subjectName.trim() || !selectedProfessorId}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {creating ? 'Actualizando...' : 'Actualizar Asignatura'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}