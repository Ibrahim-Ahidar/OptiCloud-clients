import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { rendezVousApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDateTime } from '../../utils/format.js';

const AppointmentsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['rendez-vous', date, page, rowsPerPage],
    queryFn: () => rendezVousApi.getAll({ date, page: page + 1, limit: rowsPerPage }),
  });

  const deleteMutation = useMutation({
    mutationFn: rendezVousApi.remove,
    onSuccess: () => {
      toast.success(t('appointments.deleted'));
      queryClient.invalidateQueries({ queryKey: ['rendez-vous'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const items = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;

  const columns = useMemo(() => [
    { key: 'date_rdv', label: t('appointments.date'), render: (a) => formatDateTime(a.date_rdv, i18n.language) },
    { key: 'patient', label: t('appointments.patient'), render: (a) => (a.patient ? `${a.patient.prenom} ${a.patient.nom}` : '—') },
    { key: 'motif', label: t('appointments.motif') },
    { key: 'duree_minutes', label: t('appointments.duration') },
    { key: 'statut', label: t('devis.filterStatus'), render: (a) => <StatusChip status={a.statut} /> },
  ], [t, i18n.language]);

  return (
    <Box>
      <PageHeader
        title={t('appointments.title')}
        subtitle={t('appointments.subtitle')}
        action={(
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/appointments/new')}>
            {t('appointments.new')}
          </Button>
        )}
      />

      <Box mb={2}>
        <TextField
          type="date" label={t('appointments.date')} value={date}
          onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Box>

      <DataTable
        columns={columns}
        rows={items}
        rowKey="id"
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        isLoading={isLoading}
        emptyTitle={t('appointments.noAppointments')}
        renderActions={(a) => (
          <>
            {hasRole('ADMIN', 'OPTICIEN') && (
              <IconButton size="small" onClick={() => navigate(`/appointments/${a.id}/edit`)}><EditIcon /></IconButton>
            )}
            {hasRole('ADMIN') && (
              <IconButton size="small" color="error" onClick={() => setDeleteId(a.id)}><DeleteIcon /></IconButton>
            )}
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteId} title={t('appointments.deleteTitle')}
        message={t('common.confirmDelete')}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)} loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default AppointmentsPage;
