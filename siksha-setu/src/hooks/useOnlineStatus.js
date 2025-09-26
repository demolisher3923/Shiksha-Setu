import { useState, useEffect } from 'react';
import { isOnline, addOnlineListener, addOfflineListener, removeOnlineListener, removeOfflineListener } from '../utils/helpers';

export const useOnlineStatus = () => {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    addOnlineListener(handleOnline);
    addOfflineListener(handleOffline);

    return () => {
      removeOnlineListener(handleOnline);
      removeOfflineListener(handleOffline);
    };
  }, []);

  return online;
};
