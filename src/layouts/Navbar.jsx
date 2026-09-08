import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext.jsx';
import { useThemeMode } from '../context/ThemeContext.jsx';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';

const Navbar = memo(({ onMenuClick, drawerWidth }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Box flex={1} />

        <LanguageSwitcher />

        <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>

        {user?.role && (
          <Chip
            label={t(`roles.${user.role}`, user.role)}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mr: 2 }}
          />
        )}

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
            {user?.responsable?.[0] || user?.nommagasin?.[0] || 'U'}
          </Avatar>
        </IconButton>

        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <Box px={2} py={1}>
            <Typography variant="subtitle2" fontWeight={600}>{user?.nommagasin}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <MenuItem onClick={() => { setAnchorEl(null); logout(); }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> {t('auth.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
