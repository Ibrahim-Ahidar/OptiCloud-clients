import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import PageHeader from '../components/PageHeader.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useThemeMode } from '../context/ThemeContext.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import { authApi } from '../api/index.js';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const { language, setLanguage, languages } = useLocale();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.profile(),
  });

  const user = data?.data;

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{t('settings.appearance')}</Typography>
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
            label={t('settings.darkMode')}
          />
          <Box mt={2} maxWidth={300}>
            <TextField
              select fullWidth label={t('settings.language')} value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>{t('settings.account')}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>{t('settings.store')}</Typography>
          <Typography gutterBottom>{user?.nommagasin}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>{t('settings.email')}</Typography>
          <Typography gutterBottom>{user?.email}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>{t('settings.role')}</Typography>
          <Chip label={t(`roles.${user?.role}`, user?.role)} color="primary" size="small" />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;
