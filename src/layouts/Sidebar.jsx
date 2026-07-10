import { memo, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import InventoryIcon from '@mui/icons-material/Inventory';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../context/AuthContext.jsx';
import { activeNavItem, scrollAreaSx, sidebarWidth } from '../styles/tokens.js';

const DRAWER_WIDTH = sidebarWidth;

const isSelected = (pathname, path) => {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
};

const Sidebar = memo(({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const { hasRole } = useAuth();

  const navScrollSx = {
    ...scrollAreaSx,
    scrollbarColor: `${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'} transparent`,
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)',
      borderRadius: 8,
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
    },
  };

  const sections = useMemo(() => [
    {
      key: 'overview',
      items: [
        { labelKey: 'nav.dashboard', path: '/', icon: <DashboardIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
        { labelKey: 'nav.reports', path: '/reports', icon: <BarChartIcon />, roles: ['ADMIN', 'OPTICIEN'] },
      ],
    },
    {
      key: 'clinical',
      items: [
        { labelKey: 'nav.patients', path: '/patients', icon: <PeopleIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
        { labelKey: 'nav.ordonnances', path: '/ordonnances', icon: <DescriptionIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
        { labelKey: 'nav.appointments', path: '/appointments', icon: <EventIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
        { labelKey: 'nav.devis', path: '/devis', icon: <RequestQuoteIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
      ],
    },
    {
      key: 'inventory',
      items: [
        { labelKey: 'nav.montures', path: '/products/montures', icon: <InventoryIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
        { labelKey: 'nav.verres', path: '/products/verres', icon: <VisibilityIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
        { labelKey: 'nav.lentilles', path: '/products/lentilles', icon: <InventoryIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
      ],
    },
    {
      key: 'catalog',
      items: [
        { labelKey: 'nav.categories', path: '/categories', icon: <CategoryIcon />, roles: ['ADMIN'] },
        { labelKey: 'nav.marques', path: '/marques', icon: <BrandingWatermarkIcon />, roles: ['ADMIN'] },
        { labelKey: 'nav.fournisseurs', path: '/fournisseurs', icon: <LocalShippingIcon />, roles: ['ADMIN', 'OPTICIEN'] },
      ],
    },
    {
      key: 'system',
      items: [
        { labelKey: 'nav.settings', path: '/settings', icon: <SettingsIcon />, roles: ['ADMIN', 'OPTICIEN', 'RECEPTION'] },
      ],
    },
  ], []);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <VisibilityIcon color="primary" sx={{ fontSize: { xs: 28, md: 32 }, flexShrink: 0 }} />
        <Box minWidth={0}>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2} noWrap>{t('common.appName')}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t('common.tagline')}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ ...navScrollSx, px: 1, py: 1, pb: 2 }}>
        {sections.map((section) => {
          const items = section.items.filter((item) => hasRole(...item.roles));
          if (items.length === 0) return null;
          return (
            <Box key={section.key} mb={1}>
              <Typography variant="overline" color="text.secondary" sx={{ px: 2, display: 'block', fontSize: '0.65rem' }}>
                {t(`nav.sections.${section.key}`)}
              </Typography>
              <List dense disablePadding>
                {items.map((item) => {
                  const selected = isSelected(location.pathname, item.path);
                  return (
                    <ListItemButton
                      key={item.path}
                      selected={selected}
                      onClick={() => { navigate(item.path); onClose?.(); }}
                      sx={{
                        borderRadius: 1,
                        mb: 0.25,
                        ...(selected ? activeNavItem : {}),
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, flexShrink: 0 }}>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={t(item.labelKey)}
                        slotProps={{
                          primary: {
                            fontSize: '0.9rem',
                            noWrap: true,
                            sx: { overflow: 'hidden', textOverflow: 'ellipsis' },
                          },
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, height: '100%', overflow: 'hidden' } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
export { DRAWER_WIDTH };
export default Sidebar;
