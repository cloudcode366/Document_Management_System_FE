import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Image, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import CreateInitialSignature from "./create.initial.signature";
import UpdateInitialSignature from "./update.initial.signature";

const data = [
  {
    user_id: 101,
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    signature_image_url: "/signatures/nguyenvana.png",
  },
  {
    user_id: 102,
    username: "tranthib",
    fullName: "Trần Thị B",
    signature_image_url: "/signatures/tranthib.png",
  },
  {
    user_id: 103,
    username: "levanc",
    fullName: "Lê Văn C",
    signature_image_url: "/signatures/levanc.png",
  },
  {
    user_id: 104,
    username: "phamthid",
    fullName: "Phạm Thị D",
    signature_image_url: "/signatures/phamthid.png",
  },
  {
    user_id: 105,
    username: "dangquange",
    fullName: "Đặng Quang E",
    signature_image_url: "/signatures/dangquange.png",
  },
];

const TableInitialSignature = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [isDeleteInitialSignature, setIsDeleteInitialSignature] =
    useState(false);
  const { message, notification } = App.useApp();

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      copyable: true,
      width: "25%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên người dùng",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },

    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      copyable: true,
      width: "25%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên người dùng",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },

    {
      title: "Ảnh chữ ký",
      dataIndex: "signature_image_url",
      hideInSearch: true,
      render: (text, record) => (
        <Image
          width={60}
          src={record.signature_image_url}
          alt={record.fullName}
          fallback="/images/default-signature.png"
        />
      ),
      width: "40%",
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
              title="Xác nhận khóa chữ ký số này"
              description="Bạn có chắc chắn muốn khóa chữ ký số này?"
              onConfirm={() => handleDeleteDigitalSignature(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDeleteInitialSignature }}
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

  const handleDeleteDigitalSignature = async (_id) => {};

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
          <span style={{ fontWeight: "bold" }}>Quản lý chữ ký nháy</span>
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
            Tạo mới chữ ký nháy
          </Button>,
        ]}
      />

      <CreateInitialSignature
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateInitialSignature
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default TableInitialSignature;
