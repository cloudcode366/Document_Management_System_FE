import React from "react";
import "./login.scss";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api.service";

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, user } = useCurrentApp();

  const onFinish = async (values) => {
    setLoading(true);
    const res = await loginAPI(values.username, values.password);
    if (res.data.statusCode === 201) {
      message.success(`Đăng nhập thành công!`);
      localStorage.setItem("access_token", res.data.content.token);
      localStorage.setItem("user_id", res.data.content.userDto.userId);
      const data = res.data.content.userDto;
      const mainRole = data?.roles?.find((r) => r.createdDate === null);
      const subRole = data?.roles?.filter((r) => r.createdDate !== null);
      setUser({ ...data, mainRole, subRole });
      setIsAuthenticated(true);
      if (mainRole === "Admin") navigate("/admin");
      else navigate("/");
    } else {
      let errorMessage = res?.data?.content;

      if (errorMessage === "Email not exists or Password not exists") {
        errorMessage = "Email không tồn tại hoặc sai mật khẩu!";
      }

      notification.error({
        message: "Đăng nhập không thành công",
        description: errorMessage,
      });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="left">
        <div className="content">
          <h1>HỆ THỐNG QUẢN LÝ VĂN BẢN</h1>
          <p>Có tích hợp AI thông minh</p>
        </div>
      </div>

      <div className="right">
        <main className="main">
          <div className="container">
            <section className="wrapper">
              <div className="heading">
                <h2 className="text text-large" style={{ fontWeight: "bold" }}>
                  Xin chào!
                </h2>
                <p className="text text-normal" style={{ marginTop: "0.5rem" }}>
                  Chào mừng bạn trở lại
                </p>
                <Divider
                  variant="solid"
                  style={{
                    borderColor: "#80868b",
                  }}
                ></Divider>
              </div>
              <Form
                form={form}
                name="form-register"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Tên đăng nhập không được để trống!",
                    },
                  ]}
                  className="text text-large"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Mật khẩu không được để trống!",
                    },
                  ]}
                  className="text text-large"
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item style={{ textAlign: "center" }}>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Đăng nhập
                  </Button>
                </Form.Item>
                <Divider
                  variant="solid"
                  style={{
                    borderColor: "#80868b",
                  }}
                >
                  Hoặc
                </Divider>
                <p className="text text-normal" style={{ textAlign: "center" }}>
                  <span>
                    <Link to="/forgot-password">Bạn quên mật khẩu ư?</Link>
                  </span>
                </p>
              </Form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
