import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { authApi } from '../api/index.js';
import { setToken, clearToken } from '../utils/authToken.js';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, loading: true };
    case 'INIT_SUCCESS':
      return { loading: false, user: action.payload.user, isAuthenticated: true };
    case 'INIT_FAILURE':
      return { user: null, isAuthenticated: false, loading: false };
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { loading: false, user: action.payload.user, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreSession = async () => {
      dispatch({ type: 'INIT_START' });
      try {
        const response = await authApi.profile();
        dispatch({ type: 'INIT_SUCCESS', payload: { user: response.data } });
      } catch {
        dispatch({ type: 'INIT_FAILURE' });
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authApi.login({ email, password });
      const { user, token } = response.data;
      if (token) setToken(token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const hasRole = useCallback((...roles) => roles.includes(state.user?.role), [state.user]);

  const value = useMemo(() => ({
    ...state, login, logout, hasRole,
  }), [state, login, logout, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
