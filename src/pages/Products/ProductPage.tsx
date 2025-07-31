
import { useEffect, useState } from "react";
import { getProducts, getProductByCode } from "../../services/api";

import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useProducts } from "../../hooks/useProducts";

const PAGE_SIZE = 6;

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();
  const { products, loading, setProducts, setLoading } = useProducts();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    if (search.length > 0) {
      const filtered = safeProducts
        .map(p => p.productCode)
        .filter(code => code.toLowerCase().includes(search.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, products]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setShowSuggestions(false);
    if (!search.trim()) {
      setLoading(true);
      getProducts()
        .then(data => setProducts(Array.isArray(data) ? data : []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
      return;
    }
    setLoading(true);
    try {
      const prod = await getProductByCode(search.trim());
      setProducts(prod ? [prod] : []);
      if (!prod) setSearchError("No se encontró el producto");
    } catch {
      setProducts([]);
      setSearchError("No se encontró el producto");
    } finally {
      setLoading(false);
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const paginatedProducts = safeProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(safeProducts.length / PAGE_SIZE) || 1;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-8">
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar por código de producto"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 w-full"
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg">
                    {suggestions.slice(0, 5).map((suggestion, i) => (
                      <li 
                        key={i}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setSearch(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Buscar</button>
            </form>
            <button
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              onClick={() => navigate("/productos/crear")}
            >
              Insertar producto
            </button>
          </div>
          {searchError && <div className="text-red-400 text-sm mb-2">{searchError}</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2">Código de producto</th>
                  <th className="p-2">Nombre del producto</th>
                                    <th className="p-2">Precio unitario</th>
                  <th className="p-2">Editar</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                                    <tr><td colSpan={4} className="text-center p-4 text-gray-400">Cargando...</td></tr>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-700">
                      <td className="p-2">{p.productCode}</td>
                      <td className="p-2">{p.productName}</td>
                                            <td className="p-2">{typeof p.price === "number" ? `$${p.price.toLocaleString()}` : "Sin precio"}</td>
                      <td className="p-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                          onClick={() => navigate(`/productos/editar/${p.id}`)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                                    <tr><td colSpan={4} className="text-center p-4 text-gray-400">Sin productos</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex gap-2 mt-4 justify-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Prev</button>
            <span>Página {page} de {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}