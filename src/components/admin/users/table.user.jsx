import { dateRangeValidate } from "@/services/helper";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { App, Avatar, Button, Popconfirm, Space, Tag } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import ImportUser from "./import.user";

const data = [
  {
    user_id: "67d28507e4cb13ef8cfe35fd",
    fullName: "I'm Admin",
    username: "admin",
    email: "admin@gmail.com",
    avatar: "",
    phone: "123456789",
    address: "Thanh pho Ho Chi Minh",
    createdAt: "2025-03-13T07:11:00.943Z",
    updatedAt: "2025-03-13T07:11:00.943Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 1, name: "Phong Cong Nghe Thong Tin" },
    position: "Nhan vien phong Cong nghe Thong tin",
    DateOfBirth: "2003-11-23",
    role: "ADMIN",
    subRole: "",
    signature: [{ certificate_id: "", issued_by: "", signature_image_url: "" }],
  },
  {
    user_id: "67d28507e4cb13ef8cfe36aa",
    fullName: "Nguyen Van A",
    username: "nguyenvana",
    email: "nguyenvana@gmail.com",
    avatar: "",
    phone: "0987654321",
    address: "Ha Noi",
    createdAt: "2025-02-20T09:30:15.543Z",
    updatedAt: "2025-02-20T09:30:15.543Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 2, name: "Phong Hanh Chinh" },
    position: "Chuyen vien hanh chinh",
    DateOfBirth: "1995-07-15",
    role: "SPECIALIST",
    subRole: "HR",
    signature: [
      {
        certificate_id: "12345",
        issued_by: "Bo Giao Duc",
        signature_image_url: "https://example.com/signature1.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe37bb",
    fullName: "Tran Thi B",
    username: "tranthib",
    email: "tranthib@gmail.com",
    avatar: "",
    phone: "0912345678",
    address: "Da Nang",
    createdAt: "2025-01-05T12:45:30.123Z",
    updatedAt: "2025-01-05T12:45:30.123Z",
    gender: "NU",
    is_enabled: true,
    division: { division_id: 3, name: "Phong Ke Toan" },
    position: "Ke toan vien",
    DateOfBirth: "1990-03-10",
    role: "DIVISION HEAD",
    subRole: "",
    signature: [
      {
        certificate_id: "67890",
        issued_by: "Bo Tai Chinh",
        signature_image_url: "https://example.com/signature2.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe38cc",
    fullName: "Le Van C",
    username: "levanc",
    email: "levanc@gmail.com",
    avatar: "",
    phone: "0905123456",
    address: "Can Tho",
    createdAt: "2025-04-01T08:20:50.678Z",
    updatedAt: "2025-04-01T08:20:50.678Z",
    gender: "NAM",
    is_enabled: false,
    division: { division_id: 4, name: "Phong Dao Tao" },
    position: "Giang vien",
    DateOfBirth: "1985-06-25",
    role: "LEADER",
    subRole: "Truong phong",
    signature: [],
  },
  {
    user_id: "67d28507e4cb13ef8cfe39dd",
    fullName: "Pham Minh D",
    username: "phamminhd",
    email: "phamminhd@gmail.com",
    avatar: "",
    phone: "0966543210",
    address: "Hai Phong",
    createdAt: "2025-03-15T14:10:05.321Z",
    updatedAt: "2025-03-15T14:10:05.321Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 5, name: "Phong Van Thu" },
    position: "Nhan vien van thu",
    DateOfBirth: "1998-09-30",
    role: "CLERICAL ASSISTANT",
    subRole: "",
    signature: [
      {
        certificate_id: "54321",
        issued_by: "So GDDT",
        signature_image_url: "https://example.com/signature3.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe40ee",
    fullName: "Hoang Thi E",
    username: "hoangthie",
    email: "hoangthie@gmail.com",
    avatar: "",
    phone: "0978123456",
    address: "Binh Duong",
    createdAt: "2025-02-28T10:05:45.678Z",
    updatedAt: "2025-02-28T10:05:45.678Z",
    gender: "NU",
    is_enabled: true,
    division: { division_id: 6, name: "Phong Quan Ly Hoc Sinh" },
    position: "Chuyen vien quan ly hoc sinh",
    DateOfBirth: "1993-12-05",
    role: "SPECIALIST",
    subRole: "QLHS",
    signature: [
      {
        certificate_id: "11111",
        issued_by: "So GDDT",
        signature_image_url: "https://example.com/signature4.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe41ff",
    fullName: "Nguyen Van F",
    username: "nguyenvanf",
    email: "nguyenvanf@gmail.com",
    avatar: "",
    phone: "0987987654",
    address: "Hue",
    createdAt: "2025-01-10T15:30:25.432Z",
    updatedAt: "2025-01-10T15:30:25.432Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 7, name: "Phong Khoa Hoc & Cong Nghe" },
    position: "Pho phong KHCN",
    DateOfBirth: "1988-04-22",
    role: "DIVISION HEAD",
    subRole: "",
    signature: [
      {
        certificate_id: "22222",
        issued_by: "Bo KHCN",
        signature_image_url: "https://example.com/signature5.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe42aa",
    fullName: "Tran Minh G",
    username: "tranminhg",
    email: "tranminhg@gmail.com",
    avatar: "",
    phone: "0911122233",
    address: "Dong Nai",
    createdAt: "2025-03-05T08:20:30.987Z",
    updatedAt: "2025-03-05T08:20:30.987Z",
    gender: "NAM",
    is_enabled: false,
    division: { division_id: 8, name: "Phong To Chuc Nhan Su" },
    position: "Nhan vien to chuc nhan su",
    DateOfBirth: "1996-06-18",
    role: "CHIEF",
    subRole: "",
    signature: [],
  },
  {
    user_id: "67d28507e4cb13ef8cfe43bb",
    fullName: "Le Thi H",
    username: "lethih",
    email: "lethih@gmail.com",
    avatar: "",
    phone: "0903344556",
    address: "Khanh Hoa",
    createdAt: "2025-02-18T12:50:40.654Z",
    updatedAt: "2025-02-18T12:50:40.654Z",
    gender: "NU",
    is_enabled: true,
    division: { division_id: 9, name: "Phong Phap Che" },
    position: "Chuyen vien phap che",
    DateOfBirth: "1991-09-12",
    role: "SPECIALIST",
    subRole: "Law",
    signature: [
      {
        certificate_id: "33333",
        issued_by: "Bo Tu Phap",
        signature_image_url: "https://example.com/signature6.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe44cc",
    fullName: "Pham Van I",
    username: "phamvani",
    email: "phamvani@gmail.com",
    avatar: "",
    phone: "0966778899",
    address: "Hai Duong",
    createdAt: "2025-03-22T17:40:55.789Z",
    updatedAt: "2025-03-22T17:40:55.789Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 10, name: "Phong Dao Tao & Kiem Dinh Chat Luong" },
    position: "Pho phong Dao Tao",
    DateOfBirth: "1987-02-28",
    role: "LEADER",
    subRole: "Truong khoa",
    signature: [
      {
        certificate_id: "44444",
        issued_by: "Bo GDDT",
        signature_image_url: "https://example.com/signature7.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe44c91",
    fullName: "Pham Van I",
    username: "phamvani",
    email: "phamvani@gmail.com",
    avatar: "",
    phone: "0966778899",
    address: "Hai Duong",
    createdAt: "2025-03-22T17:40:55.789Z",
    updatedAt: "2025-03-22T17:40:55.789Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 10, name: "Phong Dao Tao & Kiem Dinh Chat Luong" },
    position: "Pho phong Dao Tao",
    DateOfBirth: "1987-02-28",
    role: "LEADER",
    subRole: "Truong khoa",
    signature: [
      {
        certificate_id: "44444",
        issued_by: "Bo GDDT",
        signature_image_url: "https://example.com/signature7.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe44c92",
    fullName: "Pham Van I",
    username: "phamvani",
    email: "phamvani@gmail.com",
    avatar: "",
    phone: "0966778899",
    address: "Hai Duong",
    createdAt: "2025-03-22T17:40:55.789Z",
    updatedAt: "2025-03-22T17:40:55.789Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 10, name: "Phong Dao Tao & Kiem Dinh Chat Luong" },
    position: "Pho phong Dao Tao",
    DateOfBirth: "1987-02-28",
    role: "LEADER",
    subRole: "Truong khoa",
    signature: [
      {
        certificate_id: "44444",
        issued_by: "Bo GDDT",
        signature_image_url: "https://example.com/signature7.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe44c93",
    fullName: "Pham Van I",
    username: "phamvani",
    email: "phamvani@gmail.com",
    avatar: "",
    phone: "0966778899",
    address: "Hai Duong",
    createdAt: "2025-03-22T17:40:55.789Z",
    updatedAt: "2025-03-22T17:40:55.789Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 10, name: "Phong Dao Tao & Kiem Dinh Chat Luong" },
    position: "Pho phong Dao Tao",
    DateOfBirth: "1987-02-28",
    role: "LEADER",
    subRole: "Truong khoa",
    signature: [
      {
        certificate_id: "44444",
        issued_by: "Bo GDDT",
        signature_image_url: "https://example.com/signature7.png",
      },
    ],
  },
  {
    user_id: "67d28507e4cb13ef8cfe4494",
    fullName: "Pham Van I",
    username: "phamvani",
    email: "phamvani@gmail.com",
    avatar: "",
    phone: "0966778899",
    address: "Hai Duong",
    createdAt: "2025-03-22T17:40:55.789Z",
    updatedAt: "2025-03-22T17:40:55.789Z",
    gender: "NAM",
    is_enabled: true,
    division: { division_id: 10, name: "Phong Dao Tao & Kiem Dinh Chat Luong" },
    position: "Pho phong Dao Tao",
    DateOfBirth: "1987-02-28",
    role: "LEADER",
    subRole: "Truong khoa",
    signature: [
      {
        certificate_id: "44444",
        issued_by: "Bo GDDT",
        signature_image_url: "https://example.com/signature7.png",
      },
    ],
  },
];

const TableUser = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const { message, notification } = App.useApp();

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      hideInSearch: true,
      render(dom, entity) {
        return (
          <Avatar
            onClick={() => {
              setDataViewDetail(entity);
              setOpenViewDetail(true);
            }}
            style={{ cursor: "pointer" }}
          >
            {entity.avatar}
          </Avatar>
        );
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập họ và tên",
      },
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập tên đăng nhập",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập email",
      },
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      valueType: "select",
      request: async () => {
        // Call API getllRole()
        return [
          {
            label: "ADMIN",
            value: "ADMIN",
          },
          { label: "LEADER", value: "LEADER" },
          { label: "DIVISION HEAD", value: "DIVISION HEAD" },
        ];
      },
      fieldProps: {
        placeholder: "Vui lòng chọn vai trò",
        showSearch: true,
      },
    },
    {
      title: "Phòng ban",
      dataIndex: ["division", "name"],
      valueType: "select",
      request: async () => {
        // Call API getAllDivision()
        return [
          {
            label: "Phòng Công Nghệ Thông Tin",
            value: "Phong Cong Nghe Thong Tin",
          },
          { label: "Phòng Hành Chính", value: "Phong Hanh Chinh" },
          { label: "Phòng Kế Toán", value: "Phong Ke Toan" },
        ];
      },
      fieldProps: {
        placeholder: "Vui lòng chọn phòng ban",
        showSearch: true,
      },
      render: (_, entity) => entity?.division?.name || "-",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập chức vụ",
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createdAt).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_enabled",
      hideInSearch: true,
      render: (is_enabled) =>
        is_enabled ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Bị khóa</Tag>
        ),
    },
    {
      title: "Hành động",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 15 }}
              onClick={() => {
                setDataUpdate(entity);
                setOpenModalUpdate(true);
              }}
            />
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa user"
              description="Bạn có chắc chắn muốn xóa user này?"
              onConfirm={() => handleDeleteUser(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDeleteUser }}
            >
              <span style={{ cursor: "pointer", marginLeft: 20 }}>
                <DeleteTwoTone
                  twoToneColor="#ff4d4f"
                  style={{ cursor: "pointer" }}
                />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDeleteUser = async (_id) => {
    // setIsDeleteUser(true);
    // const res = await deleteUserAPI(_id);
    // if (res && res.data) {
    //   message.success(`Xóa user thành công`);
    //   refreshTable();
    // } else {
    //   notification.error({
    //     message: `Đã có lỗi xảy ra`,
    //     description: res.message,
    //   });
    // }
    // setIsDeleteUser(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#e8edfa",
        padding: "20px 0 80px",
        width: "100%",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter);

          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              query += `&email=/${params.email}/i`;
            }
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }

            const createdDateRange = dateRangeValidate(params.createdAtRange);
            if (createdDateRange) {
              query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`;
            }
          }

          // default

          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else query += `&sort=-createdAt`;
          return {
            data: data,
            page: 1,
            success: true,
            total: 10,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên {total} dòng
              </div>
            );
          },
        }}
        headerTitle="Quản lý người dùng"
        toolBarRender={() => [
          <Button
            key="buttonImport"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              setOpenModalImport(true);
            }}
          >
            Tạo người dùng theo CSV hoặc XLSX file
          </Button>,
          <Button
            key="buttonAddNew"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo người dùng theo mẫu
          </Button>,
        ]}
      />
      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default TableUser;
