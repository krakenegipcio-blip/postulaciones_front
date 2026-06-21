import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import type { Empresa, Cargo, Estado, Plataforma, Modalidad, Ubicacion, Tecnologia, MetodoEvaluacion, NivelExperiencia, FaseSeguimiento } from '../lib/api';

export function useCatalog<T>(table: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await apiFetch(`/${table}`);
      setData((rows ?? []) as T[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load };
}

export function useEmpresas() { return useCatalog<Empresa>('empresa'); }
export function useCargos() { return useCatalog<Cargo>('cargo'); }
export function useEstados() { return useCatalog<Estado>('estado'); }
export function usePlataformas() { return useCatalog<Plataforma>('plataforma'); }
export function useModalidades() { return useCatalog<Modalidad>('modalidad'); }
export function useUbicaciones() { return useCatalog<Ubicacion>('ubicacion'); }
export function useTecnologias() { return useCatalog<Tecnologia>('tecnologia'); }
export function useMetodos() { return useCatalog<MetodoEvaluacion>('metodo_evaluacion'); }
export function useNiveles() { return useCatalog<NivelExperiencia>('nivel_experiencia'); }
export function useFasesSeguimiento() { return useCatalog<FaseSeguimiento>('fase_seguimiento'); }
