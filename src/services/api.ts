import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProfile = async () => {
  const res = await apiClient.get('/user/profile');
  return res.data;
};

export const getUsers = async () => {
  const res = await apiClient.get('/user/list');
  return res.data;
};

export const getBudgets = async () => {
  const res = await apiClient.get('/presupuestos');
  return res.data;
};

export const getClients = async () => {
  const res = await apiClient.get('/presupuestos/personas');
  return res.data;
};

export const getClientById = async (id: number) => {
  const res = await apiClient.get(`/presupuestos/personas/${id}`);
  return res.data;
};

export const updateClientById = async (id: number, data: any) => {
  const res = await apiClient.put(`/presupuestos/personas/${id}`, data);
  return res.data;
};

export const getProducts = async () => {
  const res = await apiClient.get('/products');
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (product: any) => {
  const res = await apiClient.post('/products', product);
  return res.data;
};

export const updateProduct = async (id: string, product: any) => {
  const res = await apiClient.put(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await apiClient.delete(`/products/${id}`);
  return res.data;
};

export const getProductByCode = async (codigo: string) => {
  const res = await apiClient.get(`/products/codigo/${codigo}`);
  return res.data;
};

// Personas
export const getPersonas = async () => {
  const res = await apiClient.get('/presupuestos/personas');
  return res.data;
};

export const getPersonaById = async (id: string) => {
  const res = await apiClient.get(`/presupuestos/personas/${id}`);
  return res.data;
};

export const createPersona = async (personaData: any) => {
  const res = await apiClient.post('/presupuestos/personas', personaData);
  return res.data;
};

export const updatePersona = async (id: string, personaData: any) => {
  const res = await apiClient.put(`/presupuestos/personas/${id}`, personaData);
  return res.data;
};

export const deletePersona = async (id: string) => {
  const res = await apiClient.delete(`/presupuestos/personas/${id}`);
  return res.data;
};

export const searchPersonas = async (nombre: string) => {
  const res = await apiClient.get(`/presupuestos/personas/buscar?nombre=${nombre}`);
  return res.data;
};

// ---

export const logout = async () => {
  const res = await apiClient.post('/auth/logout', {});
  return res.data;
};
