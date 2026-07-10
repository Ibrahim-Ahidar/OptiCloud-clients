import { Component } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleReset = () => {
    window.location.href = '/login';
  };

  render() {
    if (this.state.error) {
      return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={3}>
          <Box textAlign="center" maxWidth={480}>
            <Typography variant="h5" gutterBottom>Une erreur est survenue</Typography>
            <Typography color="text.secondary" mb={3}>{this.state.error.message}</Typography>
            <Button variant="contained" onClick={this.handleReset}>Réinitialiser et reconnecter</Button>
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
