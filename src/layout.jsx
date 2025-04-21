import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  LogoutOutlined,
  FileAddOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  FileProtectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Avatar, Badge, App } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "@/styles/layout.admin.scss";
import { LuBookMinus, LuWorkflow } from "react-icons/lu";
import { useCurrentApp } from "components/context/app.context";
import { GrDocumentConfig } from "react-icons/gr";
import { GiOrganigram } from "react-icons/gi";
import { useNotification } from "components/context/notification.context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, totalUnread, markAsRead } = useNotification();

  const handleClickNotification = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const notificationItems = notifications?.map((item) => ({
    key: item.id,
    label: (
      <div
        onClick={() => handleClickNotification(item)}
        style={{
          padding: "10px",
          backgroundColor: item.read ? "#fff" : "#e6f7ff",
          borderBottom: "1px solid #f0f0f0",
          whiteSpace: "normal",
          maxWidth: "300px",
        }}
      >
        <div style={{ fontWeight: item.read ? "normal" : "bold" }}>
          {item.title || "Không có tiêu đề"}
        </div>
        <div style={{ fontSize: "12px", color: "#999" }}>
          {dayjs(item.createdAt).fromNow()}
        </div>
      </div>
    ),
  }));

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => navigate("/notification")}
      style={{ cursor: "pointer" }}
    >
      <Dropdown
        open={open}
        menu={{ items: notificationItems }}
        placement="bottomRight"
        overlayClassName="notification-dropdown"
      >
        <Badge count={totalUnread} size="small">
          <BellOutlined style={{ fontSize: "18px" }} />
        </Badge>
      </Dropdown>
    </div>
  );
};

const { Content, Sider } = Layout;

