import React, { useEffect, useRef, useState } from "react";
import "./login.scss";
import { App, Button, Divider, Form, Input, Steps } from "antd";
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
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  // Tạo ref cho 6 ô input để điều khiển focus
  const inputRefs = useRef([]);

  // Đếm ngược gửi lại OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Xử lý khi người dùng nhập OTP
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      // Chỉ cho phép nhập số, tối đa 1 ký tự
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Tự động chuyển focus sang ô tiếp theo nếu nhập số
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Xử lý khi người dùng xóa hoặc nhấn phím điều hướng
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // Nếu xóa và ô hiện tại trống, chuyển focus về ô trước đó
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Chuyển focus về ô trước đó
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Chuyển focus sang ô tiếp theo
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split("").slice(0, 6);
      setOtpValues(newOtpValues);
      inputRefs.current[5].focus();
    }
  };

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
    // Ghép 6 số OTP thành một chuỗi
    const otpCode = otpValues.join("");
    if (otpCode.length !== 6) {
      message.warning("Vui lòng nhập đủ 6 số OTP!");
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
    const otpCode = otpValues.join(""); // Lấy OTP từ state
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
    setOtpValues(["", "", "", "", "", ""]); // Reset OTP
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      {otpValues.map((value, index) => (
                        <Input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          value={value}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : null}
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "20px",
                            textAlign: "center",
                            borderRadius: "4px",
                          }}
                          maxLength={1}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      ))}
                    </div>

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
