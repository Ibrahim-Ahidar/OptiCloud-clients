import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { devisApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../utils/format.js';

const Row = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" py={1}>
    <Typography color="text.secondary">{label}</Typography>
    <Typography fontWeight={500}>{value ?? '—'}</Typography>
  </Box>
);

const DevisDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newStatut, setNewStatut] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['devis', id],
    queryFn: () => devisApi.getById(id),
  });

  const devis = data?.data;

  const updateMutation = useMutation({
    mutationFn: (payload) => devisApi.update(id, payload),
    onSuccess: () => {
      toast.success(t('devis.updated'));
      queryClient.invalidateQueries({ queryKey: ['devis', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: () => devisApi.remove(id),
    onSuccess: () => {
      toast.success(t('devis.deleted'));
      navigate('/devis');
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const handlePdf = async (download = false) => {
    try {
      const response = await devisApi.exportPdf(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      if (download) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `devis-${devis.numero_devis}.pdf`;
        a.click();
      } else {
        window.open(url, '_blank');
      }
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t('devis.pdfError'));
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader
        title={`${t('devis.title')} ${devis?.numero_devis}`}
        breadcrumbs={[{ label: t('devis.title'), to: '/devis' }, { label: devis?.numero_devis }]}
        backTo="/devis"
        action={(
          <Box display="flex" gap={1} flexWrap="wrap">
            {hasRole('ADMIN', 'OPTICIEN') && (
              <Button startIcon={<EditIcon />} variant="outlined" onClick={() => navigate(`/devis/${id}/edit`)}>{t('common.edit')}</Button>
            )}
            <Button startIcon={<PrintIcon />} variant="outlined" onClick={() => handlePdf(false)}>{t('common.print')}</Button>
            <Button startIcon={<DownloadIcon />} variant="contained" onClick={() => handlePdf(true)}>{t('devis.exportPdf')}</Button>
            {hasRole('ADMIN') && (
              <Button startIcon={<DeleteIcon />} color="error" variant="outlined" onClick={() => setDeleteOpen(true)}>{t('common.delete')}</Button>
            )}
          </Box>
        )}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
                <Typography variant="h6">{t('devis.detail')}</Typography>
                <StatusChip status={devis?.statut} />
              </Box>
              {hasRole('ADMIN', 'OPTICIEN') && (
                <Box mb={2} display="flex" gap={1} alignItems="center">
                  <TextField
                    select size="small" label={t('devis.changeStatus')} value={newStatut || devis?.statut}
                    onChange={(e) => setNewStatut(e.target.value)} sx={{ minWidth: 160 }}
                  >
                    {['en_attente', 'accepte', 'refuse', 'expire'].map((s) => (
                      <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>
                    ))}
                  </TextField>
                  <Button
                    size="small" variant="contained"
                    disabled={!newStatut || newStatut === devis?.statut || updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ statut: newStatut })}
                  >
                    {t('common.save')}
                  </Button>
                </Box>
              )}
              <Row label={t('devis.patient')} value={devis?.patient ? `${devis.patient.prenom} ${devis.patient.nom}` : '—'} />
              <Row label={t('devis.dateDevis')} value={devis?.date_devis} />
              <Row label={t('devis.dateValidite')} value={devis?.date_validite} />
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>{t('nav.montures')}</Typography>
              {devis?.monture && <Row label={t('nav.montures')} value={`${devis.monture.modele} — ${formatCurrency(devis.prix_monture, i18n.language)}`} />}
              {devis?.verreOd && <Row label={`${t('nav.verres')} OD`} value={devis.verreOd.nom} />}
              {devis?.verreOg && <Row label={`${t('nav.verres')} OG`} value={devis.verreOg.nom} />}
              {devis?.prix_verres && <Row label={t('nav.verres')} value={formatCurrency(devis.prix_verres, i18n.language)} />}
              {devis?.lentille && <Row label={t('nav.lentilles')} value={`${devis.lentille.nom} — ${formatCurrency(devis.prix_lentilles, i18n.language)}`} />}
              {devis?.remarques && <><Divider sx={{ my: 2 }} /><Typography variant="body2" color="text.secondary">{devis.remarques}</Typography></>}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('devis.summary')}</Typography>
              <Row label={t('devis.montantTotal')} value={formatCurrency(devis?.montant_total, i18n.language)} />
              <Row label={t('devis.rembSecu')} value={formatCurrency(devis?.remboursement_secu, i18n.language)} />
              <Row label={t('devis.rembMutuelle')} value={formatCurrency(devis?.remboursement_mutuelle ?? 0, i18n.language)} />
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" py={1}>
                <Typography fontWeight={700}>{t('devis.resteACharge')}</Typography>
                <Typography fontWeight={700} color="primary">{formatCurrency(devis?.reste_a_charge, i18n.language)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteOpen} title={t('devis.deleteTitle')}
        message={t('common.irreversible')}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleteOpen(false)} loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default DevisDetailPage;
