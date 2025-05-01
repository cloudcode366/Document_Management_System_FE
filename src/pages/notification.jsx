import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Badge } from "antd";
import "@/styles/notification.scss";
import { useCurrentApp } from "@/components/context/app.context";
import {
  viewNotificationsByUserId,
  updateMarkNotificationAsRead,
} from "@/services/api.service";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const NotificationPage = () => {
  const { user } = useCurrentApp();

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const navigate = useNavigate();
  const LIMIT = 10;

  const fetchNotifications = async (pageNumber = 1, limit = LIMIT) => {
    if (!user?.userId) return;
    setIsLoading(true);

    try {
      const res = await viewNotificationsByUserId(
        user.userId,
        pageNumber,
        limit
      );
      if (res.data.statusCode === 200) {
        const list = res.data.content || [];

        // Reset hoặc nối thêm vào danh sách
        if (pageNumber === 1) {
          setNotifications(list);
        } else {
          setNotifications((prev) => [...prev, ...list]);
        }

        if (list.length < limit) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Lỗi khi gọi API viewNotificationsByUserId:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  useEffect(() => {
    // Cập nhật totalUnread mỗi khi notifications thay đổi
    const unreadCount = notifications.filter((item) => !item.isRead).length;
    setTotalUnread(unreadCount);
  }, [notifications]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await updateMarkNotificationAsRead(notificationId);
      if (res.data.statusCode === 200) {
        // Cập nhật lại trạng thái thông báo là đã đọc
        setNotifications((prevNotifications) => {
          const updatedNotifications = prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          );
          // Tính lại totalUnread ngay sau khi cập nhật notifications
          const unreadCount = updatedNotifications.filter(
            (item) => !item.isRead
          ).length;
          setTotalUnread(unreadCount); // Cập nhật lại totalUnread ngay
          return updatedNotifications;
        });
      }
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((item) => !item.isRead);
      for (const notification of unreadNotifications) {
        await updateMarkNotificationAsRead(notification.id);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setTotalUnread(0); // Sau khi tất cả đều đã đọc, cập nhật lại totalUnread
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", err);
    }
  };

  const handleRedirectToTaskDetail = (redirectUrl) => {
    // Chỉnh sửa lại đường dẫn để thay task thành task-detail
    const updatedUrl = redirectUrl.replace("/task/", "/task-detail/");
    navigate(updatedUrl); // Điều hướng đến URL đã chỉnh sửa
  };

  return (
    <div className="notification-container">
      <Card className="notification-card" bordered>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>
            Thông báo{" "}
            <Badge count={totalUnread} style={{ backgroundColor: "#52c41a" }} />
          </Title>
          <Button
            type="primary"
            onClick={handleMarkAllAsRead}
            disabled={totalUnread === 0}
            style={{ marginBottom: "20px" }}
          >
            Đánh dấu tất cả là đã đọc
          </Button>
        </div>
        <ul className="notification-list">
          {notifications.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                if (!item.isRead) handleMarkAsRead(item.id);
                handleRedirectToTaskDetail(item.redirectUrl);
              }}
            >
              <Text strong className="notification-title">
                {dayjs(item.createdAt).format("DD-MM-YYYY HH:mm")}:{" "}
                <a href={item.link} className="notification-link">
                  {item.title}
                </a>{" "}
                {!item.isRead && (
                  <Badge status="processing" style={{ marginLeft: 8 }} />
                )}
              </Text>
              <Text className="notification-content">{item.content}</Text>
            </li>
          ))}
        </ul>

        {hasMore && (
          <Button
            className="load-more-btn"
            onClick={handleLoadMore}
            loading={isLoading}
          >
            Xem thông báo trước đó
          </Button>
        )}
      </Card>
    </div>
  );
};

export default NotificationPage;
