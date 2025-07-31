import axios from "axios";
import { type LoginFormValues, type RegisterFormValues, type AuthResponse } from "../types/auth";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (data: LoginFormValues): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
    username: data.username,
    password: data.password,
  });
  return response.data;
};

export const register = async (data: RegisterFormValues): Promise<void> => {
  await axios.post(`${API_URL}/register`, {
    username: data.username,
    email: data.email,
    nombre: data.nombre,
    pais: data.pais,
    ciudad: data.ciudad,
    direccion: data.direccion,
    rut: data.rut,
    password: data.password,
    acceptedTerms: data.acceptedTerms,
  });
};