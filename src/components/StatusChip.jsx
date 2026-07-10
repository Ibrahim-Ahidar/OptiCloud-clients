import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';

const STATUS_COLORS = {
  en_attente: 'warning',
  accepte: 'success',
  refuse: 'error',
  expire: 'default',
  planifie: 'info',
  confirme: 'success',
  annule: 'default',
  termine: 'primary',
};

const StatusChip = memo(({ status, size = 'small' }) => {
  const { t } = useTranslation();
  if (!status) return null;
  return (
    <Chip
      label={t(`status.${status}`, status)}
      size={size}
      color={STATUS_COLORS[status] || 'default'}
    />
  );
});

StatusChip.displayName = 'StatusChip';
export default StatusChip;
