import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n/index.js';
import App from './App.jsx';
import AppOverlay from './components/AppOverlay.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BusyProvider } from './context/BusyContext.jsx';
import { LocaleProvider } from './context/LocaleContext.jsx';
import { wakeBackend } from './api/wakeBackend.js';

wakeBackend();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30000 },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LocaleProvider>
            <BusyProvider>
              <AuthProvider>
                <BrowserRouter>
                  <App />
                  <AppOverlay />
                  <ToastContainer position="top-right" autoClose={3000} theme="colored" />
                </BrowserRouter>
              </AuthProvider>
            </BusyProvider>
          </LocaleProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
