"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Layout from "../../components/Layout"
import {
  getProducts,
  getPersonaById,
  createPresupuesto,
  getPresupuestoById,
  updatePresupuesto,
} from "../../services/api"
import type { Product } from "../../types/product"
import type { Persona } from "../../types/persona"

interface PresupuestoItem {
  id: string // Unique identifier for React keys
  productCode: string
  productName: string
  cantidad: number
  price: number
}

export default function CrearPresupuesto() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const clienteId = searchParams.get("cliente")

  const [cliente, setCliente] = useState<Persona | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedItems, setSelectedItems] = useState<PresupuestoItem[]>([])
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const [isEditing, setIsEditing] = useState(false)
  const [presupuestoId, setPresupuestoId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const editId = window.location.pathname.includes("/editar/")
      ? window.location.pathname.split("/editar/")[1].split("?")[0]
      : null

    if (editId) {
      setIsEditing(true)
      setPresupuestoId(editId)
    }

    if (!clienteId) {
      navigate("/dashboard")
      return
    }

    // Load client and products
    const loadData = async () => {
      try {
        const [clienteData, productsData] = await Promise.all([getPersonaById(clienteId), getProducts()])

        setCliente(clienteData)
        setProducts(Array.isArray(productsData) ? productsData : [])

        // If editing, load presupuesto data
        if (editId) {
          try {
            const presupuestoData = await getPresupuestoById(editId)
            setDescripcion(presupuestoData.descripcion || "")

            // Convert presupuesto items to selected items format
            const items = presupuestoData.items.map((item: any, index: number) => {
              // Try to find the product in the products list first
              const foundProduct = productsData.find((p: any) => 
                item.descripcion.includes(p.productCode) || 
                item.descripcion.includes(p.productName)
              )
              
              if (foundProduct) {
                return {
                  id: `${foundProduct.productCode}_${index}`,
                  productCode: foundProduct.productCode,
                  productName: foundProduct.productName,
                  cantidad: item.cantidad,
                  price: foundProduct.price,
                }
              } else {
                // Fallback: extract from description
                const parts = item.descripcion.split(" ")
                const productCode = parts[0] || `ITEM_${index}`
                return {
                  id: `${productCode}_${index}`,
                  productCode,
                  productName: item.descripcion.substring(productCode.length + 1) || item.descripcion,
                  cantidad: item.cantidad,
                  price: item.precioUnitario || 0,
                }
              }
            })
            setSelectedItems(items)
          } catch (presupuestoError: any) {
            const errorMessage = presupuestoError?.response?.data?.message || presupuestoError?.message || "Error desconocido"
            setError(`Error al cargar el presupuesto: ${errorMessage}`)
          }
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Error desconocido"
        setError(`Error al cargar los datos: ${errorMessage}`)
      }
    }

    loadData()
  }, [clienteId, navigate])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products.filter(
        (p) =>
          p.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.productName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm, products])

  const handleAddProduct = (product: Product) => {
    const existingItem = selectedItems.find((item) => item.productCode === product.productCode)

    if (existingItem) {
      setSelectedItems((items) =>
        items.map((item) =>
          item.productCode === product.productCode ? { ...item, cantidad: item.cantidad + cantidad } : item,
        ),
      )
    } else {
      const newItem: PresupuestoItem = {
        id: `${product.productCode}_${Date.now()}`,
        productCode: product.productCode,
        productName: product.productName,
        cantidad: cantidad,
        price: product.price,
      }
      setSelectedItems((items) => [...items, newItem])
    }

    setSearchTerm("")
    setCantidad(1)
    setShowSuggestions(false)
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((items) => items.filter((item) => item.id !== itemId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedItems.length === 0) {
      setError("Debe agregar al menos un producto")
      return
    }

    setLoading(true)
    setError("")

    try {
      const presupuestoData = {
        personId: Number(clienteId),
        items: selectedItems.map((item) => ({
          productCode: item.productCode,
          cantidad: item.cantidad,
        })),
      }

      if (isEditing && presupuestoId) {
        await updatePresupuesto(presupuestoId, presupuestoData)
      } else {
        await createPresupuesto(presupuestoData)
      }

      navigate(`/clientes/${clienteId}`)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Error desconocido"
      setError(isEditing ? `Error al actualizar el presupuesto: ${errorMessage}` : `Error al crear el presupuesto: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.cantidad, 0)
  const iva = total * 0.19
  const totalConIva = total + iva

  if (!cliente) {
    return (
      <Layout>
        <div className="text-white p-8">Cargando...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">{isEditing ? "Editar Presupuesto" : "Crear Presupuesto"}</h1>
            <div className="mb-4">
              <p className="text-lg">
                Cliente: <span className="font-semibold">{cliente.nombre}</span>
              </p>
              <p className="text-sm text-gray-400">
                RUT: {cliente.rut} | Ciudad: {cliente.ciudad}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Productos</h2>

            {error && <div className="bg-red-600 text-white p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Descripción del presupuesto</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción opcional del presupuesto"
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Buscar producto por código</label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar producto por código o nombre"
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />

                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg">
                        {suggestions.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0"
                            onClick={() => handleAddProduct(product)}
                          >
                            <div className="font-medium text-blue-400">{product.productCode}</div>
                            <div className="text-sm text-gray-300">{product.productName}</div>
                            <div className="text-sm text-green-400">${product.price.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    placeholder="Cantidad"
                    className="w-24 p-3 rounded bg-gray-700 text-white border border-gray-600"
                  />
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Productos seleccionados</h3>
                  <div className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full">
                        <thead className="bg-gray-600">
                          <tr>
                            <th className="p-3 text-left">Código de producto</th>
                            <th className="p-3 text-left">Producto</th>
                            <th className="p-3 text-left">Cantidad</th>
                            <th className="p-3 text-left">Precio Unit.</th>
                            <th className="p-3 text-left">Total</th>
                            <th className="p-3 text-left">Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-600">
                              <td className="p-3 text-blue-400">{item.productCode}</td>
                              <td className="p-3">{item.productName}</td>
                              <td className="p-3">{item.cantidad}</td>
                              <td className="p-3">${item.price.toLocaleString()}</td>
                              <td className="p-3">${(item.price * item.cantidad).toLocaleString()}</td>
                              <td className="p-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-700 p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span>Base Imponible:</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>IVA (19%):</span>
                      <span>${iva.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg border-t border-gray-600 pt-2">
                      <span>Total:</span>
                      <span>${totalConIva.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || selectedItems.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded transition-colors"
              >
                {loading
                  ? isEditing
                    ? "Actualizando presupuesto..."
                    : "Creando presupuesto..."
                  : isEditing
                    ? "Actualizar presupuesto"
                    : "Crear presupuesto"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
