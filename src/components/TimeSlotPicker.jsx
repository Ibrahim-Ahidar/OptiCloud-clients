import { memo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { rendezVousApi } from '../api/index.js';

const TimeSlotPicker = memo(({
  date,
  duration = 30,
  value,
  onChange,
  excludeId,
  error,
}) => {
  const { t } = useTranslation();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['rendez-vous-slots', date, duration, excludeId],
    queryFn: () => rendezVousApi.getAvailableSlots({
      date,
      duree_minutes: duration,
      ...(excludeId ? { excludeId } : {}),
    }),
    enabled: Boolean(date && duration),
    staleTime: 30_000,
  });

  const slots = data?.data;
  const available = slots?.available || [];
  const booked = slots?.booked || [];
  const loading = isLoading || isFetching;

  useEffect(() => {
    if (!loading && value && (available.length === 0 || !available.includes(value))) {
      onChange('');
    }
  }, [available, value, onChange, loading]);

  if (!date) {
    return (
      <Alert severity="info" icon={<AccessTimeIcon />} sx={{ borderRadius: 2 }}>
        {t('appointments.pickDateFirst')}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          {t('appointments.selectTime')}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={72} height={36} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('appointments.selectTime')}
        </Typography>
        {slots?.workHours && (
          <Typography variant="caption" color="text.disabled">
            {t('appointments.workHours', { start: slots.workHours.start, end: slots.workHours.end })}
          </Typography>
        )}
      </Box>

      {available.length === 0 ? (
        <Alert severity="warning" icon={<EventBusyIcon />} sx={{ borderRadius: 2 }}>
          {t('appointments.noSlotsAvailable')}
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))',
            gap: 1,
          }}
        >
          {available.map((time) => {
            const selected = value === time;
            return (
              <Chip
                key={time}
                label={time}
                clickable
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                onClick={() => onChange(time)}
                sx={{
                  height: 40,
                  fontWeight: selected ? 600 : 400,
                  borderRadius: 2,
                  '&:hover': { bgcolor: selected ? 'primary.dark' : 'action.hover' },
                }}
              />
            );
          })}
        </Box>
      )}

      {booked.length > 0 && (
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
            {t('appointments.bookedTimes')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {booked.map((b) => (
              <Chip
                key={`${b.time}-${b.duree_minutes}`}
                size="small"
                label={`${b.time} · ${b.patient || t('appointments.occupied')}`}
                disabled
                sx={{ opacity: 0.7, borderRadius: 1.5 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" mt={1} display="block">
          {error}
        </Typography>
      )}
    </Box>
  );
});

TimeSlotPicker.displayName = 'TimeSlotPicker';

export default TimeSlotPicker;
