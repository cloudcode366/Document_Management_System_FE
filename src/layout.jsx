import React, { useState } from "react";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  LogoutOutlined,
  SignatureOutlined,
  SignatureFilled,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Avatar, Badge } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { GiDigitalTrace, GiOrganigram } from "react-icons/gi";
import { LuUserCog } from "react-icons/lu";
import { GrDocumentConfig } from "react-icons/gr";
import { LuWorkflow } from "react-icons/lu";
import { TbLogs } from "react-icons/tb";
import { CgDigitalocean, CgProfile } from "react-icons/cg";
import "@/styles/layout.admin.scss";
import { CgFileDocument } from "react-icons/cg";
import { GiProgression } from "react-icons/gi";

const { Content, Sider } = Layout;

const LayoutClient = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentKey = location.pathname;

  // const { user, setUser, setIsAuthenticated, isAuthenticated } =
  //   useCurrentApp();

  // const handleLogout = async () => {
  //   //todo
  //   const res = await logoutAPI();
  //   if (res.data) {
  //     setUser(null);
  //     setIsAuthenticated(false);
  //     localStorage.removeItem("access_token");
  //   }
  // };

  const items = [
    {
      label: <span>Danh sách văn bản</span>,
      key: "/",
      icon: <CgFileDocument />,
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
      label: <Link to="/progress">Danh sách văn bản khởi tạo</Link>,
      key: "/progress",
      icon: <GiProgression />,
    },
    {
      label: <Link to="/document-template">Mẫu văn bản</Link>,
      key: "/document-template",
      icon: <GiProgression />,
    },
    {
      label: <Link to="/user-guide">Hướng dẫn sử dụng</Link>,
      key: "/admin/user-guide",
      icon: <QuestionCircleOutlined />,
    },
  ];

  const itemsDropdown = [
    {
      label: (
        <label
          style={{ cursor: "pointer", color: " #0387EF" }}
          onClick={() => navigate("/profile")}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
      icon: <CgProfile style={{ fontSize: "18px", color: " #0387EF" }} />,
    },
    {
      label: (
        <label
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => navigate("/login")}
        >
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: "18px", color: "red" }} />,
    },
  ];

  // const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
  //   user?.avatar
  // }`;

  // if (isAuthenticated === false) {
  //   return <Outlet />;
  // }

  // const isAdminRoute = location.pathname.includes("admin");
  // if (isAuthenticated === true && isAdminRoute === true) {
  //   const role = user?.role;
  //   if (role === "USER") {
  //     return <Outlet />;
  //   }
  // }

  return (
    <>
      <Layout
        style={{ minHeight: "100vh", backgroundColor: "#e8edfa" }}
        className="layout-admin"
      >
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
            items={items}
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
                  onClick={() => navigate("/admin/user-guide")}
                />

                <Badge count={2}>
                  <BellOutlined
                    style={{ fontSize: "16px", cursor: "pointer" }}
                    onClick={() => navigate("/admin")}
                  />
                </Badge>

                <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
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
                        Ngô Huỳnh Tấn Lộc
                      </span>
                      <span style={{ fontSize: "12px" }}>
                        locnht1@gmail.com
                      </span>
                    </div>

                    <Avatar />
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
