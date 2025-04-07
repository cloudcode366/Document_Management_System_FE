import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tag, Typography } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import CreateWorkflow from "./create.workflow";
import DetailWorkflow from "./detail.workflow";

const data = [
  {
    workflow_id: "dt1",
    name: "Luồng xử lý văn bản đi (mặc định)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt2",
    name: "Luồng xử lý văn bản đến (mặc định)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt3",
    name: "Luồng xử lý văn bản nội bộ phạm vi phòng ban (mặc định)",
    is_deleted: true,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt4",
    name: "Luồng xử lý văn bản nội bộ phạm vi toàn trường (mặc định)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt5",
    name: "Luồng xử lý văn bản đi (20/03/2025)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt6",
    name: "Luồng xử lý văn bản đến (20/03/2025)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt7",
    name: "Luồng xử lý văn bản nội bộ phạm vi toàn trường (20/03/2025)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt8",
    name: "Luồng xử lý văn bản đi (25/03/2025)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt9",
    name: "Luồng xử lý văn bản đến (25/03/2025)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt10",
    name: "Luồng xử lý văn bản nội bộ phạm vi toàn trường (25/03/2025)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
  {
    workflow_id: "dt11",
    name: "Luồng xử lý văn bản nội bộ phạm vi phòng ban (25/03/2025)",
    is_deleted: false,
    createdAt: "2025-03-13T07:11:00.943Z",
  },
];

const TableWorkflow = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const [isDeleteDivision, setIsDeleteDivision] = useState(false);
  const { message, notification } = App.useApp();

  const columns = [
    {
      title: "Luồng xử lý",
      dataIndex: "name",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập tên luồng xử lý",
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 },
      },
      width: "40%",
      render(dom, entity) {
        return (
          <a
            onClick={() => {
              //   setDataViewDetail(entity);
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
              title="Xác nhận khóa luồng xử lý"
              description="Bạn có chắc chắn muốn khóa luồng xử lý này?"
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
          <span style={{ fontWeight: "bold" }}>Quản lý luồng xử lý</span>
        }
        toolBarRender={() => [
          <Button
            key="buttonAddNewWorkflow"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo mới luồng xử lý
          </Button>,
        ]}
      />
      <CreateWorkflow
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
        setDataViewDetail={setDataViewDetail}
      />
      <DetailWorkflow
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default TableWorkflow;
