import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ordonnancesApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useAuth } from '../../context/AuthContext.jsx';

const OrdonnancesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['ordonnances', page, rowsPerPage, debouncedSearch],
    queryFn: () => ordonnancesApi.getAll({ page: page + 1, limit: rowsPerPage, search: debouncedSearch }),
  });

  const deleteMutation = useMutation({
    mutationFn: ordonnancesApi.remove,
    onSuccess: () => {
      toast.success(t('ordonnances.deleted'));
      queryClient.invalidateQueries({ queryKey: ['ordonnances'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const items = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;

  const columns = [
    { key: 'date_ordonnance', label: t('ordonnances.date') },
    { key: 'patient', label: t('ordonnances.patient'), render: (o) => (o.patient ? `${o.patient.prenom} ${o.patient.nom}` : '—') },
    { key: 'medecin', label: t('ordonnances.medecin') },
    { key: 'od_sphere', label: `${t('ordonnances.od')} ${t('ordonnances.sphere')}`, render: (o) => o.od_sphere ?? '—' },
    { key: 'og_sphere', label: `${t('ordonnances.og')} ${t('ordonnances.sphere')}`, render: (o) => o.og_sphere ?? '—' },
  ];

  return (
    <Box>
      <PageHeader
        title={t('ordonnances.title')}
        subtitle={t('ordonnances.subtitle')}
        action={hasRole('ADMIN', 'OPTICIEN') && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/ordonnances/new')}>
            {t('ordonnances.new')}
          </Button>
        )}
      />
      <Box mb={2}><SearchBar value={search} onChange={setSearch} placeholder={t('common.search')} /></Box>

      <DataTable
        columns={columns}
        rows={items}
        rowKey="idordonnance"
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        isLoading={isLoading}
        renderActions={(o) => hasRole('ADMIN', 'OPTICIEN') && (
          <>
            <IconButton size="small" onClick={() => navigate(`/ordonnances/${o.idordonnance}/edit`)}><EditIcon /></IconButton>
            <IconButton size="small" color="error" onClick={() => setDeleteId(o.idordonnance)}><DeleteIcon /></IconButton>
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteId} title={t('ordonnances.edit')}
        message={t('common.confirmDelete')}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)} loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default OrdonnancesPage;
