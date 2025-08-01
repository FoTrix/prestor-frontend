"use client"

import Layout from "../../components/Layout"
import { useNavigate } from "react-router-dom"
import { useClient } from "../../hooks/useClient"

export default function ClientPage() {
  const navigate = useNavigate()
  const { client, budgets, page, totalPages, loading, setPage } = useClient()

  if (loading) return <div className="text-white p-8">Cargando...</div>
  if (!client) return <div className="text-white p-8">Cliente no encontrado</div>

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header con información del cliente */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
                  {client.nombre || client.username || client.email || "No especificado"}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm sm:text-base">
                  <div>
                    <span className="font-semibold text-gray-300">País:</span>
                    <span className="ml-2">{client.pais || "No especificado"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300">Ciudad:</span>
                    <span className="ml-2">{client.ciudad || "No especificado"}</span>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <span className="font-semibold text-gray-300">RUT:</span>
                    <span className="ml-2">{client.rut || "No especificado"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-gray-300">Dirección:</span>
                    <span className="ml-2">{client.direccion || "No especificado"}</span>
                  </div>
                </div>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors w-full sm:w-auto sm:min-w-[200px]"
                onClick={() => navigate(`/presupuestos/crear?cliente=${client.id}`)}
              >
                Crear nuevo presupuesto
              </button>
            </div>
          </div>

          {/* Sección de presupuestos */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Presupuestos</h2>

            {(Array.isArray(budgets) ? budgets : []).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg mb-2">No hay presupuestos disponibles</p>
                <p className="text-sm">Crea el primer presupuesto para este cliente</p>
              </div>
            ) : (
              <>
                {/* Vista de tabla para desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left rounded overflow-hidden">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-3">Código</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Valor neto</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgets.map((b) => (
                        <tr key={b.id} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="p-3 font-mono text-blue-400">{b.codigo}</td>
                          <td className="p-3">{new Date(b.fechaElaboracion).toLocaleDateString()}</td>
                          <td className="p-3">${b.baseImponible.toLocaleString()}</td>
                          <td className="p-3 font-semibold">${b.precioLiquido.toLocaleString()}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                b.status === "VALIDO" ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
                              onClick={() => navigate(`/presupuestos/${b.codigo}`)}
                            >
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Vista de cards para móvil y tablet */}
                <div className="lg:hidden space-y-4">
                  {budgets.map((b) => (
                    <div key={b.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-mono text-blue-400 font-semibold text-lg">{b.codigo}</h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold w-fit ${
                                b.status === "VALIDO" ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-300">Fecha:</span>
                              <span className="ml-2">{new Date(b.fechaElaboracion).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-300">Valor neto:</span>
                              <span className="ml-2">${b.baseImponible.toLocaleString()}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-gray-300">Total:</span>
                              <span className="ml-2 font-semibold text-green-400">
                                ${b.precioLiquido.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded transition-colors w-full sm:w-auto"
                          onClick={() => navigate(`/presupuestos/${b.codigo}`)}
                        >
                          Ver Presupuesto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                >
                  ← Anterior
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Página</span>
                  <span className="px-3 py-1 bg-gray-700 rounded font-semibold">{page}</span>
                  <span className="text-sm text-gray-300">de {totalPages}</span>
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
