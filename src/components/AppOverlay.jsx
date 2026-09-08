import { memo, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext.jsx';
import { useBusy } from '../context/BusyContext.jsx';
import { hasSessionHint } from '../utils/sessionHint.js';
import { isPublicPath } from '../routes/publicPaths.js';

const SLOW_HINT_MS = 4000;

const AppOverlay = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const { status } = useAuth();
  const { active: busyActive, message: busyMessage } = useBusy();
  const [slow, setSlow] = useState(false);

  const sessionHint = hasSessionHint();
  const sessionGated = !isPublicPath(location.pathname);
  const restoringSession = status === 'loading' && (sessionHint || sessionGated);

  const visible = busyActive || restoringSession;

  const label = useMemo(() => {
    if (busyActive && busyMessage) return busyMessage;
    if (sessionHint) return t('busy.openingWorkspace');
    return '';
  }, [busyActive, busyMessage, sessionHint, t]);

  useEffect(() => {
    if (!visible) {
      setSlow(false);
      return undefined;
    }
    const timer = setTimeout(() => setSlow(true), SLOW_HINT_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Box
      data-testid="app-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: (theme) => (
          theme.palette.mode === 'dark'
            ? 'rgba(10, 25, 41, 0.42)'
            : 'rgba(245, 247, 250, 0.38)'
        ),
        backdropFilter: 'blur(18px) saturate(1.15)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.15)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          maxWidth: 360,
          textAlign: 'center',
          background: 'none',
        }}
      >
        <CircularProgress size={44} thickness={3.6} />
        {label ? (
          <Typography variant="body1" sx={{ bgcolor: 'transparent' }}>
            {label}
          </Typography>
        ) : null}
        {slow ? (
          <Typography variant="body2" color="text.secondary" sx={{ bgcolor: 'transparent' }}>
            {t('busy.wakingServer')}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
});

AppOverlay.displayName = 'AppOverlay';
export default AppOverlay;
