import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBudgets, getClientById } from '../services/api';
import type { User, Budget } from '../types/dashboard';

const PAGE_SIZE = 5;

export const useClient = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<User | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    Promise.all([
      getClientById(Number(clientId)),
      getBudgets()
    ])
      .then(([clientData, allBudgets]) => {
          setClient(clientData);
          const safeBudgets = Array.isArray(allBudgets) ? allBudgets : [];
          setBudgets(safeBudgets.filter((b: Budget) => b.person.id === Number(clientId)));
        })
      .catch(() => {
        setBudgets([]);
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  const safeBudgets = Array.isArray(budgets) ? budgets : [];
  const paginatedBudgets = safeBudgets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(safeBudgets.length / PAGE_SIZE);

  return {
    client,
    budgets: paginatedBudgets,
    page,
    totalPages,
    loading,
    setPage,
    clientId
  };
};