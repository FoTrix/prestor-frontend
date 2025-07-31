import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getPersonaById, createPersona, updatePersona } from '../../services/api';
import type { Persona } from '../../types/persona';

export default function PersonaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Partial<Persona>>({
    nombre: '',
    rut: '',
    direccion: '',
    ciudad: '',
    pais: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      getPersonaById(id)
        .then((data: Persona) => setPersona(data))
        .catch(() => setError('No se pudo cargar la persona'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersona(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing && id) {
        await updatePersona(id, persona);
      } else {
        await createPersona(persona);
      }
      navigate('/personas');
    } catch (err) {
      setError(isEditing ? 'Error al actualizar la persona' : 'Error al crear la persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full bg-gray-900 text-white flex flex-col min-h-screen px-4 sm:px-6 md:px-8 lg:px-20 mx-auto p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{isEditing ? 'Editar' : 'Agregar'} Persona</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="nombre" className="block mb-1 text-sm sm:text-base">Nombre</label>
            <input type="text" id="nombre" name="nombre" value={persona.nombre || ''} onChange={handleChange} className="w-full p-2 sm:p-3 rounded bg-gray-700 text-sm sm:text-base" required />
          </div>
          <div className="mb-4">
            <label htmlFor="rut" className="block mb-1 text-sm sm:text-base">RUT</label>
            <input type="text" id="rut" name="rut" value={persona.rut || ''} onChange={handleChange} className="w-full p-2 sm:p-3 rounded bg-gray-700 text-sm sm:text-base" />
          </div>
          <div className="mb-4">
            <label htmlFor="direccion" className="block mb-1 text-sm sm:text-base">Dirección</label>
            <input type="text" id="direccion" name="direccion" value={persona.direccion || ''} onChange={handleChange} className="w-full p-2 sm:p-3 rounded bg-gray-700 text-sm sm:text-base" />
          </div>
          <div className="mb-4">
            <label htmlFor="ciudad" className="block mb-1 text-sm sm:text-base">Ciudad</label>
            <input type="text" id="ciudad" name="ciudad" value={persona.ciudad || ''} onChange={handleChange} className="w-full p-2 sm:p-3 rounded bg-gray-700 text-sm sm:text-base" />
          </div>
          <div className="mb-4">
            <label htmlFor="pais" className="block mb-1 text-sm sm:text-base">País</label>
            <input type="text" id="pais" name="pais" value={persona.pais || ''} onChange={handleChange} className="w-full p-2 sm:p-3 rounded bg-gray-700 text-sm sm:text-base" />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 p-2 sm:p-3 rounded disabled:opacity-50 text-sm sm:text-base">
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </button>
        </form>
      </div>
    </Layout>
  );
}