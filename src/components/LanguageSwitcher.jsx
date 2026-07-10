import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import LanguageIcon from '@mui/icons-material/Language';
import { useLocale } from '../context/LocaleContext.jsx';

const LanguageSwitcher = memo(() => {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useLocale();
  const [anchorEl, setAnchorEl] = useState(null);

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <>
      <Button
        size="small"
        startIcon={<LanguageIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ mr: 1, minWidth: 100 }}
      >
        {current.flag} {current.code.toUpperCase()}
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={lang.code === language}
            onClick={() => { setLanguage(lang.code); setAnchorEl(null); }}
          >
            {lang.flag} {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
export default LanguageSwitcher;
