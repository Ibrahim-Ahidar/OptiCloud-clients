import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';

const EmptyState = memo(({ title, description, action }) => {
  const { t } = useTranslation();
  return (
    <Box textAlign="center" py={6} px={2}>
      <InboxIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title || t('common.noData')}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.disabled" mb={2}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
});

EmptyState.displayName = 'EmptyState';
export default EmptyState;
