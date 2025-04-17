import { InboxOutlined } from "@ant-design/icons";
import {
  App,
  Modal,
  Table,
  Upload,
  Select,
  Button,
  Input,
  Form,
  InputNumber,
  DatePicker,
  notification,
} from "antd";
import { useState } from "react";
import templateFile from "assets/template/Template.xlsx?url";
import { createImportUsersFromExcelAPI } from "@/services/api.service";

const { Dragger } = Upload;
const { Option } = Select;

const ImportUser = (props) => {
  const { setOpenModalImport, openModalImport, refreshTable, divisions } =
    props;
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".xls,.xlsx", // Hạn chế trên UI
    fileList: uploadedFile ? [uploadedFile] : [],

    customRequest({ file, onSuccess, onError }) {
      const isValid = file.name.endsWith(".xls") || file.name.endsWith(".xlsx");

      if (!isValid) {
        message.error("Chỉ chấp nhận file định dạng .xls hoặc .xlsx!");
        onError?.(new Error("Định dạng file không hợp lệ"));
        return;
      }

      // Giả lập upload thành công
      setTimeout(() => {
        file.status = "done";
        setUploadedFile(file);
        onSuccess?.("ok");
        message.success(`${file.name} tải lên thành công.`);
      }, 1000);
    },

    onChange(info) {
      if (info.file.status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },

    onRemove() {
      setUploadedFile(null);
    },
  };

  const handleSubmit = async () => {
    if (!selectedDivision) {
      message.error("Vui lòng chọn phòng ban!");
      return;
    }

    if (!uploadedFile) {
      message.error("Vui lòng tải lên file định dạng .xls hoặc .xlsx!");
      return;
    }

    setIsSubmit(true); // Vẫn giữ nút xác nhận xoay vòng khi bắt đầu xử lý

    try {
      const res = await createImportUsersFromExcelAPI(
        selectedDivision,
        uploadedFile
      );

      // Kiểm tra response từ API và thông báo kết quả
      if (res && res.data && res.data.statusCode === 201) {
        message.success("Tạo lượng lớn người dùng thành công!");
        setOpenModalImport(false);
        setSelectedDivision(null);
        setUploadedFile(null);
        refreshTable();
      } else {
        // Nếu API không trả về statusCode hợp lệ (ví dụ 400 hoặc lỗi khác)
        notification.error({
          message: "Tạo lượng lớn người dùng thất bại!",
          description: res?.data?.content || "Lỗi không xác định.",
        });
      }
    } catch (error) {
      console.error("Import lỗi:", error);

      // Xử lý thông báo lỗi nếu API trả về lỗi
      notification.error({
        message: "Tạo lượng lớn người dùng thất bại!",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Lỗi không xác định.",
      });
    } finally {
      // Đảm bảo luôn kết thúc quá trình loading
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Tạo mới người dùng theo XLS hoặc XLSX file"
      width="50vw"
      centered={true}
      bodyProps={{
        style: {
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
      open={openModalImport}
      onCancel={() => {
        setOpenModalImport(false);
        setSelectedDivision(null);
        setUploadedFile(null);
      }}
      footer={
        <Button type="primary" loading={isSubmit} onClick={handleSubmit}>
          Xác nhận
        </Button>
      }
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        Vui lòng chọn phòng ban
      </div>
      <Select
        placeholder="Chọn phòng ban"
        style={{ width: "100%", marginBottom: "16px" }}
        value={selectedDivision}
        onChange={setSelectedDivision}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {divisions.map((division) => (
          <Option key={division.divisionId} value={division.divisionId}>
            {division.divisionName}
          </Option>
        ))}
      </Select>

      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này</p>
        <p className="ant-upload-hint">
          Chỉ hỗ trợ .xls hoặc .xlsx &nbsp;
          <a onClick={(e) => e.stopPropagation()} href={templateFile} download>
            Tải file mẫu tại đây
          </a>
        </p>
      </Dragger>
    </Modal>
  );
};

export default ImportUser;
