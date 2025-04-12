import React, { useEffect, useRef } from "react";
import "./login.scss";
import { App, Button, Divider, Form, Input, Steps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createForgotPasswordAPI,
  createSendOtpAPI,
  createVerifyOtpAPI,
} from "@/services/api.service";

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message, notification } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState(null);
  const [countdown, setCountdown] = useState(180);

  // Đếm ngược gửi lại OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (values) => {
    try {
      setLoading(true);
      const currentEmail = values.email;
      setEmail(currentEmail);
      const res = await createSendOtpAPI(currentEmail);
      if (res.data.statusCode === 201) {
        message.success("Đã gửi mã OTP thành công!");
        setCountdown(180);
        setCurrentStep(2);
      } else {
        throw new Error(res?.data?.content || "Gửi OTP thất bại.");
      }
    } catch (error) {
      notification.error({
        message: "Lỗi gửi mã OTP",
        description: error.message || "Vui lòng thử lại.",
      });
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = form.getFieldValue("otp");
    if (!otpCode) {
      message.warning("Vui lòng nhập mã OTP!");
      return;
    }

    setLoading(true);
    try {
      const res = await createVerifyOtpAPI(email, otpCode);
      if (res.data.statusCode === 201) {
        message.success("Xác nhận mã OTP thành công!");
        setCurrentStep(3);
      } else {
        throw new Error(res?.data?.content || "Mã OTP không hợp lệ.");
      }
    } catch (error) {
      notification.error({
        message: "Lỗi xác nhận mã OTP",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (values) => {
    const otpCode = form.getFieldValue("otp");
    if (!otpCode) {
      message.warning("Thiếu mã OTP để đổi mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const res = await createForgotPasswordAPI(
        email,
        otpCode,
        values.newPassword,
        values.confirmPassword
      );
      if (res.data.statusCode === 200) {
        message.success("Đổi mật khẩu thành công!");
        navigate("/login");
      } else {
        throw new Error(res?.data?.content || "Đổi mật khẩu thất bại.");
      }
    } catch (error) {
      notification.error({
        message: "Lỗi đổi mật khẩu",
        description: error.message,
      });
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEmail(null);
    setCurrentStep(1);
    setCountdown(0);
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
              <div className="heading" style={{ marginBottom: "2rem" }}>
                <Steps current={currentStep - 1} size="small">
                  <Steps.Step title="Nhập Email" />
                  <Steps.Step title="Nhập OTP" />
                  <Steps.Step title="Đổi mật khẩu" />
                </Steps>
              </div>

              <Form
                form={form}
                name="form-forgot-password"
                onFinish={
                  currentStep === 1
                    ? handleSendOtp
                    : currentStep === 3
                    ? changePassword
                    : () => {}
                }
                autoComplete="off"
                layout="vertical"
              >
                {/* BƯỚC 1: EMAIL */}
                {currentStep === 1 && (
                  <>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Email không được để trống!",
                        },
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Gửi mã OTP
                      </Button>
                    </Form.Item>
                  </>
                )}

                {/* BƯỚC 2: OTP */}
                {currentStep === 2 && (
                  <>
                    <Form.Item
                      label="Mã OTP"
                      name="otp"
                      rules={[
                        { required: true, message: "Vui lòng nhập mã OTP!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        onClick={verifyOtp}
                        loading={loading}
                      >
                        Xác nhận OTP
                      </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                      {countdown > 0 ? (
                        <span style={{ color: "gray" }}>
                          Gửi lại mã sau {countdown}s
                        </span>
                      ) : (
                        <Button
                          type="link"
                          onClick={() => {
                            const resendEmail =
                              email || form.getFieldValue("email");
                            if (resendEmail) {
                              handleSendOtp({ email: resendEmail });
                            } else {
                              message.warning(
                                "Không tìm thấy email để gửi lại OTP."
                              );
                            }
                          }}
                        >
                          Gửi lại mã OTP
                        </Button>
                      )}
                    </Form.Item>
                  </>
                )}

                {/* BƯỚC 3: MẬT KHẨU */}
                {currentStep === 3 && (
                  <>
                    <Form.Item
                      label="Mật khẩu mới"
                      name="newPassword"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu mới!",
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+=`~]).{8,}$/,
                          message:
                            "Mật khẩu không hợp lệ (cần chữ hoa, thường, số, ký tự đặc biệt)!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng xác nhận mật khẩu!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Mật khẩu xác nhận không khớp!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Đặt lại mật khẩu
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form>

              <Divider style={{ borderColor: "#80868b" }}>Hoặc</Divider>
              <p className="text text-normal" style={{ textAlign: "center" }}>
                <Link to="/login">Quay trở lại đăng nhập</Link>
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
