import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ForbiddenPage = memo(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={3}>
      <Box textAlign="center" maxWidth={480}>
        <Typography variant="h4" gutterBottom>403</Typography>
        <Typography variant="h6" gutterBottom>
          {t('errors.forbidden', 'Accès refusé')}
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {t('errors.forbiddenMessage', "Vous n'avez pas les permissions nécessaires pour accéder à cette page.")}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          {t('common.backToDashboard', 'Retour au tableau de bord')}
        </Button>
      </Box>
    </Box>
  );
});

ForbiddenPage.displayName = 'ForbiddenPage';
export default ForbiddenPage;
