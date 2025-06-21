import { useState } from 'react';
import { Save } from 'lucide-react';
import type { CreateStudentDTO } from '../types/global';
import { StudentService } from '../api';
import Swal from 'sweetalert2';
import { Jornada } from '../enums/Jornada';

export default function NewStudentForm() {
    const [formData, setFormData] = useState<CreateStudentDTO>({
        nombres_apellidos: '',
        tipo_documento: 'TI',
        numero_documento: '',
        expedicion_documento: '',
        fecha_nacimiento: new Date(),
        telefono: '',
        sexo: 'M',
        direccion: '',
        eps: '',
        tipo_sangre: 'A+',
        email: '',
        estado: 'Activo',
        fecha_creacion: new Date(),
        subsidio: '',
        categoria: '',
        jornada: Jornada.MANANA,
        grado: '',
        discapacidad: '',
        fecha_modificacion: new Date(),
        nombres_apellidos_acudiente: '',
        numero_documento_acudiente: '',
        expedicion_documento_acudiente: '',
        telefono_acudiente: '',
        direccion_acudiente: '',
        email_acudiente: '',
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

    // Handler for input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handler for document type radio
    const handleDocumentTypeChange = (type: "CC" | "TI") => {
        setFormData({
            ...formData,
            tipo_documento: type,
        });
    };

    // Handler for sexo radio
    const handleSexoChange = (sexo: "M" | "F") => {
        setFormData({
            ...formData,
            sexo,
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await StudentService.createStudent(formData);
            if (result.status === 200 || result.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario creado!',
                    text: 'El usuario se ha creado exitosamente.',
                });
            }
        } catch (error) {
            console.error('Failed to create student:', error);
        }
    };

    // Helper for label
    const Label = ({ children, obligatorio = false }: { children: React.ReactNode, obligatorio?: boolean }) => (
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {children}
            <span className={`text-xs ml-2 ${obligatorio ? 'text-red-500' : 'text-gray-400'}`}>
                {obligatorio ? 'Obligatorio' : 'Opcional'}
            </span>
        </label>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium text-center mb-6">PRE-MATRÍCULA</h3>
            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* DATOS PERSONALES DEL ESTUDIANTE */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS PERSONALES DEL ESTUDIANTE</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label obligatorio>Apellidos y Nombre</Label>
                            <input
                                type="text"
                                name="nombres_apellidos"
                                value={formData.nombres_apellidos}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Tipo de Documento</Label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="tipo_documento"
                                        checked={formData.tipo_documento === 'TI'}
                                        onChange={() => handleDocumentTypeChange('TI')}
                                        className="mr-1"
                                    />
                                    TI
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="tipo_documento"
                                        checked={formData.tipo_documento === 'CC'}
                                        onChange={() => handleDocumentTypeChange('CC')}
                                        className="mr-1"
                                    />
                                    CC
                                </label>
                            </div>
                        </div>
                        <div>
                            <Label obligatorio>Número de Documento</Label>
                            <input
                                type="text"
                                name="numero_documento"
                                value={formData.numero_documento}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Expedición Documento</Label>
                            <input
                                type="text"
                                name="expedicion_documento"
                                value={formData.expedicion_documento}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Fecha de Nacimiento</Label>
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento ? String(formData.fecha_nacimiento).slice(0, 10) : ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Sexo</Label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="sexo"
                                        checked={formData.sexo === 'M'}
                                        onChange={() => handleSexoChange('M')}
                                        className="mr-1"
                                    />
                                    Masculino
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="sexo"
                                        checked={formData.sexo === 'F'}
                                        onChange={() => handleSexoChange('F')}
                                        className="mr-1"
                                    />
                                    Femenino
                                </label>
                            </div>
                        </div>
                        <div>
                            <Label obligatorio>Dirección</Label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>EPS</Label>
                            <input
                                type="text"
                                name="eps"
                                value={formData.eps}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Tipo de Sangre</Label>
                            <select
                                name="tipo_sangre"
                                value={formData.tipo_sangre}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                        <div>
                            <Label obligatorio>Correo Electrónico</Label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Teléfono</Label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Estado</Label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div>
                            <Label obligatorio>Jornada</Label>
                            <select
                                name="jornada"
                                value={formData.jornada}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                {Object.values(Jornada).map(j => (
                                    <option key={j} value={j}>{j.charAt(0).toUpperCase() + j.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label obligatorio>Grado</Label>
                            <select
                                name="grado"
                                value={formData.grado}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Seleccionar</option>
                                {Array.from({ length: 11 }, (_, i) => i + 1).map(grade => (
                                    <option key={grade} value={String(grade)}>
                                        {grade}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Subsidio</Label>
                            <input
                                type="text"
                                name="subsidio"
                                value={formData.subsidio || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Categoría</Label>
                            <input
                                type="text"
                                name="categoria"
                                value={formData.categoria || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Discapacidad</Label>
                            <input
                                type="text"
                                name="discapacidad"
                                value={formData.discapacidad || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* DATOS DEL ACUDIENTE */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DEL ACUDIENTE</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label obligatorio>Apellidos y Nombres</Label>
                            <input
                                type="text"
                                name="nombres_apellidos_acudiente"
                                value={formData.nombres_apellidos_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Número de Documento</Label>
                            <input
                                type="text"
                                name="numero_documento_acudiente"
                                value={formData.numero_documento_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Expedición Documento</Label>
                            <input
                                type="text"
                                name="expedicion_documento_acudiente"
                                value={formData.expedicion_documento_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Teléfono</Label>
                            <input
                                type="tel"
                                name="telefono_acudiente"
                                value={formData.telefono_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Dirección</Label>
                            <input
                                type="text"
                                name="direccion_acudiente"
                                value={formData.direccion_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label obligatorio>Email</Label>
                            <input
                                type="email"
                                name="email_acudiente"
                                value={formData.email_acudiente}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <Label>Empresa donde labora</Label>
                            <input
                                type="text"
                                name="empresa_acudiente"
                                value={formData.empresa_acudiente || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* DATOS FAMILIARES 1 */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS FAMILIARES (Familiar 1)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label>Apellidos y Nombres</Label>
                            <input
                                type="text"
                                name="nombres_apellidos_familiar1"
                                value={formData.nombres_apellidos_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Número de Documento</Label>
                            <input
                                type="text"
                                name="numero_documento_familiar1"
                                value={formData.numero_documento_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Teléfono</Label>
                            <input
                                type="tel"
                                name="telefono_familiar1"
                                value={formData.telefono_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Parentesco</Label>
                            <input
                                type="text"
                                name="parentesco_familiar1"
                                value={formData.parentesco_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Empresa</Label>
                            <input
                                type="text"
                                name="empresa_familiar1"
                                value={formData.empresa_familiar1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* DATOS FAMILIARES 2 */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-700 border-b pb-1">DATOS FAMILIARES (Familiar 2)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label>Apellidos y Nombres</Label>
                            <input
                                type="text"
                                name="nombres_apellidos_familiar2"
                                value={formData.nombres_apellidos_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Número de Documento</Label>
                            <input
                                type="text"
                                name="numero_documento_familiar2"
                                value={formData.numero_documento_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Teléfono</Label>
                            <input
                                type="tel"
                                name="telefono_familiar2"
                                value={formData.telefono_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Parentesco</Label>
                            <input
                                type="text"
                                name="parentesco_familiar2"
                                value={formData.parentesco_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label>Empresa</Label>
                            <input
                                type="text"
                                name="empresa_familiar2"
                                value={formData.empresa_familiar2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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