import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <nav className="w-full  bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md fixed top-0 left-0 z-10">
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="font-bold text-lg transition-colors duration-200 hover:text-blue-400 text-white">Inicio</a>
          <a href="/productos" className="transition-colors duration-200 hover:text-blue-400 text-white">Productos</a>
          <a href="/personas" className="transition-colors duration-200 hover:text-blue-400 text-white">Personas</a>
        </div>
        <button 
          onClick={() => { 
            localStorage.removeItem('token'); 
            navigate('/login'); 
          }} 
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 text-white cursor-pointer"
        >
          Logout
        </button>
      </nav>
      {/* Espaciado para navbar fijo */}
      <div className="h-16" />
      {children}
    </>
  );
}