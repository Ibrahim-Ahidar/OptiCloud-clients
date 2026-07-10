import { memo } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = memo(({ value, onChange, placeholder = 'Rechercher...', sx }) => (
  <TextField
    size="small"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    sx={{ minWidth: 240, ...sx }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" />
        </InputAdornment>
      ),
    }}
  />
));

SearchBar.displayName = 'SearchBar';
export default SearchBar;
