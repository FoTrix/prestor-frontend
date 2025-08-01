"use client"

import Layout from "../../components/Layout"
import { useDashboard } from "../../hooks/useDashboard"

const PAGE_SIZE = 5

const Dashboard = () => {
  const { profile, clients, budgets, userPage, totalUserPages, loading, setUserPage, navigate } = useDashboard()

  const paginatedClients = clients.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE)

  if (loading) return <div className="text-white p-8">Cargando...</div>

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col py-10 px-10 gap-6">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
          Bienvenido{profile ? `, ${profile.nombre || profile.username || profile.email || ""}` : ""}
        </h2>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Columna izquierda: Clientes */}
          <section className="flex-1 min-w-[300px]">
            <h3 className="font-semibold mb-2">Clientes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {paginatedClients.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-800 rounded-lg p-4 flex flex-col items-start shadow-md cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => navigate(`/clientes/${c.id}`)}
                  title="Ver cliente"
                >
                  <span className="font-bold text-lg">{c.nombre || c.email || c.rut || "Cliente"}</span>
                  <span className="text-sm text-gray-400">{c.ciudad ? `(${c.ciudad})` : ""}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 justify-center md:justify-start">
              <button
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                disabled={userPage === 1}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Página {userPage} de {totalUserPages}
              </span>
              <button
                onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                disabled={userPage === totalUserPages}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
          {/* Columna derecha: Presupuestos */}
          <section className="flex-1 min-w-[300px]">
            <h3 className="font-semibold mb-2 text-center md:text-left">Últimos presupuestos</h3>
            <div className="flex flex-col gap-4">
              {(Array.isArray(budgets) ? budgets : []).slice(0, 6).map((b) => (
                <div
                  key={b.id}
                  className="bg-gray-800 rounded-lg p-4 flex flex-col shadow-md cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => navigate(`/presupuestos/${b.codigo}`)}
                  title={`Ver presupuesto ${b.codigo}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-400 font-mono">{b.codigo}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        b.status === "VALIDO" ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <span className="text-lg text-gray-300 mb-1">{b.person.nombre}</span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{new Date(b.fechaElaboracion).toLocaleDateString()}</span>
                    <span className="text-sm font-semibold text-green-400">${b.precioLiquido.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {(Array.isArray(budgets) ? budgets : []).length === 0 && (
                <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
                  <p>No hay presupuestos disponibles</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
