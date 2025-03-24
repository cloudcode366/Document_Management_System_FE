import React from "react";
import "./login.scss";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const onFinish = async (values) => {};

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
                  Thay đổi mật khẩu
                </h2>
                <p className="text text-normal" style={{ marginTop: "0.5rem" }}>
                  Vui lòng cung cấp các thông tin sau
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
                  label="Email"
                  name="email"
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

                <Form.Item style={{ textAlign: "center" }}>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Tiếp tục
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
                    <Link to="/login">Quay trở lại</Link>
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

export default ForgotPasswordPage;
