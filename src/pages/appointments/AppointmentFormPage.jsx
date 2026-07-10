import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
import Divider from '@mui/material/Divider';
import { rendezVousApi, patientsApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import TimeSlotPicker from '../../components/TimeSlotPicker.jsx';

const DURATION_OPTIONS = [15, 30, 45, 60];

const AppointmentFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const schema = z.object({
    idpatient: z.coerce.number().min(1),
    appointmentDate: z.string().min(1),
    appointmentTime: z.string().min(1, t('appointments.timeRequired')),
    duree_minutes: z.coerce.number().min(15),
    motif: z.string().optional(),
    statut: z.enum(['planifie', 'confirme', 'annule', 'termine']).optional(),
    notes: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      statut: 'planifie',
      duree_minutes: 30,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '',
    },
  });

  const appointmentDate = watch('appointmentDate');
  const appointmentTime = watch('appointmentTime');
  const duration = watch('duree_minutes');

  const { data: patientsData } = useQuery({
    queryKey: ['patients-list'],
    queryFn: () => patientsApi.getAll({ limit: 100 }),
  });

  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ['rendez-vous', id],
    queryFn: () => rendezVousApi.getById(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (appointmentData?.data) {
      const a = appointmentData.data;
      const rdv = new Date(a.date_rdv);
      const time = `${String(rdv.getHours()).padStart(2, '0')}:${String(rdv.getMinutes()).padStart(2, '0')}`;
      reset({
        idpatient: a.idpatient,
        appointmentDate: rdv.toISOString().split('T')[0],
        appointmentTime: time,
        duree_minutes: a.duree_minutes || 30,
        motif: a.motif || '',
        statut: a.statut,
        notes: a.notes || '',
      });
    }
  }, [appointmentData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => (isEdit ? rendezVousApi.update(id, data) : rendezVousApi.create(data)),
    onSuccess: () => {
      toast.success(isEdit ? t('appointments.updated') : t('appointments.created'));
      navigate('/appointments');
    },
    onError: (err) => {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 409) {
        toast.error(t('appointments.slotTaken'));
        setValue('appointmentTime', '');
      } else {
        toast.error(message || t('common.error'));
      }
    },
  });

  const onSubmit = (formData) => {
    const date_rdv = `${formData.appointmentDate}T${formData.appointmentTime}:00`;
    mutation.mutate({
      idpatient: formData.idpatient,
      date_rdv,
      duree_minutes: formData.duree_minutes,
      motif: formData.motif,
      statut: formData.statut,
      notes: formData.notes,
    });
  };

  if (isEdit && isLoading) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? t('appointments.edit') : t('appointments.new')}
        breadcrumbs={[
          { label: t('appointments.title'), to: '/appointments' },
          { label: isEdit ? t('common.edit') : t('common.new') },
        ]}
        backTo="/appointments"
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label={t('appointments.patient')}
                  {...register('idpatient')}
                  error={!!errors.idpatient}
                  helperText={errors.idpatient?.message}
                >
                  {(patientsData?.data?.items || []).map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.prenom} {p.nom}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label={t('appointments.dateOnly')}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ ...(isEdit ? {} : { min: new Date().toISOString().split('T')[0] }) }}
                  {...register('appointmentDate')}
                  error={!!errors.appointmentDate}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  select
                  label={t('appointments.duration')}
                  {...register('duree_minutes')}
                >
                  {DURATION_OPTIONS.map((d) => (
                    <MenuItem key={d} value={d}>{d} min</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={12}>
                <Divider sx={{ my: 0.5 }} />
              </Grid>

              <Grid size={12}>
                <Controller
                  name="appointmentTime"
                  control={control}
                  render={({ field }) => (
                    <TimeSlotPicker
                      date={appointmentDate}
                      duration={Number(duration) || 30}
                      value={field.value}
                      onChange={field.onChange}
                      excludeId={isEdit ? Number(id) : undefined}
                      error={errors.appointmentTime?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth select label={t('devis.filterStatus')} {...register('statut')}>
                  {['planifie', 'confirme', 'annule', 'termine'].map((s) => (
                    <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField fullWidth label={t('appointments.motif')} {...register('motif')} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label={t('appointments.notes')} multiline rows={3} {...register('notes')} />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={mutation.isPending || !appointmentTime}
              >
                {t('common.save')}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/appointments')}>{t('common.cancel')}</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentFormPage;
