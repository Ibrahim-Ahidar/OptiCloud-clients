import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const BusyContext = createContext({
  active: false,
  message: '',
  startBusy: () => {},
  stopBusy: () => {},
});

export const useBusy = () => useContext(BusyContext);

export const BusyProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  const startBusy = useCallback((nextMessage) => {
    setMessage(nextMessage || '');
    setCount((current) => current + 1);
  }, []);

  const stopBusy = useCallback(() => {
    setCount((current) => Math.max(0, current - 1));
  }, []);

  const value = useMemo(() => ({
    active: count > 0,
    message,
    startBusy,
    stopBusy,
  }), [count, message, startBusy, stopBusy]);

  return <BusyContext.Provider value={value}>{children}</BusyContext.Provider>;
};
