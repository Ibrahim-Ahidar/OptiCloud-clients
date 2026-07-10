import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import { patientsApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatCurrency } from '../../utils/format.js';

const InfoItem = ({ label, value }) => (
  <Box mb={1.5}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography>{value || '—'}</Typography>
  </Box>
);

const PatientDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsApi.getById(id),
  });

  const patient = data?.data;

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader
        title={`${patient?.prenom} ${patient?.nom}`}
        breadcrumbs={[{ label: t('patients.title'), to: '/patients' }, { label: t('patients.detail') }]}
        backTo="/patients"
        action={<Button startIcon={<EditIcon />} variant="outlined" onClick={() => navigate(`/patients/${id}/edit`)}>{t('common.edit')}</Button>}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('patients.detail')}</Typography>
              <InfoItem label={t('ordonnances.date')} value={patient?.date_naissance} />
              <InfoItem label={t('patients.sexe')} value={patient?.sexe} />
              <InfoItem label={t('patients.telephone')} value={patient?.telephone} />
              <InfoItem label={t('settings.email')} value={patient?.email} />
              <InfoItem label={t('patients.ville')} value={patient?.ville} />
              <InfoItem label={t('patients.mutuelle')} value={patient?.nom_mutuelle} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('patients.ordonnancesHistory')} ({patient?.ordonnances?.length || 0})</Typography>
              <Divider sx={{ mb: 2 }} />
              {patient?.ordonnances?.length ? patient.ordonnances.map((o) => (
                <Box key={o.idordonnance} mb={1} display="flex" justifyContent="space-between">
                  <Typography variant="body2">{o.date_ordonnance} — Dr. {o.medecin}</Typography>
                  <Typography variant="caption">OD: {o.od_sphere ?? '—'}</Typography>
                </Box>
              )) : <Typography color="text.secondary">{t('common.noData')}</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('patients.devisHistory')}</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('devis.numero')}</TableCell>
                    <TableCell>{t('devis.dateDevis')}</TableCell>
                    <TableCell>{t('devis.montantTotal')}</TableCell>
                    <TableCell>{t('devis.filterStatus')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patient?.devis?.map((d) => (
                    <TableRow key={d.iddevis} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/devis/${d.iddevis}`)}>
                      <TableCell>{d.numero_devis}</TableCell>
                      <TableCell>{d.date_devis}</TableCell>
                      <TableCell>{formatCurrency(d.montant_total, i18n.language)}</TableCell>
                      <TableCell><StatusChip status={d.statut} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDetailPage;
