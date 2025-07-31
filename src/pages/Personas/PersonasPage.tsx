import Layout from '../../components/Layout';
import { usePersonas } from '../../hooks/usePersonas';
import { useNavigate } from 'react-router-dom';
import { deletePersona } from '../../services/api';

export default function PersonasPage() {
  const {
    personas,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    suggestions,
    setPage,
    handleSearch,
    fetchPersonas,
  } = usePersonas();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta persona?')) {
      try {
        await deletePersona(id);
        fetchPersonas(); // Refresh the list
      } catch (err) {
        alert('Error al eliminar la persona');
      }
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Personas</h1>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={() => navigate('/personas/crear')}>
            Agregar Persona
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {(Array.isArray(suggestions) ? suggestions : []).length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-700 rounded mt-1">
              {(Array.isArray(suggestions) ? suggestions : []).map((s) => (
                <li 
                  key={s.id}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    handleSearch(s.nombre || '');
                  }}
                >
                  {s.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="min-w-full bg-gray-800 rounded">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 text-sm sm:text-base">Nombre</th>
                <th className="p-2 text-sm sm:text-base">RUT</th>
                <th className="p-2 text-sm sm:text-base hidden md:table-cell">País</th>
                <th className="p-2 text-sm sm:text-base hidden lg:table-cell">Ciudad</th>
                <th className="p-2 text-sm sm:text-base hidden xl:table-cell">Dirección</th>
                <th className="p-2 text-sm sm:text-base">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(personas) ? personas : []).map((p) => (
                <tr key={p.id} className="border-b border-gray-700">
                  <td className="p-2 text-sm sm:text-base">{p.nombre}</td>
                  <td className="p-2 text-sm sm:text-base">{p.rut}</td>
                  <td className="p-2 text-sm sm:text-base hidden md:table-cell">{p.pais}</td>
                  <td className="p-2 text-sm sm:text-base hidden lg:table-cell">{p.ciudad}</td>
                  <td className="p-2 text-sm sm:text-base hidden xl:table-cell">{p.direccion}</td>
                  <td className="p-2">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <button 
                        className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs sm:text-sm"
                        onClick={() => navigate(`/personas/editar/${p.id}`)}>
                        Editar
                      </button>
                      <button 
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs sm:text-sm"
                        onClick={() => handleDelete(p.id.toString())}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 w-full sm:w-auto">Anterior</button>
          <span className="text-sm sm:text-base">Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 w-full sm:w-auto">Siguiente</button>
        </div>
      </div>
    </Layout>
  );
}