import { createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/index.js';
import { isCanceled, withRetry } from '../api/retry.js';
import { wakeBackend } from '../api/wakeBackend.js';
import { setToken, clearToken } from '../utils/authToken.js';
import { setSessionHint, clearSessionHint } from '../utils/sessionHint.js';
import { useBusy } from './BusyContext.jsx';

const AuthContext = createContext();

const initialState = {
  user: null,
  status: 'loading',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_START':
      if (state.status === 'authenticated') return state;
      return { ...state, status: 'loading' };
    case 'INIT_SUCCESS':
    case 'LOGIN_SUCCESS':
      return { user: action.payload.user, status: 'authenticated' };
    case 'INIT_FAILURE':
      if (state.status === 'authenticated') return state;
      return { user: null, status: 'unauthenticated' };
    case 'LOGIN_FAILURE':
      return { ...state, status: state.user ? 'authenticated' : 'unauthenticated' };
    case 'LOGOUT':
      return { user: null, status: 'unauthenticated' };
    default:
      return state;
  }
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const { startBusy, stopBusy } = useBusy();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const restoreControllerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    restoreControllerRef.current = controller;

    const restoreSession = async () => {
      wakeBackend();
      dispatch({ type: 'INIT_START' });
      try {
        const response = await withRetry(
          () => authApi.profile({ signal: controller.signal }),
          { signal: controller.signal },
        );
        setSessionHint();
        dispatch({ type: 'INIT_SUCCESS', payload: { user: response.data } });
      } catch (error) {
        if (isCanceled(error) || controller.signal.aborted) return;
        const statusCode = error.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          clearSessionHint();
        }
        dispatch({ type: 'INIT_FAILURE' });
      }
    };

    restoreSession();
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email, password) => {
    restoreControllerRef.current?.abort();
    startBusy(t('busy.signingIn'));
    try {
      const response = await withRetry(
        () => authApi.login({ email, password }),
        {
          retryable: (error) => {
            if (isCanceled(error)) return false;
            if (!error.response) return true;
            return [408, 502, 503, 504].includes(error.response.status);
          },
        },
      );
      const { user, token } = response.data;
      if (token) setToken(token);
      setSessionHint();
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    } finally {
      stopBusy();
    }
  }, [startBusy, stopBusy, t]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearToken();
    clearSessionHint();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const hasRole = useCallback((...roles) => roles.includes(state.user?.role), [state.user]);

  const value = useMemo(() => ({
    user: state.user,
    status: state.status,
    loading: state.status === 'loading',
    isAuthenticated: state.status === 'authenticated',
    login,
    logout,
    hasRole,
  }), [state, login, logout, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
