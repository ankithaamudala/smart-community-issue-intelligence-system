import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || []);
    } catch (error) {
      // Silence fetch failures in the bell UI and keep app responsive.
      setNotifications((prev) => prev);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    if (!token) {
      return undefined;
    }

    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [token, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);
    setNotifications((prev) =>
      prev.map((item) => (item._id === notificationId ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = async () => {
    await api.patch("/notifications/read-all");
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const value = useMemo(
    () => ({
      notifications,
      loading,
      unreadCount: notifications.filter((item) => !item.isRead).length,
      fetchNotifications,
      markAsRead,
      markAllAsRead
    }),
    [fetchNotifications, loading, notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider.");
  }
  return context;
};

