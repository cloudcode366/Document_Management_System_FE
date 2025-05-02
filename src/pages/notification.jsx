import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Badge } from "antd";
import "@/styles/notification.scss";
import { useNotification } from "@/components/context/notification.context";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const NotificationPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    totalUnread,
  } = useNotification();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const LIMIT = 10;

  useEffect(() => {
    loadNotifications(1);
  }, []);

  const loadNotifications = async (pageNumber) => {
    setIsLoading(true);
    const hasMoreData = await fetchNotifications(pageNumber, LIMIT);
    setIsLoading(false);
    setHasMore(hasMoreData);
    setPage(pageNumber);
  };

  const handleLoadMore = () => {
    loadNotifications(page + 1);
  };

  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    navigate(item.redirectUrl.replace("/task/", "/task-detail/"));
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
            <Badge count={totalUnread} style={{ backgroundColor: "#FF4D4F" }} />
          </Title>
          <Button
            type="primary"
            onClick={markAllAsRead}
            disabled={totalUnread === 0}
            style={{ marginBottom: 20 }}
          >
            Đánh dấu tất cả là đã đọc
          </Button>
        </div>

        <ul className="notification-list">
          {notifications.map((item) => (
            <li key={item.id} onClick={() => handleNotificationClick(item)}>
              <Text strong className="notification-title">
                {dayjs(item.createdAt).format("DD-MM-YYYY HH:mm")}:{" "}
                <a href={item.link} className="notification-link">
                  {item.title}
                </a>
                {!item.isRead && (
                  <Badge status="warning" className="custom-warning-badge" />
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
