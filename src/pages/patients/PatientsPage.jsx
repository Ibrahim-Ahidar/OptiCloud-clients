import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { patientsApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useAuth } from '../../context/AuthContext.jsx';

const PatientsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const [search, setSearch] = useState('');
  const [ville, setVille] = useState('');
  const [sexe, setSexe] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['patients', page, rowsPerPage, debouncedSearch, ville, sexe],
    queryFn: () => patientsApi.getAll({
      page: page + 1,
      limit: rowsPerPage,
      search: debouncedSearch,
      ville: ville || undefined,
      sexe: sexe || undefined,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: patientsApi.remove,
    onSuccess: () => {
      toast.success(t('patients.deleted'));
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const patients = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;

  const columns = [
    { key: 'nom', label: t('patients.nom') },
    { key: 'prenom', label: t('patients.prenom') },
    { key: 'telephone', label: t('patients.telephone') },
    { key: 'ville', label: t('patients.ville') },
    { key: 'nom_mutuelle', label: t('patients.mutuelle') },
  ];

  return (
    <Box>
      <PageHeader
        title={t('patients.title')}
        subtitle={t('patients.subtitle')}
        action={(
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/patients/new')}>
            {t('patients.new')}
          </Button>
        )}
      />

      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <Box flex={1} minWidth={200}><SearchBar value={search} onChange={setSearch} placeholder={t('patients.search')} /></Box>
        <TextField size="small" label={t('patients.filterVille')} value={ville} onChange={(e) => setVille(e.target.value)} sx={{ minWidth: 140 }} />
        <TextField select size="small" label={t('patients.filterSexe')} value={sexe} onChange={(e) => setSexe(e.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="">{t('common.all')}</MenuItem>
          <MenuItem value="M">{t('patients.sexeM')}</MenuItem>
          <MenuItem value="F">{t('patients.sexeF')}</MenuItem>
          <MenuItem value="Autre">{t('patients.sexeAutre')}</MenuItem>
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        rows={patients}
        rowKey="id"
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        isLoading={isLoading}
        emptyTitle={t('common.noData')}
        renderActions={(p) => (
          <>
            <IconButton size="small" onClick={() => navigate(`/patients/${p.id}`)}><VisibilityIcon /></IconButton>
            {hasRole('ADMIN', 'OPTICIEN') && (
              <IconButton size="small" onClick={() => navigate(`/patients/${p.id}/edit`)}><EditIcon /></IconButton>
            )}
            {hasRole('ADMIN') && (
              <IconButton size="small" color="error" onClick={() => setDeleteId(p.id)}><DeleteIcon /></IconButton>
            )}
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteId} title={t('patients.deleteTitle')}
        message={t('common.irreversible')}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)} loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default PatientsPage;
