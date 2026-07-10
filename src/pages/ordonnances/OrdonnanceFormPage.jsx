import { useEffect } from 'react';
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
import { ordonnancesApi, patientsApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const OrdonnanceFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const schema = z.object({
    idpatient: z.coerce.number().min(1, t('validation.required')),
    date_ordonnance: z.string().min(1, t('validation.required')),
    medecin: z.string().optional(),
    od_sphere: z.coerce.number().optional().or(z.literal('')),
    od_cylindre: z.coerce.number().optional().or(z.literal('')),
    od_axe: z.coerce.number().optional().or(z.literal('')),
    od_addition: z.coerce.number().optional().or(z.literal('')),
    og_sphere: z.coerce.number().optional().or(z.literal('')),
    og_cylindre: z.coerce.number().optional().or(z.literal('')),
    og_axe: z.coerce.number().optional().or(z.literal('')),
    og_addition: z.coerce.number().optional().or(z.literal('')),
    ecart_pupillaire_vl: z.coerce.number().optional().or(z.literal('')),
    ecart_pupillaire_vp: z.coerce.number().optional().or(z.literal('')),
    remarques: z.string().optional(),
  });

  const { data: ordData, isLoading } = useQuery({
    queryKey: ['ordonnance', id],
    queryFn: () => ordonnancesApi.getById(id),
    enabled: isEdit,
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients-list'],
    queryFn: () => patientsApi.getAll({ limit: 100 }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (ordData?.data) reset(ordData.data);
  }, [ordData, reset]);

  const mutation = useMutation({
    mutationFn: (formData) => (isEdit ? ordonnancesApi.update(id, formData) : ordonnancesApi.create(formData)),
    onSuccess: () => {
      toast.success(isEdit ? t('common.updated') : t('common.created'));
      navigate('/ordonnances');
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const patients = patientsData?.data?.items || [];

  if (isEdit && isLoading) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? t('ordonnances.edit') : t('ordonnances.new')}
        breadcrumbs={[{ label: t('ordonnances.title'), to: '/ordonnances' }, { label: isEdit ? t('common.edit') : t('common.new') }]}
        backTo="/ordonnances"
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth select label={t('ordonnances.patient')} {...register('idpatient')} error={!!errors.idpatient} helperText={errors.idpatient?.message}>
                  {patients.map((p) => <MenuItem key={p.id} value={p.id}>{p.prenom} {p.nom}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth label={t('ordonnances.date')} type="date" InputLabelProps={{ shrink: true }} {...register('date_ordonnance')} error={!!errors.date_ordonnance} /></Grid>
              <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth label={t('ordonnances.medecin')} {...register('medecin')} /></Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>{t('ordonnances.od')}</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.sphere')} type="number" inputProps={{ step: 0.25 }} {...register('od_sphere')} /></Grid>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.cylindre')} type="number" inputProps={{ step: 0.25 }} {...register('od_cylindre')} /></Grid>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.axe')} type="number" {...register('od_axe')} /></Grid>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.addition')} type="number" inputProps={{ step: 0.25 }} {...register('od_addition')} /></Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>{t('ordonnances.og')}</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.sphere')} type="number" inputProps={{ step: 0.25 }} {...register('og_sphere')} /></Grid>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.cylindre')} type="number" inputProps={{ step: 0.25 }} {...register('og_cylindre')} /></Grid>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.axe')} type="number" {...register('og_axe')} /></Grid>
              <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label={t('ordonnances.addition')} type="number" inputProps={{ step: 0.25 }} {...register('og_addition')} /></Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={`${t('ordonnances.pupillaryDistance')} VL`} type="number" inputProps={{ step: 0.5 }} {...register('ecart_pupillaire_vl')} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={`${t('ordonnances.pupillaryDistance')} VP`} type="number" inputProps={{ step: 0.5 }} {...register('ecart_pupillaire_vp')} /></Grid>
              <Grid size={12}><TextField fullWidth label={t('appointments.notes')} multiline rows={3} {...register('remarques')} /></Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={mutation.isPending}>{t('common.save')}</Button>
              <Button variant="outlined" onClick={() => navigate('/ordonnances')}>{t('common.cancel')}</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrdonnanceFormPage;
