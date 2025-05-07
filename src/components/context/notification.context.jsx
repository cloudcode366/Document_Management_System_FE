import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useCurrentApp } from "./app.context";
import {
  updateMarkNotificationAsRead,
  viewNotificationsByUserId,
} from "@/services/api.service";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useCurrentApp();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const connectionRef = useRef(null); // useRef tránh re-render

  const fetchNotifications = async (page = 1, limit = 10) => {
    if (!user?.userId) return false;
    setIsLoading(true);
    try {
      const res = await viewNotificationsByUserId(user.userId, page, limit);
      if (res.data.statusCode === 200) {
        const list = res.data.content || [];
        setNotifications((prev) => (page === 1 ? list : [...prev, ...list]));
        const unread = list.filter((item) => !item.isRead).length;
        setTotalUnread((prev) => (page === 1 ? unread : prev + unread));

        return list.length === limit;
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const markAsRead = async (id) => {
    try {
      const res = await updateMarkNotificationAsRead(id);
      if (res.data.statusCode === 200) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setTotalUnread((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      for (const n of unread) await updateMarkNotificationAsRead(n.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setTotalUnread(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const connectSignalR = async () => {
    if (connectionRef.current) return;

    const token = localStorage.getItem("access_token");

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_BACKEND_URL}/notificationHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Thử lại sau 0ms, 2s, 5s, 10s
      .configureLogging(4)
      .build();

    const showNotification = (title, message) => {
      // Lấy domain gốc của ứng dụng (ví dụ: http://localhost:3000 hoặc https://yourdomain.com)
      const baseUrl = window.location.origin;

      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body: message.title,
          icon: "/logo.png",
        });

        notification.onclick = () => {
          if (message.redirectUrl) {
            const updatedRedirectUrl = message.redirectUrl.replace(
              "/task/",
              "/task-detail/"
            );
            const fullUrl = baseUrl + updatedRedirectUrl; // Tạo URL hoàn chỉnh
            window.open(fullUrl, "_blank"); // Mở URL trong tab mới
            notification.close(); // Đóng thông báo sau khi nhấp
          }
        };
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(title, {
              body: message.title,
              icon: "/logo.png",
            });

            // Thêm sự kiện onclick để điều hướng
            notification.onclick = () => {
              if (message.redirectUrl) {
                // Thay thế /task/ thành /task-detail/
                const updatedRedirectUrl = message.redirectUrl.replace(
                  "/task/",
                  "/task-detail/"
                );
                const fullUrl = baseUrl + updatedRedirectUrl; // Tạo URL hoàn chỉnh
                window.open(fullUrl, "_blank"); // Mở URL trong tab mới
                notification.close(); // Đóng thông báo sau khi nhấp
              }
            };
          }
        });
      }
    };

    newConnection.on("ReceiveMessage", (message) => {
      console.log("New notification:", message);
      setNotifications((prev) => [...prev, message]);
      if (!message.isRead) {
        setTotalUnread((prev) => prev + 1);
      }
      showNotification(
        "Thông báo mới từ signdoc-core",
        message || "Bạn có thông báo mới!"
      );
    });

    newConnection.onreconnecting((error) => {
      console.warn("SignalR reconnecting...", error);
    });

    newConnection.onreconnected((connectionId) => {
      console.log("SignalR reconnected with connectionId:", connectionId);
    });

    newConnection.onclose((error) => {
      // console.error("SignalR connection closed:", error);
      connectionRef.current = null; // Cho phép reconnect nếu cần thiết
    });

    try {
      await newConnection.start();
      console.log("Connected to SignalR Hub");
      connectionRef.current = newConnection;
    } catch (err) {
      console.error("Error while establishing SignalR connection:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      fetchNotifications();
      connectSignalR();
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop().then(() => {
          console.log("SignalR connection closed.");
          connectionRef.current = null;
        });
      }
    };
  }, [isAuthenticated, user?.userId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoading,
        totalUnread,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return ctx;
};
