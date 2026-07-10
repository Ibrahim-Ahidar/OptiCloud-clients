import { memo } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingSpinner = memo(({ fullPage = false, size = 40 }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight={fullPage ? '60vh' : 200}
    p={3}
  >
    <CircularProgress size={size} />
  </Box>
));

LoadingSpinner.displayName = 'LoadingSpinner';
export default LoadingSpinner;
