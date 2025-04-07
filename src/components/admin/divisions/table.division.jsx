import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import CreateDivision from "./create.division";
import UpdateDivision from "./update.division";
import DetailDivision from "./detail.division";

const data = [
  {
    name: "Phòng lãnh đạo",
    createdAt: "2025-03-13T07:11:00.943Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe35fd",
        fullName: "Nguyen Van A",
        username: "anv1",
        email: "anv1@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe35fd",
        fullName: "Nguyen Van B",
        username: "anv1",
        email: "anv1@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe35fd",
        fullName: "Nguyen Van C",
        username: "anv1",
        email: "anv1@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe35fd",
        fullName: "Nguyen Van A",
        username: "anv1",
        email: "anv1@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
  {
    name: "Phòng đào tạo",
    createdAt: "2025-03-30T10:20:15.123Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe35fa",
        fullName: "Tran Thi B",
        username: "bttran",
        email: "bttran@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe35fb",
        fullName: "Le Van C",
        username: "clev",
        email: "clev@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
      {
        user_id: "67d28507e4cb13ef8cfe35fc",
        fullName: "Pham Thi D",
        username: "dtpham",
        email: "dtpham@gmail.com",
        avatar: "",
        role: "CLERICAL_ASSISTANT",
      },
    ],
  },
  {
    name: "Phòng tài chính",
    createdAt: "2025-03-30T10:25:00.123Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3601",
        fullName: "Nguyen Van E",
        username: "evnguyen",
        email: "evnguyen@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3602",
        fullName: "Hoang Thi F",
        username: "fthoang",
        email: "fthoang@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
  {
    name: "Phòng nhân sự",
    createdAt: "2025-03-30T11:00:45.789Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3603",
        fullName: "Tran Van G",
        username: "gtran",
        email: "gtran@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3604",
        fullName: "Le Thi H",
        username: "hle",
        email: "hle@gmail.com",
        avatar: "",
        role: "CLERICAL_ASSISTANT",
      },
    ],
  },
  {
    name: "Phòng quản trị",
    createdAt: "2025-03-30T12:15:30.567Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3605",
        fullName: "Pham Van I",
        username: "ipham",
        email: "ipham@gmail.com",
        avatar: "",
        role: "CHIEF",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3606",
        fullName: "Do Thi J",
        username: "jdo",
        email: "jdo@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
  {
    name: "Phòng công tác sinh viên",
    createdAt: "2025-03-30T13:40:15.901Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3607",
        fullName: "Nguyen Thi K",
        username: "knguyen",
        email: "knguyen@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3608",
        fullName: "Bui Van L",
        username: "lbui",
        email: "lbui@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
  {
    name: "Phòng hành chính",
    createdAt: "2025-03-30T14:10:20.312Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3609",
        fullName: "Nguyen Van M",
        username: "mnguyen",
        email: "mnguyen@gmail.com",
        avatar: "",
        role: "CHIEF",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3610",
        fullName: "Hoang Thi N",
        username: "nhoang",
        email: "nhoang@gmail.com",
        avatar: "",
        role: "CLERICAL_ASSISTANT",
      },
    ],
  },
  {
    name: "Phòng đào tạo",
    createdAt: "2025-03-30T15:05:18.678Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3611",
        fullName: "Tran Thi O",
        username: "otran",
        email: "otran@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3612",
        fullName: "Le Van P",
        username: "ple",
        email: "ple@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
  {
    name: "Phòng hợp tác quốc tế",
    createdAt: "2025-03-30T16:20:50.543Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3613",
        fullName: "Pham Thi Q",
        username: "qpham",
        email: "qpham@gmail.com",
        avatar: "",
        role: "CHIEF",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3614",
        fullName: "Do Van R",
        username: "rdo",
        email: "rdo@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
  {
    name: "Phòng công nghệ thông tin",
    createdAt: "2025-03-30T17:35:45.876Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3615",
        fullName: "Nguyen Van S",
        username: "snguyen",
        email: "snguyen@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3616",
        fullName: "Bui Thi T",
        username: "tbui",
        email: "tbui@gmail.com",
        avatar: "",
        role: "CLERICAL_ASSISTANT",
      },
    ],
  },
  {
    name: "Phòng nghiên cứu khoa học",
    createdAt: "2025-03-30T18:50:30.654Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3617",
        fullName: "Hoang Van U",
        username: "uhoang",
        email: "uhoang@gmail.com",
        avatar: "",
        role: "CHIEF",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3618",
        fullName: "Tran Thi V",
        username: "vtran",
        email: "vtran@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
  {
    name: "Phòng kiểm định chất lượng",
    createdAt: "2025-03-30T19:15:22.987Z",
    is_deleted: false,
    list_users: [
      {
        user_id: "67d28507e4cb13ef8cfe3619",
        fullName: "Nguyen Van W",
        username: "wnguyen",
        email: "wnguyen@gmail.com",
        avatar: "",
        role: "DIVISION_HEAD",
      },
      {
        user_id: "67d28507e4cb13ef8cfe3620",
        fullName: "Le Thi X",
        username: "xle",
        email: "xle@gmail.com",
        avatar: "",
        role: "SPECIALIST",
      },
    ],
  },
];

const TableDivision = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [isDeleteDivision, setIsDeleteDivision] = useState(false);
  const { message, notification } = App.useApp();

  const columns = [
    {
      title: "Phòng ban",
      dataIndex: "name",
      copyable: true,
      width: "30%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên phòng ban",
      },
      render(dom, entity) {
        return (
          <a
            onClick={() => {
              setDataViewDetail(entity);
              setOpenViewDetail(true);
            }}
            style={{ cursor: "pointer" }}
          >
            {entity.name}
          </a>
        );
      },
    },
    {
      title: "Lãnh đạo",
      dataIndex: "list_users",
      hideInSearch: true,
      width: "40%",
      render: (list_users) => {
        const leaders = list_users
          .filter((user) => user.role === "DIVISION_HEAD")
          .map((user) => user.fullName)
          .join(", ");

        return leaders || "Chưa có lãnh đạo";
      },
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      width: "10%",
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createdAt).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      hideInSearch: true,
      width: "10%",
      render: (is_deleted) =>
        is_deleted ? (
          <Tag color="red">Bị khóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      hideInSearch: true,
      width: "10%",
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
              title="Xác nhận khóa phòng ban"
              description="Bạn có chắc chắn muốn khóa phòng ban này?"
              onConfirm={() => handleDeleteDivision(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDeleteDivision }}
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

  const handleDeleteDivision = async (_id) => {
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
        alignItems: "flex-end",
        backgroundColor: "#e8edfa",
        padding: "20px 0",
        width: "100%",
        height: "100vh",
      }}
    >
      <ProTable
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        scroll={{ y: "calc(100vh - 350px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter);

          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.name) {
              query += `&name=/${params.name}/i`;
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
        headerTitle={
          <span style={{ fontWeight: "bold" }}>Quản lý phòng ban</span>
        }
        toolBarRender={() => [
          <Button
            key="buttonAddNew"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo mới phòng ban
          </Button>,
        ]}
      />
      <CreateDivision
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateDivision
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={refreshTable}
      />
      <DetailDivision
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default TableDivision;
