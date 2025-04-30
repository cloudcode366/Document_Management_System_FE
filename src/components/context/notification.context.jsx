import React, { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr"; // Thêm SignalR
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
  const [connection, setConnection] = useState(null); // Kết nối SignalR

  // Hàm load thông báo từ API
  const fetchNotifications = async (page = 1, limit = 10) => {
    if (!user?.userId) return;

    console.log("Fetching notifications for user:", user.id);
    setIsLoading(true);

    try {
      const res = await viewNotificationsByUserId(user.userId, page, limit);
      console.log("API result:", res); // check dữ liệu trả về

      if (res.data.statusCode === 200) {
        const list = res.data.content || [];
        setNotifications(list);
        const unreadCount = list.filter((item) => !item.isRead).length;
        setTotalUnread(unreadCount);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API viewNotificationsByUserId:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Kết nối SignalR
  const connectSignalR = async () => {
    const token = localStorage.getItem("access_token");
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://103.90.227.64:5290/notificationHub", {
        accessTokenFactory: () => token,
      }) // Địa chỉ SignalR Hub của bạn
      .configureLogging(4) // Chọn mức log
      .build();

    newConnection.on("ReceiveMessage", (message) => {
      console.log("New notification:", message);
      setNotifications((prev) => [...prev, message]);
      setTotalUnread((prev) => prev + 1); // Tăng số thông báo chưa đọc
    });

    try {
      await newConnection.start();
      console.log("Connected to SignalR Hub");
      setConnection(newConnection);
    } catch (err) {
      console.error("Error while establishing connection:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      console.log("User logged in, fetching notifications");
      fetchNotifications();
      connectSignalR(); // Kết nối SignalR khi đăng nhập thành công
    }
  }, [isAuthenticated, user?.userId]);

  // Hàm đánh dấu thông báo là đã đọc
  const markAsRead = async (notificationId) => {
    try {
      const res = await updateMarkNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setTotalUnread((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Lỗi khi cập nhật thông báo đã đọc:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoading,
        totalUnread,
        fetchNotifications,
        markAsRead,
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
