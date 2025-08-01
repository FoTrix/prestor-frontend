"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { getPresupuestoByCodigo, deletePresupuesto } from "../../services/api"
import { generatePresupuestoPDF } from "../../utils/pdfGenerator"

interface PresupuestoItem {
  descripcion: string
  cantidad: number
  precioUnitario: number
  precioTotal: number
}

interface PresupuestoData {
  id: number
  codigo: string
  descripcion: string
  person: {
    id: number
    nombre: string
    direccion: string
    ciudad: string
    pais: string
    rut: string
  }
  items: PresupuestoItem[]
  baseImponible: number
  iva: number
  precioLiquido: number
  status: string
  fechaElaboracion: string
  fechaVencimiento: string
}

export default function Presupuesto() {
  const { codigo } = useParams<{ codigo: string }>()
  const navigate = useNavigate()
  const [presupuesto, setPresupuesto] = useState<PresupuestoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    if (!codigo) {
      navigate("/dashboard")
      return
    }

    setLoading(true)
    getPresupuestoByCodigo(codigo)
      .then((data) => {
        setPresupuesto(data)
      })
      .catch(() => {
        setError("Error al cargar el presupuesto")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [codigo, navigate])

  const handleDelete = async () => {
    if (!presupuesto) return

    if (window.confirm("¿Estás seguro de que deseas eliminar este presupuesto?")) {
      try {
        await deletePresupuesto(presupuesto.id.toString())
        navigate(`/clientes/${presupuesto.person.id}`)
      } catch (err) {
        setError("Error al eliminar el presupuesto")
      }
    }
  }

  const handleEdit = () => {
    if (!presupuesto) return
    navigate(`/presupuestos/editar/${presupuesto.id}?cliente=${presupuesto.person.id}`)
  }

  const handleDownloadPDF = async () => {
    if (!presupuesto) return

    setGeneratingPDF(true)
    try {
      await generatePresupuestoPDF(presupuesto)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setError("Error al generar el PDF")
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-white p-8">Cargando...</div>
      </Layout>
    )
  }

  if (error || !presupuesto) {
    return (
      <Layout>
        <div className="text-white p-8">
          <div className="bg-red-600 text-white p-4 rounded mb-4">{error || "Presupuesto no encontrado"}</div>
          <button onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Volver al Dashboard
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Presupuesto {presupuesto.codigo}</h1>
                <p className="text-gray-400 mb-4">{presupuesto.descripcion}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Estado</p>
                    <p
                      className={`font-semibold ${presupuesto.status === "VALIDO" ? "text-green-400" : "text-red-400"}`}
                    >
                      {presupuesto.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Fecha de Elaboración</p>
                    <p>{new Date(presupuesto.fechaElaboracion).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Fecha de Vencimiento</p>
                    <p>{new Date(presupuesto.fechaVencimiento).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                >
                  {generatingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Descargar PDF
                    </>
                  )}
                </button>
                <button
                  onClick={handleEdit}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Información del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Nombre</p>
                <p className="font-semibold">{presupuesto.person.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">RUT</p>
                <p>{presupuesto.person.rut}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Dirección</p>
                <p>{presupuesto.person.direccion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Ciudad, País</p>
                <p>
                  {presupuesto.person.ciudad}, {presupuesto.person.pais}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-left">Descripción</th>
                    <th className="p-3 text-left">Cantidad</th>
                    <th className="p-3 text-left">Precio Unitario</th>
                    <th className="p-3 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {presupuesto.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-3">{item.descripcion}</td>
                      <td className="p-3">{item.cantidad}</td>
                      <td className="p-3">${item.precioUnitario.toLocaleString()}</td>
                      <td className="p-3">${item.precioTotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Resumen</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Base Imponible:</span>
                <span className="text-lg">${presupuesto.baseImponible.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">IVA (19%):</span>
                <span className="text-lg">${presupuesto.iva.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-green-400">
                    ${presupuesto.precioLiquido.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(`/clientes/${presupuesto.person.id}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
            >
              Volver al Cliente
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
