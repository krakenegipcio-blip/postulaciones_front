import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { PostulacionSeguimiento, SeguimientoPayload } from '../lib/api';

export function useSeguimiento(postulacionId?: number) {
  const [rows, setRows] = useState<PostulacionSeguimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!postulacionId) {
      setRows([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/postulaciones/${postulacionId}/seguimiento`);
      setRows((data ?? []) as PostulacionSeguimiento[]);
    } catch (err: any) {
      setError(err.message || 'Error al cargar seguimiento');
    } finally {
      setLoading(false);
    }
  }, [postulacionId]);

  useEffect(() => { reload(); }, [reload]);

  const createStep = async (payload: SeguimientoPayload) => {
    if (!postulacionId) return;
    await apiFetch(`/postulaciones/${postulacionId}/seguimiento`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await reload();
  };

  const updateStep = async (stepId: number, payload: SeguimientoPayload) => {
    if (!postulacionId) return;
    await apiFetch(`/postulaciones/${postulacionId}/seguimiento/${stepId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await reload();
  };

  const deleteStep = async (stepId: number) => {
    if (!postulacionId) return;
    await apiFetch(`/postulaciones/${postulacionId}/seguimiento/${stepId}`, { method: 'DELETE' });
    await reload();
  };

  return { rows, loading, error, reload, createStep, updateStep, deleteStep };
}
