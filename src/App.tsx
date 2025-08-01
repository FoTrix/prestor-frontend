import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Dashboard from "./pages/dashboard/Dashboard";
import ClientPage from "./pages/presupuestos/ClientPage";
import ProductPage from "./pages/Products/ProductPage";
import ProductFormPage from "./pages/Products/ProductFormPage";
import PersonasPage from './pages/Personas/PersonasPage';
import PersonaFormPage from './pages/Personas/PersonaFormPage';
import CrearPresupuesto from './pages/presupuestos/FormPresupuesto';
import Presupuesto from './pages/presupuestos/Presupuesto';

export default function App() {
  return (
    <div className="bg-gray-800 min-h-screen">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <LoginPage />
        } />
        <Route path="/register" element={
          localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <RegisterPage />
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes/:clientId" element={<ClientPage />} />
        <Route path="/productos" element={<ProductPage />} />
        <Route path="/productos/crear" element={<ProductFormPage />} />
        <Route path="/productos/editar/:id" element={<ProductFormPage />} />
        <Route path="/personas" element={<PersonasPage />} />
            <Route path="/personas/crear" element={<PersonaFormPage />} />
            <Route path="/personas/editar/:id" element={<PersonaFormPage />} />
            <Route path="/presupuestos/crear" element={<CrearPresupuesto />} />
            <Route path="/presupuestos/:codigo" element={<Presupuesto />} />
            <Route path="/presupuestos/editar/:id" element={<CrearPresupuesto />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}