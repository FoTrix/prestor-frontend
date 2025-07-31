import { useEffect, useState, useCallback } from 'react';
import { getPersonas, searchPersonas } from '../services/api';
import type { Persona } from '../types/persona';

const PAGE_SIZE = 10;

export const usePersonas = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Persona[]>([]);

  const fetchPersonas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPersonas();
      setPersonas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las personas');
      setPersonas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  useEffect(() => {
    if (searchTerm) {
      const handler = setTimeout(async () => {
        try {
          const data = await searchPersonas(searchTerm);
          setSuggestions(Array.isArray(data) ? data : []);
        } catch (err) {
          setSuggestions([]);
        }
      }, 300);
      return () => clearTimeout(handler);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      fetchPersonas();
    } else {
      const safePersonas = Array.isArray(personas) ? personas : [];
      const filtered = safePersonas.filter(p => p.nombre && p.nombre.toLowerCase().includes(term.toLowerCase()));
      setPersonas(filtered);
    }
  };

  const safePersonas = Array.isArray(personas) ? personas : [];
  const paginatedPersonas = safePersonas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(safePersonas.length / PAGE_SIZE);

  return {
    personas: paginatedPersonas,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    suggestions,
    setPage,
    handleSearch,
    fetchPersonas,
  };
};