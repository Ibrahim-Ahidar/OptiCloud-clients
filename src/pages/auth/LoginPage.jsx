import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import LanguageSwitcher from '../../components/LanguageSwitcher.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const DEMO_ADMIN = {
  email: 'admin@optivision.es',
  password: 'admin123',
};

const LoginPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const fromPath = location.state?.from?.pathname;
  const redirectTo = fromPath && fromPath !== '/login' ? fromPath : '/';

  const schema = z.object({
    email: z.string().email(t('auth.invalidEmail')),
    password: z.string().min(1, t('auth.passwordRequired')),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEMO_ADMIN,
  });

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success(t('auth.loginSuccess'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.loginFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setValue('email', DEMO_ADMIN.email, { shouldValidate: true });
    setValue('password', DEMO_ADMIN.password, { shouldValidate: true });
  };

  return (
    <Box minHeight="100vh" display="flex" bgcolor="background.default">
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
        }}
      >
        <VisibilityIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>{t('common.appName')}</Typography>
        <Typography variant="h6" sx={{ opacity: 0.85, textAlign: 'center', maxWidth: 400 }}>
          {t('common.tagline')}
        </Typography>
      </Box>

      <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={3}>
        <Card sx={{ maxWidth: 440, width: '100%', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="flex-end" mb={1}>
              <LanguageSwitcher />
            </Box>
            <Box mb={3}>
              <Box display="flex" alignItems="center" gap={1.5} mb={1} sx={{ display: { xs: 'flex', md: 'none' } }}>
                <VisibilityIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6" fontWeight={700}>{t('common.appName')}</Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>{t('auth.welcomeBack')}</Typography>
              <Typography color="text.secondary">{t('auth.signInSubtitle')}</Typography>
            </Box>

            <Alert
              severity="info"
              icon={<VisibilityIcon fontSize="inherit" />}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {t('auth.demoAccountTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('auth.demoAccountHint')}
              </Typography>
              <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', mt: 1 }}>
                {DEMO_ADMIN.email}
                <br />
                {DEMO_ADMIN.password}
              </Typography>
              <Button size="small" variant="outlined" onClick={fillDemoAdmin} sx={{ mt: 1.5 }}>
                {t('auth.useDemoAccount')}
              </Button>
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
              <TextField
                fullWidth label={t('auth.email')} margin="normal"
                {...register('email')} error={!!errors.email} helperText={errors.email?.message}
              />
              <TextField
                fullWidth label={t('auth.password')} type="password" margin="normal"
                {...register('password')} error={!!errors.password} helperText={errors.password?.message}
              />
              <Button
                fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3, py: 1.5 }}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : t('auth.login')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
