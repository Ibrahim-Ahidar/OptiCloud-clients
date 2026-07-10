import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const PageHeader = memo(({ title, subtitle, breadcrumbs = [], action, backTo }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
      <Box display="flex" alignItems="flex-start" gap={1}>
        {backTo && (
          <IconButton onClick={() => navigate(backTo)} aria-label={t('common.back')} sx={{ mt: 0.5 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs sx={{ mb: 1 }}>
              {breadcrumbs.map((bc) => (
                bc.to ? (
                  <Link key={bc.label} component={RouterLink} to={bc.to} underline="hover" color="inherit">
                    {bc.label}
                  </Link>
                ) : (
                  <Typography key={bc.label} color="text.primary">{bc.label}</Typography>
                )
              ))}
            </Breadcrumbs>
          )}
          <Typography variant="h4" fontWeight={600}>{title}</Typography>
          {subtitle && <Typography color="text.secondary" mt={0.5}>{subtitle}</Typography>}
        </Box>
      </Box>
      {action}
    </Box>
  );
});

PageHeader.displayName = 'PageHeader';
export default PageHeader;
