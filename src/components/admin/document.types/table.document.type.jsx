import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tag, Typography } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import CreateDocumentType from "./create.document.type";

const data = [
  {
    document_type_id: "dt1",
    name: "Quyết định",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt2",
    name: "Thông báo",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt3",
    name: "Nghị quyết",
    is_deleted: true,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt4",
    name: "Chỉ thị",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt5",
    name: "Quy chế",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt6",
    name: "Quy định",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt7",
    name: "Hướng dẫn",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt8",
    name: "Kế hoạch",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt9",
    name: "Chương trình",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt10",
    name: "Đề án",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    document_type_id: "dt11",
    name: "Báo cáo",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
];

const TableDocumentType = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [isDeleteDivision, setIsDeleteDivision] = useState(false);
  const { message, notification } = App.useApp();

  const columns = [
    {
      title: "Loại văn bản",
      dataIndex: "name",
      copyable: true,
      width: "40%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên loại văn bản",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      width: "20%",
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createdAt).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      hideInSearch: true,
      width: "20%",
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
      width: "20%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title="Xác nhận khóa loại văn bản"
              description="Bạn có chắc chắn muốn khóa loại văn bản này?"
              onConfirm={() => handleDeleteDocumentType(entity._id)}
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

  const handleDeleteDocumentType = async (_id) => {
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
          <span style={{ fontWeight: "bold" }}>Quản lý loại văn bản</span>
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
            Tạo mới loại văn bản
          </Button>,
        ]}
      />
      <CreateDocumentType
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default TableDocumentType;
