import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../hooks/useClient";

export default function ClientPage() {
  const navigate = useNavigate();
  const {
    client,
    budgets,
    page,
    totalPages,
    loading,
    setPage,
  } = useClient();

  if (loading) return <div className="text-white p-8">Cargando...</div>;
  if (!client) return <div className="text-white p-8">Cliente no encontrado</div>;

  return (
    <Layout>
      <div className="w-full max-w-4xl bg-gray-900 min-h-dvh rounded-lg shadow-lg p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 mx-auto text-white">
        {/* Info cliente */}
        <div className="flex-1 flex flex-col gap-2 bg-gray-900 rounded p-4">
          <div className="font-bold text-lg sm:text-xl">{client.nombre || client.username || client.email || 'No especificado'}</div>
          <div className="text-sm"><span className="font-semibold">País:</span> {client.pais || 'No especificado'}</div>
          <div className="text-sm"><span className="font-semibold">Ciudad:</span> {client.ciudad || 'No especificado'}</div>
          <div className="text-sm"><span className="font-semibold">Dirección:</span> {client.direccion || 'No especificado'}</div>
          <div className="text-xs text-gray-400"><span className="font-semibold">RUT:</span> {client.rut || 'No especificado'}</div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full sm:w-auto"
            onClick={() => navigate(`/presupuestos/crear?cliente=${client.id}`)}
          >
            Crear nuevo presupuesto
          </button>
        </div>
        {/* Tabla presupuestos */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2">Código</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Valor neto</th>
                <th className="p-2">V.L.</th>
                <th className="p-2">Ver</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(budgets) ? budgets : []).map((b) => (
                <tr key={b.id} className="border-b border-gray-800 hover:bg-gray-700">
                  <td className="p-2">{b.codigo}</td>
                  <td className="p-2">{new Date(b.fechaElaboracion).toLocaleDateString()}</td>
                  <td className="p-2">${b.baseImponible.toLocaleString()}</td>
                  <td className="p-2">${b.precioLiquido.toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded"
                      onClick={() => navigate(`/presupuestos/${b.id}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {(Array.isArray(budgets) ? budgets : []).length === 0 && (
                <tr><td colSpan={5} className="text-center p-4 text-gray-400">Sin presupuestos</td></tr>
              )}
            </tbody>
          </table>
          {/* Paginación */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center items-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 w-full sm:w-auto">Anterior</button>
            <span className="text-sm">Página {page} de {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 w-full sm:w-auto">Siguiente</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
