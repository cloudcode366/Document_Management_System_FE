import React, { useState } from "react";
import { Typography, Space, Input, Button, Row, Col, Form } from "antd";
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons"; // Icon nhận mã mới
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ChangePasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Hàm xử lý thay đổi mã OTP
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Hàm xử lý tiếp tục bước 1 (kiểm tra OTP)
  const handleContinue = () => {
    if (currentStep === 1 && otp) {
      // Xử lý kiểm tra mã OTP (ví dụ: kiểm tra OTP đúng)
      setCurrentStep(2); // Chuyển sang bước 2 (đổi mật khẩu)
    }
  };

  // Hàm xử lý thay đổi mật khẩu
  const handleChangePassword = (values) => {
    console.log("Mới mật khẩu:", values);
    // Xử lý đổi mật khẩu
    console.log("Đổi mật khẩu thành công");
    // Có thể thực hiện thêm hành động lưu mật khẩu hoặc điều hướng trang
  };

  // Hàm đóng trang và quay lại trang profile
  const onClose = () => {
    setOtp(""); // Xóa mã OTP
    setCurrentStep(1); // Reset về bước 1
    navigate("/admin/profile"); // Quay về trang profile
  };

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Title level={2}>
            {currentStep === 1 ? "Kiểm tra email của bạn" : "Đổi mật khẩu"}
          </Title>
          <CloseOutlined style={{ fontSize: "25px" }} onClick={onClose} />
        </div>

        {/* Bước 1: Nhập mã OTP */}
        {currentStep === 1 && (
          <>
            <h3>Hãy nhập mã mà chúng tôi đã gửi đến admin@gmail.com</h3>

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
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Nhập mã OTP"
                    style={{
                      fontSize: "16px",
                      border: "1px solid",
                    }}
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
                    onClick={() => {
                      // Xử lý nhận mã mới
                      console.log("Mã mới đã được gửi.");
                    }}
                  >
                    Nhận mã mới
                  </Button>
                </Col>
              </Row>
            </div>

            <Button
              type="primary"
              block
              onClick={handleContinue}
              style={{ marginBottom: "40px" }}
            >
              Tiếp tục
            </Button>
          </>
        )}

        {/* Bước 2: Đổi mật khẩu */}
        {currentStep === 2 && (
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
                onFinish={handleChangePassword}
                style={{ width: "100%" }}
                name="changePasswordForm"
                layout="vertical"
                autoComplete="off"
              >
                <Row gutter={16} style={{ width: "100%" }}>
                  <Col span={24}>
                    <Form.Item
                      name="currentPassword"
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
                            "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, số và các ký tự đặc biệt.",
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
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
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
