import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import type { PostulacionFilters } from '../store/filterStore';
import type { PostulacionRow } from '../lib/api';

export function usePostulaciones(filters: PostulacionFilters) {
  const [rows, setRows] = useState<PostulacionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(filters.page));
      params.set('per_page', String(filters.per_page));
      params.set('sort_col', filters.sort_col);
      params.set('sort_dir', filters.sort_dir);
      if (filters.search) params.set('search', filters.search);
      if (filters.id_empresa) params.set('id_empresa', String(filters.id_empresa));
      if (filters.id_estado) params.set('id_estado', String(filters.id_estado));
      if (filters.id_modalidad) params.set('id_modalidad', String(filters.id_modalidad));
      if (filters.id_cargo) params.set('id_cargo', String(filters.id_cargo));
      if (filters.sueldo_min) params.set('sueldo_min', String(filters.sueldo_min));
      if (filters.sueldo_max) params.set('sueldo_max', String(filters.sueldo_max));
      if (filters.tecnologias.length > 0) params.set('tecnologias', filters.tecnologias.join(','));

      const data = await apiFetch(`/postulaciones?${params.toString()}`);
      setRows(data.rows as PostulacionRow[]);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  return { rows, total, loading, reload: load };
}
