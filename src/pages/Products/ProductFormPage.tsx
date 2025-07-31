import { useProductForm } from '../../hooks/useProductForm';

export default function ProductFormPage() {
  const {
    product,
    loading,
    error,
    isEditing,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useProductForm();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">{isEditing ? 'Editar' : 'Agregar'} Producto</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="productName"
            placeholder="Nombre del producto"
            value={product.productName}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
            required
          />
          <input
            type="text"
            name="productCode"
            placeholder="Código del producto (xxxxxxxxx-x)"
            value={product.productCode}
            onChange={handleChange}
            maxLength={11}
            pattern="[0-9]{9}-[A-Za-z]"
            title="Formato: 9 dígitos seguidos de un guión y una letra (ej: 123456789-A)"
            className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={product.description}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
            required
          />
          <input
            type="text"
            name="price"
            placeholder="Precio unitario"
            value={product.price}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
            required
          />
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50">
            {loading ? 'Guardando...' : (isEditing ? 'Editar' : 'Agregar') + ' producto'}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {isEditing && (
            <button 
              type="button"
              onClick={handleDelete}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Eliminar producto
            </button>
          )}
        </form>
      </div>
    </div>
  );
}