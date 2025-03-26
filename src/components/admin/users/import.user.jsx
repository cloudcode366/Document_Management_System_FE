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
} from "antd";
import { useState } from "react";
import templateFile from "assets/template/DMS_CreateUserForm.xlsx?url";
import dayjs from "dayjs";

const { Dragger } = Upload;
const { Option } = Select;

const ImportUser = (props) => {
  const { setOpenModalImport, openModalImport, refreshTable } = props;
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [userList, setUserList] = useState([]);

  const departmentOptions = [
    { id: 1, name: "Phòng Nhân sự" },
    { id: 2, name: "Phòng Kế toán" },
    { id: 3, name: "Phòng IT" },
  ];

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".csv,.xlsx",
    fileList: uploadedFile ? [uploadedFile] : [],
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        file.status = "done";
        onSuccess("ok");
        setUploadedFile(file);
        message.success(`${file.name} tải lên thành công.`);
      }, 1000);
    },
    async onChange(info) {
      if (info.file.status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    async onRemove() {
      setUploadedFile(null); // Khi xoá file, cập nhật state
    },
  };

  const handleContinue = async () => {
    if (!selectedDepartment || !uploadedFile) {
      message.error(
        "Vui lòng chọn phòng ban và tải lên file trước khi tiếp tục."
      );
      return;
    }

    const mockData = [
      {
        key: "1",
        fullName: "Nguyễn Văn A",
        username: "nguyenvana",
        email: "a@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-20T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Hieu truong",
      },
      {
        key: "2",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
      {
        key: "3",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
      {
        key: "4",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
      {
        key: "5",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
      {
        key: "6",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
      {
        key: "7",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
      {
        key: "8",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
      {
        key: "9",
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "b@gmail.com",
        phone_number: "0123456789",
        DateOfBirth: "2025-03-13T07:11:00.943Z",
        address: "Thanh pho Ho Chi Minh",
        gender: "NAM",
        position: "Chanh van phong",
      },
    ];
    setUserList(mockData);
  };

  const handleEditCell = (key, field, value) => {
    setUserList((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );

    form.setFieldsValue({
      users: userList.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleSubmit = async () => {
    setIsSubmit(true);
    try {
      // Kiểm tra xem form có lỗi không
      await form.validateFields();

      console.log("Dữ liệu gửi đi:", {
        userList,
      });
      message.success("Gửi danh sách thành công!");
      setOpenModalImport(false);
      refreshTable();
      setOpenModalImport(false);
      setUserList([]);
      setSelectedDepartment(null);
      setUploadedFile(null);
      form.resetFields();
    } catch (error) {
      message.error("Vui lòng kiểm tra lại thông tin trước khi xác nhận.");
    }
    setIsSubmit(false);
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "fullName"]}
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input
            onChange={(e) =>
              handleEditCell(record.key, "fullName", e.target.value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "username"]}
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            onChange={(e) =>
              handleEditCell(record.key, "username", e.target.value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "email"]}
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input
            onChange={(e) =>
              handleEditCell(record.key, "email", e.target.value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "phone_number"]}
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^[0-9]{10}$/, // Chỉ cho phép 10 chữ số
              message: "Số điện thoại gồm 10 chữ số!",
            },
          ]}
        >
          <Input
            maxLength={10} // Giới hạn chỉ nhập tối đa 10 ký tự
            onChange={(e) =>
              handleEditCell(record.key, "phone_number", e.target.value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "DateOfBirth",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "DateOfBirth"]}
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
        >
          <DatePicker
            format="DD-MM-YYYY"
            onChange={(date) =>
              handleEditCell(
                record.key,
                "DateOfBirth",
                date ? dayjs(date).format("YYYY-MM-DD") : null
              )
            }
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },

    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "address"]}
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input
            onChange={(e) =>
              handleEditCell(record.key, "address", e.target.value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "gender"]}
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select
            onChange={(value) => handleEditCell(record.key, "gender", value)}
            style={{ width: "100%" }}
          >
            <Select.Option value="NAM">NAM</Select.Option>
            <Select.Option value="NỮ">NỮ</Select.Option>
            <Select.Option value="KHÁC">KHÁC</Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      render: (_, record, index) => (
        <Form.Item
          name={["users", index, "position"]}
          rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
        >
          <Input
            onChange={(e) =>
              handleEditCell(record.key, "position", e.target.value)
            }
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Modal
      title="Tạo mới người dùng theo CSV hoặc XLSX file"
      width="90vw"
      open={openModalImport}
      onCancel={() => {
        setOpenModalImport(false);
        setUserList([]);
        setSelectedDepartment(null);
        setUploadedFile(null);
        form.resetFields();
      }}
      footer={
        userList?.length > 0 ? (
          <Button type="primary" loading={isSubmit} onClick={handleSubmit}>
            Xác nhận
          </Button>
        ) : (
          <Button type="primary" onClick={handleContinue}>
            Tiếp tục
          </Button>
        )
      }
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        Vui lòng chọn phòng ban
      </div>
      <Select
        placeholder="Chọn phòng ban"
        style={{ width: "100%", marginBottom: "16px" }}
        value={selectedDepartment}
        onChange={setSelectedDepartment}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {departmentOptions.map((dept) => (
          <Option key={dept.id} value={dept.id}>
            {dept.name}
          </Option>
        ))}
      </Select>

      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này</p>
        <p className="ant-upload-hint">
          Chỉ hỗ trợ .csv hoặc .xlsx &nbsp;
          <a href={templateFile} download>
            Tải file mẫu
          </a>
        </p>
      </Dragger>

      {userList?.length > 0 && (
        <Form
          form={form}
          name="form-confirm-user"
          initialValues={{ users: userList }}
        >
          <Table
            dataSource={userList}
            columns={columns}
            pagination={false}
            scroll={{ y: 400 }}
            style={{ marginTop: "20px" }}
          />
        </Form>
      )}
    </Modal>
  );
};

export default ImportUser;
