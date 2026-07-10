import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { devisApi, patientsApi, ordonnancesApi, productsApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatCurrency } from '../../utils/format.js';

const DevisFormPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const schema = z.object({
    idpatient: z.coerce.number().min(1),
    idordonnance: z.coerce.number().optional().or(z.literal('')),
    idmonture: z.coerce.number().optional().or(z.literal('')),
    idverre_od: z.string().optional(),
    idverre_og: z.string().optional(),
    idlentille: z.string().optional(),
    date_devis: z.string().min(1),
    date_validite: z.string().min(1),
    statut: z.enum(['en_attente', 'accepte', 'refuse', 'expire']).optional(),
    remboursement_secu: z.coerce.number().optional(),
    remboursement_mutuelle: z.coerce.number().optional(),
    remarques: z.string().optional(),
  });

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'en_attente', date_devis: new Date().toISOString().split('T')[0] },
  });

  const patientId = watch('idpatient');
  const idmonture = watch('idmonture');
  const idverreOd = watch('idverre_od');
  const idverreOg = watch('idverre_og');
  const idlentille = watch('idlentille');
  const rembSecu = watch('remboursement_secu') || 0;
  const rembMutuelle = watch('remboursement_mutuelle') || 0;

  const { data: existingData, isLoading: loadingExisting } = useQuery({
    queryKey: ['devis', id],
    queryFn: () => devisApi.getById(id),
    enabled: isEdit,
  });

  const { data: patientsData } = useQuery({ queryKey: ['patients-list'], queryFn: () => patientsApi.getAll({ limit: 100 }) });
  const { data: ordData } = useQuery({ queryKey: ['ord-patient', patientId], queryFn: () => ordonnancesApi.getByPatient(patientId), enabled: !!patientId });
  const { data: monturesData } = useQuery({ queryKey: ['montures-list'], queryFn: () => productsApi.montures.getAll({ limit: 100 }) });
  const { data: verresData } = useQuery({ queryKey: ['verres-list'], queryFn: () => productsApi.verres.getAll({ limit: 100 }) });
  const { data: lentillesData } = useQuery({ queryKey: ['lentilles-list'], queryFn: () => productsApi.lentilles.getAll({ limit: 100 }) });

  useEffect(() => {
    if (existingData?.data) {
      const d = existingData.data;
      reset({
        idpatient: d.idpatient,
        idordonnance: d.idordonnance || '',
        idmonture: d.idmonture || '',
        idverre_od: d.idverre_od || '',
        idverre_og: d.idverre_og || '',
        idlentille: d.idlentille || '',
        date_devis: d.date_devis,
        date_validite: d.date_validite,
        statut: d.statut,
        remboursement_secu: d.remboursement_secu,
        remboursement_mutuelle: d.remboursement_mutuelle,
        remarques: d.remarques || '',
      });
    }
  }, [existingData, reset]);

  const montures = monturesData?.data?.items || [];
  const verres = verresData?.data?.items || [];
  const lentilles = lentillesData?.data?.items || [];

  const pricePreview = useMemo(() => {
    const monturePrice = montures.find((m) => m.idmonture === Number(idmonture))?.prix || 0;
    const verreOdPrice = verres.find((v) => v.idverre === idverreOd)?.prix || 0;
    const verreOgPrice = verres.find((v) => v.idverre === idverreOg)?.prix || 0;
    const lentillePrice = lentilles.find((l) => l.idlentille === idlentille)?.prix || 0;
    const total = Number(monturePrice) + Number(verreOdPrice) + Number(verreOgPrice) + Number(lentillePrice);
    const reste = total - Number(rembSecu) - Number(rembMutuelle);
    return { total, reste };
  }, [idmonture, idverreOd, idverreOg, idlentille, rembSecu, rembMutuelle, montures, verres, lentilles]);

  const mutation = useMutation({
    mutationFn: (data) => (isEdit ? devisApi.update(id, data) : devisApi.create(data)),
    onSuccess: (res) => {
      toast.success(isEdit ? t('devis.updated') : t('devis.created'));
      navigate(`/devis/${res.data.iddevis}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  if (isEdit && loadingExisting) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? t('devis.edit') : t('devis.new')}
        breadcrumbs={[{ label: t('devis.title'), to: '/devis' }, { label: isEdit ? t('common.edit') : t('common.new') }]}
        backTo="/devis"
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label={t('devis.patient')} {...register('idpatient')} error={!!errors.idpatient}>
                      {(patientsData?.data?.items || []).map((p) => <MenuItem key={p.id} value={p.id}>{p.prenom} {p.nom}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label={`${t('ordonnances.title')} (${t('common.optional')})`} {...register('idordonnance')}>
                      <MenuItem value="">—</MenuItem>
                      {(ordData?.data || []).map((o) => <MenuItem key={o.idordonnance} value={o.idordonnance}>{o.date_ordonnance} — Dr. {o.medecin}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label={t('devis.dateDevis')} type="date" InputLabelProps={{ shrink: true }} {...register('date_devis')} /></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label={t('devis.dateValidite')} type="date" InputLabelProps={{ shrink: true }} {...register('date_validite')} /></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField fullWidth select label={t('devis.filterStatus')} {...register('statut')}>
                      {['en_attente', 'accepte', 'refuse', 'expire'].map((s) => (
                        <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label={t('nav.montures')} {...register('idmonture')}>
                      <MenuItem value="">—</MenuItem>
                      {montures.map((m) => <MenuItem key={m.idmonture} value={m.idmonture}>{m.reference} — {m.modele} ({m.prix} {t('common.currency')})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label={`${t('nav.verres')} OD`} {...register('idverre_od')}>
                      <MenuItem value="">—</MenuItem>
                      {verres.map((v) => <MenuItem key={v.idverre} value={v.idverre}>{v.nom} ({v.prix} {t('common.currency')})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label={`${t('nav.verres')} OG`} {...register('idverre_og')}>
                      <MenuItem value="">—</MenuItem>
                      {verres.map((v) => <MenuItem key={v.idverre} value={v.idverre}>{v.nom} ({v.prix} {t('common.currency')})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label={t('nav.lentilles')} {...register('idlentille')}>
                      <MenuItem value="">—</MenuItem>
                      {lentilles.map((l) => <MenuItem key={l.idlentille} value={l.idlentille}>{l.nom} ({l.prix} {t('common.currency')})</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={t('devis.rembSecu')} type="number" {...register('remboursement_secu')} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={t('devis.rembMutuelle')} type="number" {...register('remboursement_mutuelle')} /></Grid>
                  <Grid size={12}><TextField fullWidth label={t('appointments.notes')} multiline rows={3} {...register('remarques')} /></Grid>
                </Grid>
                <Box mt={3} display="flex" gap={2}>
                  <Button type="submit" variant="contained" disabled={mutation.isPending}>{t('common.save')}</Button>
                  <Button variant="outlined" onClick={() => navigate('/devis')}>{t('common.cancel')}</Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('devis.pricePreview')}</Typography>
              <Box display="flex" justifyContent="space-between" py={1}>
                <Typography color="text.secondary">{t('devis.montantTotal')}</Typography>
                <Typography fontWeight={600}>{formatCurrency(pricePreview.total, i18n.language)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" py={1}>
                <Typography fontWeight={700}>{t('devis.resteACharge')}</Typography>
                <Typography fontWeight={700} color="primary">{formatCurrency(pricePreview.reste, i18n.language)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DevisFormPage;
