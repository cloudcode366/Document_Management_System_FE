import { useCurrentApp } from "@/components/context/app.context";
import {
  createHandleTaskActionAPI,
  createSignatureDigitalAPI,
  createSignInSignatureDigitalAPI,
} from "@/services/api.service";
import { Form, Modal, Input, Row, Col, Button, message, App } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginESignModal = (props) => {
  const {
    openLoginESignModal,
    setOpenLoginESignModal,
    resultSignaturePosition,
    setResultSignaturePosition,
    documentId,
    taskId,
  } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const [loginInfo, setLoginInfo] = useState({});
  const [counter, setCounter] = useState(180);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { user } = useCurrentApp();
  const { notification, message } = App.useApp();

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  const handleLogin = async (values) => {
    setIsSubmit(true);
    try {
      const res = await createSignInSignatureDigitalAPI(
        values.userName,
        values.password
      );
      if (res?.data?.statusCode === 200) {
        message.success("Xác thực tài khoản thành công! Đã gửi OTP tới email.");
        setLoginInfo({ userName: values.userName, password: values.password });
        setToken(res.data.content);
        setCurrentStep(2);
        setCounter(180); // Bắt đầu đếm ngược 60s
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: `${res?.data?.content} Vui lòng kiểm tra lại tên đăng nhập và mật khẩu!`,
        });
      }
    } catch (error) {
      message.error(
        error?.response?.data ||
          error?.message ||
          "Tài khoản hoặc mật khẩu không đúng!"
      );
    } finally {
      setIsSubmit(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");
    if (otpCode.length !== 6) {
      message.error("Vui lòng nhập đủ 6 chữ số OTP.");
      return;
    }

    setIsSubmit(true);
    try {
      const res = await createSignatureDigitalAPI(
        otpCode,
        token,
        resultSignaturePosition.llx,
        resultSignaturePosition.lly,
        resultSignaturePosition.urx,
        resultSignaturePosition.ury,
        resultSignaturePosition.page,
        documentId
      );
      if (res.data.statusCode === 201) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        message.success("Xác thực OTP và thực hiện ký điện tử thành công!");
        const res = await createHandleTaskActionAPI(
          taskId,
          user.userId,
          "SubmitDocument"
        );
        if (res?.data?.statusCode === 200) {
          notification.success({
            message: "Nhiệm vụ ký văn bản thành công!",
            description: "Văn bản đã được ký thành công.",
          });
          navigate(`/detail-document/${documentId}`);
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description: res?.data?.content,
          });
        }
        navigate(`/detail-document/${documentId}`);
        setOpenLoginESignModal(false);
        setResultSignaturePosition(false);
        form.resetFields();
        setCurrentStep(1);
        setOtpValues(["", "", "", "", "", ""]);
        setLoginInfo({});
        setCounter(0);
      } else {
        let msgError = "";
        if (res?.data?.content === "OTP not found") {
          msgError += "Mã OTP không hợp lệ! Vui lòng kiểm tra lại mã OTP!";
        }
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: msgError,
        });
      }
    } catch (error) {
      message.error(
        error?.response?.data?.content ||
          error?.message ||
          "Xác thực OTP thất bại!"
      );
    } finally {
      setIsSubmit(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Tự động chuyển focus sang ô tiếp theo
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split("").slice(0, 6);
      setOtpValues(newOtpValues);
      otpInputs.current[5].focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      // await resendOtpAPI(loginInfo.userName);
      const res = await createSignInSignatureDigitalAPI(
        loginInfo.userName,
        loginInfo.password
      );
      if (res?.data?.statusCode === 200) {
        message.success("Xác thực tài khoản thành công! Đã gửi OTP tới email.");
        setToken(res.data.content);
        setCurrentStep(2);
        setCounter(180);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: `${res?.data?.content} Vui lòng kiểm tra lại tên đăng nhập và mật khẩu!`,
        });
      }
    } catch (error) {
      message.error(
        error?.response?.data || error?.message || "Gửi lại OTP thất bại!"
      );
    }
  };

  return (
    <Modal
      title={
        <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
          Đăng nhập tài khoản chữ ký điện tử
        </div>
      }
      width={"40vw"}
      open={openLoginESignModal}
      onOk={() => {
        if (currentStep === 1) {
          form.submit();
        } else {
          handleVerifyOtp();
        }
      }}
      onCancel={() => {
        setOpenLoginESignModal(false);
        setResultSignaturePosition(false);
        form.resetFields();
        setCurrentStep(1);
        setOtpValues(["", "", "", "", "", ""]);
        setLoginInfo({});
        setCounter(0);
      }}
      okText={currentStep === 1 ? "Đăng nhập" : "Xác thực"}
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      {currentStep === 1 ? (
        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="userName"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
        </Form>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p>Nhập mã OTP đã gửi tới email của bạn</p>
          <Row justify="center" gutter={8}>
            {otpValues.map((value, index) => (
              <Col key={index}>
                <Input
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : null}
                  ref={(el) => (otpInputs.current[index] = el)}
                  maxLength={1}
                  style={{
                    width: 40,
                    height: 40,
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                />
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 16 }}>
            {counter > 0 ? (
              <p style={{ color: "#999" }}>Gửi lại OTP sau {counter}s</p>
            ) : (
              <Button type="link" onClick={handleResendOtp}>
                Gửi lại OTP
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default LoginESignModal;
