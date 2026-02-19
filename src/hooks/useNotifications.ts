import { useState, useCallback } from "react";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from "../services/notificationService";

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    getNotificationPermission,
  );

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  return {
    isSupported: isNotificationSupported(),
    permission,
    requestPermission,
  };
};
