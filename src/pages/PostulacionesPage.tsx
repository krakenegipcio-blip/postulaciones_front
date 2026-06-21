import { useState } from 'react';
import { Plus, SlidersHorizontal, ArrowUp, ArrowDown, ArrowUpDown, Pencil, Trash2, Eye } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { PostulacionRow } from '../lib/api';
import { useFilterStore } from '../store/filterStore';
import { usePostulaciones } from '../hooks/usePostulaciones';
import { useEmpresas, useCargos, useEstados, usePlataformas, useModalidades, useUbicaciones, useTecnologias, useMetodos, useNiveles, useFasesSeguimiento } from '../hooks/useData';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLongPress } from '../hooks/useLongPress';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import FilterPanel from '../components/postulaciones/FilterPanel';
import PostulacionForm from '../components/postulaciones/PostulacionForm';

interface Props { onMenuOpen: () => void; }

type SortDir = 'asc' | 'desc';

function SortIcon({ col, current, dir }: { col: string; current: string; dir: SortDir }) {
  if (col !== current) return <ArrowUpDown size={12} className="text-slate-600" />;
  return dir === 'asc' ? <ArrowUp size={12} className="text-blue-400" /> : <ArrowDown size={12} className="text-blue-400" />;
}

/* ─── Mobile Card ─── */
function MobileCard({ row, onTap, onLongPress, index }: {
  row: PostulacionRow;
  onTap: () => void;
  onLongPress: () => void;
  index: number;
}) {
  const lp = useLongPress(onLongPress, onTap);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  return (
    <div
      {...lp}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 active:bg-slate-700/60 transition-colors select-none cursor-pointer"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 font-semibold text-base truncate">
            {row.empresa?.nombre ?? '-'}
          </p>
          <p className="text-slate-400 text-sm truncate mt-0.5">
            {row.cargo?.nombre ?? '-'}
          </p>
        </div>
        <div className="flex-shrink-0">
          {row.estado ? (
            <Badge label={row.estado.nombre} color={row.estado.color_hex} />
          ) : (
            <span className="text-slate-500 text-xs">-</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        <span>{formatDate(row.fecha_postulacion)}</span>
        {row.modalidad && (
          <>
            <span className="text-slate-700">•</span>
            <span>{row.modalidad.nombre}</span>
          </>
        )}
        {row.sueldo_ofrecido && (
          <>
            <span className="text-slate-700">•</span>
            <span className="text-blue-400 font-medium">${row.sueldo_ofrecido.toLocaleString('es-CL')}</span>
          </>
        )}
      </div>

      {(row.tecnologias ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {(row.tecnologias ?? []).slice(0, 3).map(t => (
            <span key={t.id} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: t.color_hex + '33', color: t.color_hex }}>
              {t.nombre}
            </span>
          ))}
          {(row.tecnologias?.length ?? 0) > 3 && (
            <span className="text-[10px] text-slate-500 px-1">+{(row.tecnologias?.length ?? 0) - 3}</span>
          )}
        </div>
      )}

      <p className="text-[10px] text-slate-600 mt-2 italic">
        Toca para editar · Mantén presionado para eliminar
      </p>
    </div>
  );
}

