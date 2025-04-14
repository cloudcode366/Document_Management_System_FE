import React, { useCallback, useEffect, useRef, useState } from "react";
import { Typography, Space, Input, Button, Row, Col, Form, App } from "antd";
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons"; // Icon nhận mã mới
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import {
  createChangePasswordAPI,
  createSendOtpAPI,
  createVerifyOtpAPI,
} from "@/services/api.service";
import { BeatLoader } from "react-spinners";
import "styles/loading.scss";

const { Title } = Typography;

const ChangePasswordPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  const { user } = useCurrentApp();
  const otpSentRef = useRef(false); // Đánh dấu không gửi mã OTP 2 lần khi lần đầu vào change password

  const [currentStep, setCurrentStep] = useState(1);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const [countdown, setCountdown] = useState(180);

  // Gửi OTP lần đầu
  useEffect(() => {
    if (!otpSentRef.current) {
      sendOtp(); // Gọi API gửi mã OTP
      otpSentRef.current = true; // Đánh dấu đã gửi để không gửi lại
    }
  }, []);

  // Đếm ngược
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOtp = useCallback(async () => {
    try {
      setLoading(true);
      const res = await createSendOtpAPI(user?.email);
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
      onClose();
    } finally {
      setLoading(false);
      setFirstLoading(false);
    }
  }, [user?.email]);

  const verifyOtp = async () => {
    if (!otpCode) return;
    setLoading(true);
    try {
      const res = await createVerifyOtpAPI(user.email, otpCode);
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
    if (!otpCode) return;
    setLoading(true);
    try {
      const res = await createChangePasswordAPI(
        user.email,
        otpCode,
        values.oldPassword,
        values.newPassword,
        values.confirmPassword
      );
      if (res.data.statusCode === 200) {
        message.success("Đổi mật khẩu thành công!");
        navigate(
          user.mainRole.roleName === "Admin" ? "/admin/profile" : "/profile"
        );
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
      setOtpCode("");
      setCurrentStep(1);
    }
  };

  const onClose = () => {
    setOtpCode("");
    setCurrentStep(1);
    navigate(
      user.mainRole.roleName === "Admin" ? "/admin/profile" : "/profile"
    );
  };

  if (firstLoading) {
    return (
      <div
        className="full-screen-overlay"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <BeatLoader size={25} color="#364AD6" />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          padding: 32,
          width: "50vw",
          margin: "40px auto",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Title level={2}>
            {currentStep === 2
              ? "Kiểm tra email của bạn"
              : currentStep === 3
              ? "Đổi mật khẩu"
              : ""}
          </Title>
          <CloseOutlined style={{ fontSize: "25px" }} onClick={onClose} />
        </div>

        {/* Bước 2: Nhập mã OTP */}
        {currentStep === 2 && (
          <>
            <h3>Hãy nhập mã mà chúng tôi đã gửi đến {user.email}</h3>

            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Row gutter={16} style={{ width: "100%" }}>
                <Col span={24}>
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Nhập mã OTP"
                    style={{ fontSize: 16, border: "1px solid" }}
                  />
                </Col>
                <Col span={24} style={{ marginTop: "10px" }}>
                  <Button
                    icon={<ReloadOutlined />}
                    type="link"
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      paddingLeft: "0",
                      textAlign: "left",
                    }}
                    onClick={sendOtp}
                    loading={loading}
                    disabled={countdown > 0}
                  >
                    {countdown > 0
                      ? `Gửi lại sau ${countdown}s`
                      : "Nhận mã mới"}
                  </Button>
                </Col>
              </Row>
            </div>

            <Button
              type="primary"
              block
              onClick={verifyOtp}
              style={{ marginBottom: "40px" }}
              loading={loading}
            >
              Tiếp tục
            </Button>
          </>
        )}

        {/* Bước 3: Đổi mật khẩu */}
        {currentStep === 3 && (
          <>
            <h3>
              Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết
              thường, số và các ký tự đặc biệt bao gồm !, @, #, $, %, ^, &, *, (
              ), -, +, `, ~
            </h3>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Form
                form={form}
                onFinish={changePassword}
                style={{ width: "100%" }}
                name="changePasswordForm"
                layout="vertical"
                autoComplete="off"
              >
                <Row gutter={16} style={{ width: "100%" }}>
                  <Col span={24}>
                    <Form.Item
                      name="oldPassword"
                      label="Mật khẩu hiện tại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu hiện tại!",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Mật khẩu hiện tại"
                        style={{
                          fontSize: "16px",
                          border: "1px solid",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} style={{ marginTop: "10px" }}>
                    <Form.Item
                      name="newPassword"
                      label="Mật khẩu mới"
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
                      <Input.Password
                        placeholder="Mật khẩu mới"
                        style={{
                          fontSize: "16px",
                          border: "1px solid",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} style={{ marginTop: "10px" }}>
                    <Form.Item
                      name="confirmPassword"
                      label="Nhập lại mật khẩu mới"
                      dependencies={["newPassword"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập lại mật khẩu mới!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            return !value ||
                              getFieldValue("newPassword") === value
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("Mật khẩu không khớp!")
                                );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Nhập lại mật khẩu mới"
                        style={{
                          fontSize: "16px",
                          border: "1px solid",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Button Đổi mật khẩu */}
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  style={{ marginTop: "20px" }}
                  loading={loading}
                >
                  Đổi mật khẩu
                </Button>
              </Form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordPage;
