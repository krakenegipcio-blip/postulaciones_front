import { useState, useEffect } from 'react';

export type PostulacionFilters = {
  search: string;
  id_empresa: number | null;
  id_estado: number | null;
  id_modalidad: number | null;
  id_cargo: number | null;
  tecnologias: number[];
  sueldo_min: number | null;
  sueldo_max: number | null;
  page: number;
  per_page: number;
  sort_col: string;
  sort_dir: 'asc' | 'desc';
};

const STORAGE_KEY = 'postulacion_filters';

const defaultFilters: PostulacionFilters = {
  search: '',
  id_empresa: null,
  id_estado: null,
  id_modalidad: null,
  id_cargo: null,
  tecnologias: [],
  sueldo_min: null,
  sueldo_max: null,
  page: 1,
  per_page: 15,
  sort_col: 'id',
  sort_dir: 'asc',
};

function loadFilters(): PostulacionFilters {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultFilters, ...JSON.parse(raw) };
  } catch (_) { /* ignore */ }
  return { ...defaultFilters };
}

export function useFilterStore() {
  const [filters, setFiltersState] = useState<PostulacionFilters>(loadFilters);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const setFilters = (patch: Partial<PostulacionFilters>) => {
    setFiltersState(prev => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  };

  const resetFilters = () => setFiltersState({ ...defaultFilters });

  return { filters, setFilters, resetFilters };
}
