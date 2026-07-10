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
import { patientsApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const PatientFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const schema = z.object({
    nom: z.string().min(1, t('validation.required')),
    prenom: z.string().min(1, t('validation.required')),
    date_naissance: z.string().optional(),
    sexe: z.enum(['M', 'F', 'Autre']).optional().or(z.literal('')),
    telephone: z.string().optional(),
    email: z.string().email(t('validation.invalidEmail')).optional().or(z.literal('')),
    adresse: z.string().optional(),
    code_postal: z.string().optional(),
    ville: z.string().optional(),
    numero_securite_sociale: z.string().optional(),
    nom_mutuelle: z.string().optional(),
    numero_adherent_mutuelle: z.string().optional(),
    notes_importantes: z.string().optional(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsApi.getById(id),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data?.data) reset(data.data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (formData) => (isEdit ? patientsApi.update(id, formData) : patientsApi.create(formData)),
    onSuccess: () => {
      toast.success(isEdit ? t('common.updated') : t('common.created'));
      navigate('/patients');
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  if (isEdit && isLoading) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? t('patients.edit') : t('patients.new')}
        breadcrumbs={[{ label: t('patients.title'), to: '/patients' }, { label: isEdit ? t('common.edit') : t('common.new') }]}
        backTo="/patients"
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={t('patients.nom')} {...register('nom')} error={!!errors.nom} helperText={errors.nom?.message} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={t('patients.prenom')} {...register('prenom')} error={!!errors.prenom} helperText={errors.prenom?.message} /></Grid>
              <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label={t('ordonnances.date')} type="date" InputLabelProps={{ shrink: true }} {...register('date_naissance')} /></Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth select label={t('patients.sexe')} {...register('sexe')}>
                  <MenuItem value="">—</MenuItem>
                  <MenuItem value="M">{t('patients.sexeM')}</MenuItem>
                  <MenuItem value="F">{t('patients.sexeF')}</MenuItem>
                  <MenuItem value="Autre">{t('patients.sexeAutre')}</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label={t('patients.telephone')} {...register('telephone')} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={t('settings.email')} {...register('email')} error={!!errors.email} helperText={errors.email?.message} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={t('patients.ville')} {...register('ville')} /></Grid>
              <Grid size={12}><TextField fullWidth label={t('catalog.adresse')} multiline rows={2} {...register('adresse')} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={t('patients.mutuelle')} {...register('nom_mutuelle')} /></Grid>
              <Grid size={12}><TextField fullWidth label={t('appointments.notes')} multiline rows={3} {...register('notes_importantes')} /></Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={mutation.isPending}>{t('common.save')}</Button>
              <Button variant="outlined" onClick={() => navigate('/patients')}>{t('common.cancel')}</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientFormPage;