const LayoutClient = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentKey = location.pathname;
  const { message, notification } = App.useApp();

  const { user, setUser, isAppLoading, isAuthenticated, setIsAuthenticated } =
    useCurrentApp();
  const { notifications, totalUnread, isLoading, markAsRead } =
    useNotification();

  const handleLogout = () => {
    message.success("Đăng xuất thành công!");
    localStorage.removeItem(`access_token`);
    localStorage.removeItem(`user_id`);

    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const items = [
    {
      label: <span>Danh sách văn bản</span>,
      key: "/",
      icon: <FileTextOutlined />,
      children: [
        {
          label: <Link to="/">Tất cả</Link>,
          key: "/",
        },
        {
          label: <Link to="/outgoing-document">Văn bản đi</Link>,
          key: "/outgoing-document",
        },
        {
          label: <Link to="/incoming-document">Văn bản đến</Link>,
          key: "/incoming-document",
        },
        {
          label: <Link to="/division-scoped-document">Văn bản phòng ban</Link>,
          key: "/division-scoped-document",
        },
        {
          label: <Link to="/school-scoped-document">Văn bản toàn trường</Link>,
          key: "/school-scoped-document",
        },
      ],
    },
    {
      label: <Link to="/progress">Danh sách khởi tạo</Link>,
      key: "/progress",
      icon: <FileAddOutlined />,
    },
    {
      label: <Link to="/task">Nhiệm vụ</Link>,
      key: "/task",
      icon: <LuBookMinus />,
    },
    {
      label: <Link to="/document-template">Mẫu văn bản</Link>,
      key: "/document-template",
      icon: <FileSearchOutlined />,
    },
    {
      label: <Link to="/workflow">Luồng xử lý</Link>,
      key: "/workflow",
      icon: <LuWorkflow />,
    },
    {
      label: <Link to="/document-type">Loại văn bản</Link>,
      key: "/document-type",
      icon: <GrDocumentConfig />,
    },
    {
      label: <Link to="/archived-document">Văn bản lưu trữ</Link>,
      key: "/archived-document",
      icon: <FileProtectOutlined />,
    },
    {
      label: <Link to="/user">Danh sách thành viên</Link>,
      key: "/user",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/division">Danh sách phòng ban</Link>,
      key: "/division",
      icon: <GiOrganigram />,
    },
    {
      label: <Link to="/user-guide">Hướng dẫn sử dụng</Link>,
      key: "/user-guide",
      icon: <QuestionCircleOutlined />,
    },
  ];

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer", color: " #0387EF" }}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
      icon: <CgProfile style={{ fontSize: "18px", color: " #0387EF" }} />,
    },
    {
      label: (
        <label style={{ cursor: "pointer", color: "red" }}>Đăng xuất</label>
      ),
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: "18px", color: "red" }} />,
    },
  ];

  if (isAuthenticated === false) {
    return <Outlet />;
  }

  const filterMenuItemsByRole = (roleName) => {
    return items.filter((item) => {
      if (item.key === "/division") {
        return roleName === "Leader";
      }

      if (item.key === "/user") {
        return roleName !== "Clerical Assistant" && roleName !== "Specialist";
      }

      return true; // Các item còn lại luôn hiển thị
    });
  };

  const filteredItems = filterMenuItemsByRole(user?.mainRole?.roleName);

  return (
    <>
      <Layout
        style={{ minHeight: "100vh", backgroundColor: "#e8edfa" }}
        className="layout-admin"
      >
        {/* <Sider
          style={{ backgroundColor: "#0387EF", color: "#ffffff" }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          width={270}
          collapsedWidth={80}
        >
          <div
            style={{
              height: "100px",
              position: "relative",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "10px",
              whiteSpace: "nowrap",
            }}
          >
            <img
              src="/logo.svg"
              alt="logo"
              style={{
                maxHeight: "40px",
                objectFit: "contain",
              }}
            />
            {!collapsed && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                <span>Hệ Thống</span>
                <span>Quản Lý Văn Bản</span>
              </div>
            )}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "1px",
                backgroundColor: "#ffffff",
              }}
            ></div>
          </div>
          <Menu
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[currentKey]}
            mode="inline"
            items={filteredItems}
            onClick={(e) => setActiveMenu(e.key)}
            style={{
              backgroundColor: " #0387EF",
              color: "white",
              fontWeight: "bold",
            }}
            className="custom-menu"
          />
        </Sider> */}

        <Sider
          style={{ backgroundColor: "#0387EF", color: "#ffffff" }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          width={270}
          collapsedWidth={80}
        >
          <div
            style={{
              height: "100px",
              position: "relative",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "10px",
              whiteSpace: "nowrap",
            }}
          >
            {/* Bọc logo và tên trong Link để điều hướng đến path "/" */}
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                src="/logo.svg"
                alt="logo"
                style={{
                  maxHeight: "40px",
                  objectFit: "contain",
                }}
              />
              {!collapsed && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  <span>Hệ Thống</span>
                  <span>Quản Lý Văn Bản</span>
                </div>
              )}
            </Link>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "1px",
                backgroundColor: "#ffffff",
              }}
            ></div>
          </div>
          <Menu
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[currentKey]}
            mode="inline"
            items={filteredItems}
            onClick={(e) => setActiveMenu(e.key)}
            style={{
              backgroundColor: " #0387EF",
              color: "white",
              fontWeight: "bold",
            }}
            className="custom-menu"
          />
        </Sider>

        <Layout>
          <div style={{ backgroundColor: "#e8edfa" }}>
            <div
              className="admin-header"
              style={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 15px",
                background: "white",
                marginLeft: "20px",
                borderRadius: "10px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <span>
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: "trigger",
                    onClick: () => setCollapsed(!collapsed),
                  }
                )}
              </span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <QuestionCircleOutlined
                  style={{ fontSize: "16px", cursor: "pointer" }}
                  onClick={() => navigate("/user-guide")}
                />

                <NotificationDropdown />

                <Dropdown
                  menu={{
                    items: itemsDropdown,
                    onClick: ({ key }) => {
                      if (key === "logout") handleLogout();
                      else if (key === "account") navigate("/profile");
                    },
                  }}
                  trigger={["click"]}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: "1",
                        textAlign: "right",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        {user?.fullName}
                      </span>
                      <span style={{ fontSize: "12px" }}>{user?.email}</span>
                    </div>

                    <Avatar src={user?.avatar?.replace(/^"|"$/g, "")} />
                  </div>
                </Dropdown>
              </div>
            </div>
            <Content style={{ marginLeft: "20px", right: 0 }}>
              <Outlet />
            </Content>
          </div>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutClient;