export default function PostulacionesPage({ onMenuOpen }: Props) {
  const { filters, setFilters, resetFilters } = useFilterStore();
  const { rows, total, loading, reload } = usePostulaciones(filters);
  const { data: empresas, reload: reloadEmpresas } = useEmpresas();
  const { data: cargos, reload: reloadCargos } = useCargos();
  const { data: estados } = useEstados();
  const { data: plataformas } = usePlataformas();
  const { data: modalidades } = useModalidades();
  const { data: ubicaciones } = useUbicaciones();
  const { data: tecnologias, reload: reloadTecnologias } = useTecnologias();
  const { data: metodos } = useMetodos();
  const { data: niveles } = useNiveles();
  const { data: fasesSeguimiento } = useFasesSeguimiento();

  const isMobile = useIsMobile();

  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formReadOnly, setFormReadOnly] = useState(false);
  const [editing, setEditing] = useState<PostulacionRow | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openNew = () => { setFormReadOnly(false); setEditing(null); setFormOpen(true); };
  const openEdit = (row: PostulacionRow, readOnly: boolean) => { setFormReadOnly(readOnly); setEditing(row); setFormOpen(true); };

  const handleDelete = async () => {
    if (!deleteId) return;
    await apiFetch(`/postulaciones/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    reload();
  };

  const handleSort = (col: string) => {
    if (filters.sort_col === col) {
      setFilters({ sort_dir: filters.sort_dir === 'asc' ? 'desc' : 'asc', page: filters.page });
    } else {
      setFilters({ sort_col: col, sort_dir: 'asc', page: filters.page });
    }
  };

  const cols = [
    { key: 'id', label: 'id' },
    { key: 'id_empresa', label: 'Empresa' },
    { key: 'id_cargo', label: 'Cargo' },
    { key: 'id_estado', label: 'Estado' },
    { key: 'id_modalidad', label: 'Modalidad' },
    { key: 'sueldo', label: 'Sueldo' },
    { key: 'fecha_postulacion', label: 'Fecha Post.' },
  ];

  const formatSueldo = (v: number | null) => v ? `$${v.toLocaleString('es-CL')}` : '-';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const datePart = dateStr.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const getModalidadLabel = (row: PostulacionRow) => {
    if (!row.modalidad) return '-';
    if (row.modalidad.nombre === 'Híbrido' && row.dias_presenciales) {
      return `Híbrido (${row.dias_presenciales} ${row.dias_presenciales === 1 ? 'día' : 'días'})`;
    }
    return row.modalidad.nombre;
  };

  const hasActiveFilters = !!(filters.id_empresa || filters.id_estado || filters.id_modalidad || filters.id_cargo || filters.tecnologias.length > 0);

  return (
    <div className="flex flex-col h-full">
      <Header
        onMenuOpen={onMenuOpen}
        search={filters.search}
        onSearch={v => setFilters({ search: v, page: 1 })}
      />

      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={openNew}
            title="Agregar Postulación"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            title="Filtros"
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              hasActiveFilters
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isMobile ? (
            <span className="text-xs text-slate-500 flex flex-col items-center leading-tight">
              <span>Vista</span>
              <span className="text-slate-300 font-medium">Completo</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Vista: <span className="text-slate-300 font-medium">Completo</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-400">Cargando...</div>
        ) : isMobile ? (
          /* ─── Mobile Card View ─── */
          <div className="p-3 space-y-3">
            {rows.length === 0 && (
              <div className="text-center py-12 text-slate-500">No hay postulaciones que coincidan</div>
            )}
            {rows.map((row, i) => (
              <MobileCard
                key={row.id}
                row={row}
                index={(filters.page - 1) * filters.per_page + i + 1}
                onTap={() => openEdit(row, false)}
                onLongPress={() => setDeleteId(row.id)}
              />
            ))}
          </div>
        ) : (
          /* ─── Desktop Table View ─── */
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 sticky top-0 z-10">
                <th className="w-8 px-3 py-3 text-left text-xs text-slate-500 font-medium">#</th>
                {cols.map(c => (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c.key === 'sueldo' ? 'sueldo_ofrecido' : c.key)}
                    className="px-3 py-3 text-left text-xs text-slate-400 font-medium cursor-pointer hover:text-slate-200 select-none group align-top"
                  >
                    {c.key === 'sueldo' ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span>Sueldo</span>
                          <SortIcon col="sueldo_ofrecido" current={filters.sort_col} dir={filters.sort_dir} />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase mt-1 font-semibold">
                          <span className="text-blue-400/80">Ofrecido</span>
                          <span>|</span>
                          <span className="text-emerald-400/80">Solicitado</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {c.label}
                        <SortIcon col={c.key} current={filters.sort_col} dir={filters.sort_dir} />
                      </div>
                    )}
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-xs text-slate-400 font-medium align-top">Tecnologías</th>
                <th className="px-3 py-3 text-right text-xs text-slate-400 font-medium align-top">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-500">No hay postulaciones que coincidan</td>
                </tr>
              )}
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-800/60 transition-colors group"
                >
                  <td className="px-3 py-2.5 text-slate-500 text-xs">{(filters.page - 1) * filters.per_page + i + 1}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs">{row.id}</td>
                  <td className="px-3 py-2.5 text-slate-200 font-medium max-w-[160px] truncate">{row.empresa?.nombre ?? '-'}</td>
                  <td className="px-3 py-2.5 text-slate-300 max-w-[180px] truncate">{row.cargo?.nombre ?? '-'}</td>
                  <td className="px-3 py-2.5">
                    {row.estado ? (
                      <Badge label={row.estado.nombre} color={row.estado.color_hex} />
                    ) : '-'}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.modalidad ? (
                      <Badge label={getModalidadLabel(row)} color={row.modalidad.color_hex} />
                    ) : '-'}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-medium">{formatSueldo(row.sueldo_ofrecido)}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-emerald-400/80 text-sm">{formatSueldo(row.sueldo_pedido)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs whitespace-nowrap">{formatDate(row.fecha_postulacion)}</td>
                  <td className="px-3 py-2.5 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {(row.tecnologias ?? []).slice(0, 3).map(t => (
                        <span key={t.id} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: t.color_hex + '33', color: t.color_hex }}>
                          {t.nombre}
                        </span>
                      ))}
                      {(row.tecnologias?.length ?? 0) > 3 && (
                        <span className="text-xs text-slate-500 px-1">+{(row.tecnologias?.length ?? 0) - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(row, true)}
                        title="Ver Detalle"
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(row, false)}
                        title="Editar"
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(row.id)}
                        title="Eliminar"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={filters.page}
        perPage={filters.per_page}
        total={total}
        onPage={p => setFilters({ page: p })}
      />

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={f => setFilters({ ...f, page: 1 })}
        resetFilters={resetFilters}
        empresas={empresas}
        estados={estados}
        modalidades={modalidades}
        cargos={cargos}
        tecnologias={tecnologias}
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? (formReadOnly ? 'Detalle de Postulación' : 'Editar Postulación') : 'Nueva Postulación'}
        size={editing ? 'wide' : 'xl'}
      >
        <PostulacionForm
          item={editing}
          empresas={empresas}
          cargos={cargos}
          estados={estados}
          plataformas={plataformas}
          modalidades={modalidades}
          ubicaciones={ubicaciones}
          tecnologias={tecnologias}
          metodos={metodos}
          niveles={niveles}
          fasesSeguimiento={fasesSeguimiento}
          readOnly={formReadOnly}
          onSave={() => { setFormOpen(false); reload(); }}
          onCancel={() => setFormOpen(false)}
          reloadEmpresas={reloadEmpresas}
          reloadCargos={reloadCargos}
          reloadTecnologias={reloadTecnologias}
        />
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Estás seguro que deseas eliminar esta postulación? Esta acción no se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors">
              Eliminar
            </button>
            <button onClick={() => setDeleteId(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
