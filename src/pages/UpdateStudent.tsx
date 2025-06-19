import { useEffect, useState } from 'react';
import { Save} from 'lucide-react';
import type { CreateStudentDTO } from '../types/global';
import { StudentService } from '../api';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateStudentForm() {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateStudentDTO>({
        nombres_apellidos: '',
        tipo_documento: undefined,
        numero_documento: '',
        fecha_expedicion_documento: new Date(), // Storing as string for input type="date"
        fecha_nacimiento: new Date(), // Storing as string for input type="date"
        telefono: '',
        sexo: undefined,
        direccion: '',
        eps: '',
        tipo_sangre: undefined,
        email: '',
        estado: 'Activo', // Default state
        fecha_creacion: new Date(), // Set default creation date (YYYY-MM-DD)
        fecha_modificacion: new Date(), // Set default modification date (YYYY-MM-DD)
        subsidio: '',
        categoria: '',
        modalidad: '',
        grado: '',
        discapacidad: '', // Added discapacidad to initial state
        nombres_apellidos_acudiente: '',
        numero_documento_acudiente: '',
        fecha_expedicion_documento_acudiente: new Date(), 
        telefono_acudiente: '',
        direccion_acudiente: '',
        contacto_emergencia: '',
        empresa_acudiente: '',
        nombres_apellidos_familiar1: '',
        numero_documento_familiar1: '',
        telefono_familiar1: '',
        parentesco_familiar1: '',
        empresa_familiar1: '',
        nombres_apellidos_familiar2: '',
        numero_documento_familiar2: '',
        telefono_familiar2: '',
        parentesco_familiar2: '',
        empresa_familiar2: '',
    });

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const res = await StudentService.getStudentById(Number(id));
                setFormData(res);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStudentData();
    },[id]);

    // Handler for input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

     // Handler for document type checkbox changes
    const handleDocumentTypeChange = (type: "CC" | "TI") => {
        setFormData({
            ...formData,
            tipo_documento: type,
        });
    };


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);

        try {
            const studentId = Number(id);
            const result = await StudentService.updateStudentById(studentId,formData);
            if( result === 200 || result === 201) {
                await Swal.fire({
                          icon: 'success',
                          title: '¡Usuario Actualizado!',
                          text: 'El usuario se ha actualizado exitosamente.',
                        });
                navigate('/admin/home');
            }
            // Here you could add logic to show a success message or redirect
        } catch (error) {
            console.error('Failed to update student:', error);
            // Here you could add logic to show an error message
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium text-center mb-6">Actualizar informacion</h3>

            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* DATOS PERSONALES DEL ESTUDIANTE */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS PERSONALES DEL ESTUDIANTE</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="nombres_apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellidos y Nombre
                            </label>
                            <input
                                type="text"
                                id="nombres_apellidos"
                                name="nombres_apellidos"
                                value={formData.nombres_apellidos}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Apellidos y Nombre completo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Documento Identidad
                            </label>
                            <div className="flex space-x-4"> {/* Increased space */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="ti"
                                        name="tipo_documento"
                                        checked={formData.tipo_documento === 'TI'}
                                        onChange={() => handleDocumentTypeChange('TI')}
                                        className="mr-1 h-4 w-4 text-blue-600 border-gray-300 rounded" // Added tailwind classes
                                    />
                                    <label htmlFor="ti" className="text-sm text-gray-700">TI</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="cc"
                                        name="tipo_documento"
                                        checked={formData.tipo_documento === 'CC'}
                                        onChange={() => handleDocumentTypeChange('CC')}
                                        className="mr-1 h-4 w-4 text-blue-600 border-gray-300 rounded" // Added tailwind classes
                                    />
                                    <label htmlFor="cc" className="text-sm text-gray-700">CC</label>
                                </div>
                            </div>
                        </div>


                        <div>
                            <label htmlFor="numero_documento" className="block text-sm font-medium text-gray-700 mb-1">
                                Identificación No.
                            </label>
                            <input
                                type="text"
                                id="numero_documento"
                                name="numero_documento"
                                value={formData.numero_documento}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                         <div>
                            <label htmlFor="fecha_expedicion_documento" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de expedicion
                            </label>
                            <input
                                type="date"
                                id="fecha_expedicion_documento"
                                name="fecha_expedicion_documento"
                                value={formData.fecha_expedicion_documento.toString()} // Corrected value prop
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                id="fecha_nacimiento"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento.toString()} // Corrected value prop
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
                                Sexo
                            </label>
                            <select
                                id="sexo"
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tipo_sangre" className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Sangre
                            </label>
                            <select
                                id="tipo_sangre"
                                name="tipo_sangre"
                                value={formData.tipo_sangre}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección y barrio
                            </label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                Número de Celular
                            </label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="eps" className="block text-sm font-medium text-gray-700 mb-1">
                                EPS
                            </label>
                            <input
                                type="text"
                                id="eps"
                                name="eps"
                                value={formData.eps}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Discapacidad field is now included in the DTO */}
                        <div>
                             <label htmlFor="discapacidad" className="block text-sm font-medium text-gray-700 mb-1">
                                Discapacidad
                            </label>
                            <input
                                type="text"
                                id="discapacidad"
                                name="discapacidad"
                                value={formData.discapacidad}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                         {/* Grado field with options 6 to 11 */}
                         <div>
                            <label htmlFor="grado" className="block text-sm font-medium text-gray-700 mb-1">
                                Grado
                            </label>
                            <select
                                id="grado"
                                name="grado"
                                value={formData.grado}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar</option>
                                {/* Options from 6 to 11 */}
                                {Array.from({ length: 6 }, (_, i) => 6 + i).map(grade => (
                                     <option key={grade} value={String(grade)}>
                                        {grade}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700 mb-1">
                                Modalidad
                            </label>
                            <input
                                type="text"
                                id="modalidad"
                                name="modalidad"
                                value={formData.modalidad}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                                Categoría
                            </label>
                            <input
                                type="text"
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="subsidio" className="block text-sm font-medium text-gray-700 mb-1">
                                Subsidio
                            </label>
                            <input
                                type="text"
                                id="subsidio"
                                name="subsidio"
                                value={formData.subsidio}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* DATOS DEL ACUDIENTE Y/O PADRE DE FAMILIA */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DEL ACUDIENTE Y/O PADRE DE FAMILIA</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="nombres_apellidos_acudiente" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellidos y Nombres
                            </label>
                            <input
                                type="text"
                                id="nombres_apellidos_acudiente"
                                name="nombres_apellidos_acudiente"
                                value={formData.nombres_apellidos_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="numero_documento_acudiente" className="block text-sm font-medium text-gray-700 mb-1">
                                Identificación No.
                            </label>
                            <input
                                type="text"
                                id="numero_documento_acudiente"
                                name="numero_documento_acudiente"
                                value={formData.numero_documento_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                         {/* Assuming Fecha de expedicion for acudiente is not in the provided DTO.
                            Keeping input but it won't update state based on the provided DTO. */}
                        <div>
                            <label htmlFor="fecha_expedicion_acudiente" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de expedicion {/* This field is not in the provided DTO */}
                            </label>
                            <input
                                type="date"
                                id="fecha_expedicion_documento_acudiente"
                                name="fecha_expedicion_documento_acudiente" // Name doesn't match DTO field
                                value={formData.fecha_expedicion_documento_acudiente.toString()}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="direccion_acudiente" className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección Residencia
                            </label>
                            <input
                                type="text"
                                id="direccion_acudiente"
                                name="direccion_acudiente"
                                value={formData.direccion_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="telefono_acudiente" className="block text-sm font-medium text-gray-700 mb-1">
                                Número de Celular
                            </label>
                            <input
                                type="tel"
                                id="telefono_acudiente"
                                name="telefono_acudiente"
                                value={formData.telefono_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="empresa_acudiente" className="block text-sm font-medium text-gray-700 mb-1">
                                Empresa donde Labora
                            </label>
                            <input
                                type="text"
                                id="empresa_acudiente"
                                name="empresa_acudiente"
                                value={formData.empresa_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="contacto_emergencia" className="block text-sm font-medium text-gray-700 mb-1">
                                Contacto en Caso de Emergencia
                            </label>
                            <input
                                type="tel"
                                id="contacto_emergencia"
                                name="contacto_emergencia"
                                value={formData.contacto_emergencia}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* DATOS FAMILIARES - CONTACTO DE EMERGENCIA (Familiar 1) */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS FAMILIARES (Familiar 1)</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="nombres_apellidos_familiar1" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellidos y Nombres
                            </label>
                            <input
                                type="text"
                                id="nombres_apellidos_familiar1"
                                name="nombres_apellidos_familiar1"
                                value={formData.nombres_apellidos_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="numero_documento_familiar1" className="block text-sm font-medium text-gray-700 mb-1">
                                Identificación No.
                            </label>
                            <input
                                type="text"
                                id="numero_documento_familiar1"
                                name="numero_documento_familiar1"
                                value={formData.numero_documento_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="parentesco_familiar1" className="block text-sm font-medium text-gray-700 mb-1">
                                Parentesco
                            </label>
                            <input
                                type="text"
                                id="parentesco_familiar1"
                                name="parentesco_familiar1"
                                value={formData.parentesco_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="telefono_familiar1" className="block text-sm font-medium text-gray-700 mb-1">
                                Número de Celular
                            </label>
                            <input
                                type="tel"
                                id="telefono_familiar1"
                                name="telefono_familiar1"
                                value={formData.telefono_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="empresa_familiar1" className="block text-sm font-medium text-gray-700 mb-1">
                                Empresa
                            </label>
                            <input
                                type="text"
                                id="empresa_familiar1"
                                name="empresa_familiar1"
                                value={formData.empresa_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                 {/* DATOS FAMILIARES - CONTACTO DE EMERGENCIA (Familiar 2) */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS FAMILIARES (Familiar 2 - Opcional)</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="nombres_apellidos_familiar2" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellidos y Nombres
                            </label>
                            <input
                                type="text"
                                id="nombres_apellidos_familiar2"
                                name="nombres_apellidos_familiar2"
                                value={formData.nombres_apellidos_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="numero_documento_familiar2" className="block text-sm font-medium text-gray-700 mb-1">
                                Identificación No.
                            </label>
                            <input
                                type="text"
                                id="numero_documento_familiar2"
                                name="numero_documento_familiar2"
                                value={formData.numero_documento_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="parentesco_familiar2" className="block text-sm font-medium text-gray-700 mb-1">
                                Parentesco
                            </label>
                            <input
                                type="text"
                                id="parentesco_familiar2"
                                name="parentesco_familiar2"
                                value={formData.parentesco_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="telefono_familiar2" className="block text-sm font-medium text-gray-700 mb-1">
                                Número de Celular
                            </label>
                            <input
                                type="tel"
                                id="telefono_familiar2"
                                name="telefono_familiar2"
                                value={formData.telefono_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="empresa_familiar2" className="block text-sm font-medium text-gray-700 mb-1">
                                Empresa
                            </label>
                            <input
                                type="text"
                                id="empresa_familiar2"
                                name="empresa_familiar2"
                                value={formData.empresa_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>


               

                <div className="flex justify-between pt-4">

                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Save size={18} className="mr-2" />
                        Guardar Estudiante
                    </button>
                </div>
            </form>
        </div>
    );
}