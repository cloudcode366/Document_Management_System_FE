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
import {
  createImportUsersFromExcelAPI,
  viewUsersFromExcelAPI,
} from "@/services/api.service";
import { update } from "lodash";

const { Dragger } = Upload;
const { Option } = Select;

const ImportUser = ({
  setOpenModalImport,
  openModalImport,
  refreshTable,
  divisions,
}) => {
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [usersFromExcel, setUsersFromExcel] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [step, setStep] = useState(1);

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".csv,.xls,.xlsx",
    fileList: uploadedFile ? [uploadedFile] : [],
    customRequest({ file, onSuccess, onError }) {
      const isValid =
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".xlsx");
      if (!isValid) {
        message.error("Chỉ chấp nhận file định dạng .csv, .xls hoặc .xlsx!");
        onError?.(new Error("Định dạng file không hợp lệ"));
        return;
      }

      setTimeout(() => {
        file.status = "done";
        setUploadedFile(file);
        onSuccess?.("ok");
        message.success(`${file.name} tải lên thành công.`);
      }, 1000);
    },
    onRemove() {
      setUploadedFile(null);
    },
  };

  const handlePreview = async () => {
    if (!selectedDivision) {
      message.error("Vui lòng chọn phòng ban!");
      return;
    }

    if (!uploadedFile) {
      message.error("Vui lòng tải lên file định dạng .xls hoặc .xlsx!");
      return;
    }

    setIsSubmit(true);

    try {
      const res = await viewUsersFromExcelAPI(uploadedFile);

      if (res && res.data) {
        setUsersFromExcel(res.data);
        setStep(2);
      } else {
        notification.error({
          message: "Lỗi đọc file",
          description: "Không thể đọc dữ liệu từ file.",
        });
      }
    } catch (error) {
      console.error("Lỗi preview:", error);
      notification.error({
        message: "Lỗi khi xử lý file",
        description: error?.message || "Lỗi không xác định.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmit(true);
    try {
      const payload = usersFromExcel.map((user) => ({
        ...user,
      }));
      const res = await createImportUsersFromExcelAPI(
        selectedDivision,
        payload
      );
      if (res?.data?.statusCode === 201) {
        message.success("Tạo người dùng thành công!");
        handleClose();
        refreshTable();
      } else {
        throw new Error(res?.data?.message || "Lỗi không xác định");
      }
    } catch (err) {
      notification.error({
        message: "Import thất bại",
        description: err?.message,
      });
    }
    setIsSubmit(false);
  };

  const validateRow = (row, index) => {
    const errors = {};

    if (!row.fullName?.trim()) errors.fullName = "Họ tên không được bỏ trống";
    if (!row.userName?.trim())
      errors.userName = "Tên đăng nhập không được bỏ trống";
    if (!row.email?.trim() || !/\S+@\S+\.\S+/.test(row.email))
      errors.email = "Email không hợp lệ";
    if (!row.phoneNumber?.trim() || !/^[0-9]{9,11}$/.test(row.phoneNumber))
      errors.phoneNumber = "SĐT không hợp lệ";
    if (!row.identityCard?.trim())
      errors.identityCard = "Căn cước công dân không được bỏ trống";
    if (!row.address?.trim()) errors.address = "Địa chỉ không được bỏ trống";
    if (!row.gender?.trim()) errors.gender = "Giới tính không được bỏ trống";
    if (!row.position?.trim()) errors.position = "Chức vụ không được bỏ trống";
    if (!row.roleName?.trim()) errors.roleName = "Vai trò không được bỏ trống";

    const newValidationErrors = { ...validationErrors, [index]: errors };
    if (Object.keys(errors).length === 0) {
      delete newValidationErrors[index]; // Không còn lỗi
    }
    setValidationErrors(newValidationErrors);
  };

  const hasValidationErrors = () => {
    return Object.keys(validationErrors).length > 0;
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      render: (_, record, index) => (
        <div>
          <Input
            value={record.fullName}
            onChange={(e) => updateUserField(index, "fullName", e.target.value)}
          />
          {validationErrors[index]?.fullName && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].fullName}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      render: (_, record, index) => (
        <div>
          <Input
            value={record.userName}
            onChange={(e) => updateUserField(index, "userName", e.target.value)}
          />
          {validationErrors[index]?.userName && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].userName}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_, record, index) => (
        <div>
          <Input
            value={record.email}
            onChange={(e) => updateUserField(index, "email", e.target.value)}
            status={validationErrors[index]?.email ? "error" : ""}
          />
          {validationErrors[index]?.email && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].email}
            </div>
          )}
        </div>
      ),
    },

    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      render: (_, record, index) => (
        <div>
          <Input
            value={record.phoneNumber}
            onChange={(e) =>
              updateUserField(index, "phoneNumber", e.target.value)
            }
          />
          {validationErrors[index]?.phoneNumber && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].phoneNumber}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "CCCD",
      dataIndex: "identityCard",
      render: (_, record, index) => (
        <div>
          <Input
            value={record.identityCard}
            onChange={(e) =>
              updateUserField(index, "identityCard", e.target.value)
            }
          />
          {validationErrors[index]?.identityCard && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].identityCard}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (_, record, index) => (
        <div>
          <Input
            value={record.address}
            onChange={(e) => updateUserField(index, "address", e.target.value)}
          />
          {validationErrors[index]?.address && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].address}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (text, record, index) => (
        <div>
          <Select
            value={text}
            onChange={(value) => updateUserField(index, "gender", value)}
            style={{ width: "100%" }}
          >
            <Option key="MALE" value="MALE">
              Nam
            </Option>
            <Option key="FEMALE" value="FEMALE">
              Nữ
            </Option>
          </Select>
          {validationErrors[index]?.gender && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].gender}
            </div>
          )}
        </div>
      ),
    },

    {
      title: "Chức vụ",
      dataIndex: "position",
      render: (_, record, index) => (
        <div>
          <Input
            value={record.position}
            onChange={(e) => updateUserField(index, "position", e.target.value)}
          />
          {validationErrors[index]?.position && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].position}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      render: (text, record, index) => (
        <div>
          <Select
            value={text}
            onChange={(value) => updateUserField(index, "roleName", value)}
            style={{ width: "100%" }}
          >
            <Option key="Leader" value="Leader">
              Lãnh đạo trường
            </Option>
            <Option key="Division Head" value="Division Head">
              Lãnh đạo phòng ban
            </Option>
            <Option key="Chief" value="Chief">
              Chánh văn phòng
            </Option>
            <Option key="Specialist" value="Specialist">
              Chuyên viên
            </Option>
            <Option key="Clerical Assistant" value="Clerical Assistant">
              Nhân viên văn thư
            </Option>
          </Select>
          {validationErrors[index]?.roleName && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {validationErrors[index].roleName}
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleClose = () => {
    setOpenModalImport(false);
    setUsersFromExcel([]);
    setUploadedFile(null);
    setSelectedDivision(null);
    setStep(1);
  };

  const updateUserField = (index, field, value) => {
    const updatedUsers = [...usersFromExcel];
    updatedUsers[index] = {
      ...updatedUsers[index],
      [field]: value,
    };
    setUsersFromExcel(updatedUsers);
    validateRow(updatedUsers[index], index);
  };

  return (
    <Modal
      title={
        <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
          Import người dùng bằng file
        </div>
      }
      open={openModalImport}
      width="80vw"
      centered
      onCancel={handleClose}
      footer={
        usersFromExcel.length > 0 ? (
          <Button
            type="primary"
            onClick={handleFinalSubmit}
            disabled={hasValidationErrors() || usersFromExcel.length === 0}
            loading={isSubmit}
          >
            Xác nhận tạo
          </Button>
        ) : (
          <Button type="primary" loading={isSubmit} onClick={handlePreview}>
            Tiếp tục
          </Button>
        )
      }
    >
      {step === 1 ? (
        <>
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
            <p className="ant-upload-text">
              Nhấp hoặc kéo file vào khu vực này
            </p>
            <p className="ant-upload-hint">
              Chỉ hỗ trợ .csv, .xls hoặc .xlsx &nbsp;
              <a
                onClick={(e) => e.stopPropagation()}
                href={templateFile}
                download
              >
                Tải file mẫu tại đây
              </a>
            </p>
          </Dragger>
        </>
      ) : (
        <>
          {usersFromExcel.length > 0 && (
            <Table
              dataSource={usersFromExcel}
              columns={columns}
              rowKey={(_, index) => index}
              pagination={false}
              style={{ marginTop: "24px" }}
              scroll={{ x: "max-content", y: 400 }}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default ImportUser;
