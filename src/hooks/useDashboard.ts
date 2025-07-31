import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getClients, getBudgets, logout } from '../services/api';
import type { Budget } from '../types/dashboard';
import type { Persona } from '../types/persona';

const PAGE_SIZE = 5;

export const useDashboard = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [clients, setClients] = useState<Persona[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    Promise.all([
      getProfile(),
      getClients(),
      getBudgets(),
    ])
      .then(([profileRes, clientsRes, budgetsRes]) => {
        setProfile(profileRes.user);
        setClients(Array.isArray(clientsRes) ? clientsRes : []);
        const sortedBudgets = Array.isArray(budgetsRes)
          ? budgetsRes.sort((a, b) => new Date(b.fechaElaboracion).getTime() - new Date(a.fechaElaboracion).getTime())
          : [];
        setBudgets(sortedBudgets);
      })
      .catch(() => {
        setClients([]);
        setBudgets([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    localStorage.removeItem('token');
    navigate('/login');
  };

  const safeClients = Array.isArray(clients) ? clients : [];
  const paginatedClients = safeClients.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE);
  const totalUserPages = Math.ceil(safeClients.length / PAGE_SIZE);

  return {
    profile,
    clients: paginatedClients,
    budgets,
    userPage,
    totalUserPages,
    loading,
    setUserPage,
    handleLogout,
    navigate
  };
};