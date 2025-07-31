import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, deleteProduct } from '../services/api';
import type { Product } from '../types/product';

export const useProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Partial<Product>>({
    productCode: '',
    productName: '',
    description: '',
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      getProductById(id)
        .then((data: Product) => setProduct(data))
        .catch(() => setError('No se pudo cargar el producto'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const formatProductCode = (code: string) => {
    const cleanCode = code.replace(/[^a-zA-Z0-9-]/g, '');
    if (cleanCode.length > 9) {
      const prefix = cleanCode.substring(0, 9).replace(/\D/g, '');
      const suffix = cleanCode.substring(9).replace(/[^a-zA-Z]/g, '');
      return `${prefix}-${suffix.charAt(0).toUpperCase()}`;
    }
    return cleanCode.replace(/\D/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'productCode') {
      const formattedValue = formatProductCode(value);
      setProduct(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const productData = {
        productCode: product.productCode,
        productName: product.productName,
        description: product.description,
        price: Number(product.price),
      } as Product;

      if (isEditing && id) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      navigate('/productos');
    } catch (err) {
      setError(isEditing ? 'Error al actualizar el producto' : 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id!);
        navigate('/productos');
      } catch (err) {
        setError('Error al eliminar el producto');
      }
    }
  };

  return {
    id,
    product,
    loading,
    error,
    isEditing,
    handleChange,
    handleSubmit,
    handleDelete,
  };
};