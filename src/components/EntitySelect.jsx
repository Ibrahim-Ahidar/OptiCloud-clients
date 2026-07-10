import { memo } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const EntitySelect = memo(({
  label,
  options = [],
  value,
  onChange,
  getOptionLabel = (opt) => opt?.label ?? String(opt),
  getOptionValue = (opt) => opt?.value ?? opt,
  disabled = false,
  error = false,
  helperText,
}) => {
  const selected = options.find((o) => getOptionValue(o) === value) || null;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      value={selected}
      onChange={(_, opt) => onChange(getOptionValue(opt) ?? '')}
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} label={label} error={error} helperText={helperText} />
      )}
      isOptionEqualToValue={(opt, val) => getOptionValue(opt) === getOptionValue(val)}
    />
  );
});

EntitySelect.displayName = 'EntitySelect';
export default EntitySelect;
