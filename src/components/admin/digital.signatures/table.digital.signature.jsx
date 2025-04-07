import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import DetailDigitalSignature from "./detail.digital.signature";

const data = [
  {
    certificate_id: 1,
    name: "Chữ ký nội bộ - Hợp đồng A",
    serial_number: "SN123456789",
    issued_by: "VNPT-CA",
    valid_from: "2024-01-01T09:00:00",
    valid_to: "2026-01-01T09:00:00",
    hash_algorithm: "SHA-256",
    public_key: "ABC123XYZ...",
    is_revoked: false,
    owner_name: null,
    signature_image_url: "/signatures/nguyenvana.png",
    user_id: 101,
    fullName: "Nguyễn Văn A",
  },
  {
    certificate_id: 2,
    name: "Chữ ký nội bộ - Báo cáo Q1",
    serial_number: "SN987654321",
    issued_by: "FPT-CA",
    valid_from: "2023-06-01T08:30:00",
    valid_to: "2025-06-01T08:30:00",
    hash_algorithm: "SHA-256",
    public_key: "DEF456LMN...",
    is_revoked: false,
    owner_name: null,
    signature_image_url: "/signatures/tranthib.png",
    user_id: 102,
    fullName: "Trần Thị B",
  },
  {
    certificate_id: 3,
    name: "Chữ ký đối tác - Công ty ABC",
    serial_number: "SN000112233",
    issued_by: "Bkav-CA",
    valid_from: "2023-10-10T10:00:00",
    valid_to: "2024-10-10T10:00:00",
    hash_algorithm: "SHA-1",
    public_key: "XYZ987JKL...",
    is_revoked: false,
    owner_name: "Công ty TNHH ABC",
    signature_image_url: "/signatures/abc_company.png",
    user_id: null,
    fullName: null,
  },
  {
    certificate_id: 4,
    name: "Chữ ký đối tác - Ông X",
    serial_number: "SN4455667788",
    issued_by: "VNPT-CA",
    valid_from: "2022-02-01T09:00:00",
    valid_to: "2023-02-01T09:00:00",
    hash_algorithm: "SHA-1",
    public_key: "JKL654PQR...",
    is_revoked: true,
    owner_name: "Sở giáo dục và đào tạo",
    signature_image_url: "/signatures/ongx.png",
    user_id: null,
    fullName: null,
  },
  {
    certificate_id: 5,
    name: "Chữ ký nội bộ - Ký số test",
    serial_number: "SN1123581321",
    issued_by: "VNPT-CA",
    valid_from: "2025-01-01T00:00:00",
    valid_to: "2027-01-01T00:00:00",
    hash_algorithm: "SHA-256",
    public_key: "MNB321QWE...",
    is_revoked: false,
    owner_name: null,
    signature_image_url: "/signatures/levanc.png",
    user_id: 103,
    fullName: "Lê Văn C",
  },
];

const TableDigitalSignature = () => {
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

  const [isDeleteDigitalSignature, setIsDeleteDigitalSignature] =
    useState(false);
  const { message, notification } = App.useApp();

  const columns = [
    {
      title: "Chữ ký số",
      dataIndex: "name",
      copyable: true,
      width: "10%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên chữ ký số",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
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
      title: "Số sê-ri",
      dataIndex: "serial_number",
      copyable: true,
      hideInSearch: true,
      width: "10%",
    },
    {
      title: "Người dùng",
      dataIndex: "fullName",
      copyable: true,
      width: "15%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên người dùng",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },

    {
      title: "Đối tác",
      dataIndex: "owner_name",
      copyable: true,
      width: "15%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên đối tác",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },
    {
      title: "Được cấp bởi",
      dataIndex: "issued_by",
      hideInSearch: true,
      width: "10%",
    },

    {
      title: "Ngày bắt đầu hiệu lực",
      dataIndex: "valid_from",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      width: "10%",
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createdAt).format("DD-MM-YYYY")}</>;
      },
    },

    {
      title: "Ngày hết hiệu lực",
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
      dataIndex: "is_revoked",
      hideInSearch: true,
      width: "10%",
      render: (is_revoked) =>
        is_revoked ? (
          <Tag color="red">Bị thu hồi</Tag>
        ) : (
          <Tag color="green">Hợp lệ</Tag>
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
                // setDataUpdate(entity);
                // setOpenModalUpdate(true);
              }}
            />
            <Popconfirm
              placement="leftTop"
              title="Xác nhận khóa chữ ký số này"
              description="Bạn có chắc chắn muốn khóa chữ ký số này?"
              onConfirm={() => handleDeleteDigitalSignature(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDeleteDigitalSignature }}
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

  const handleDeleteDigitalSignature = async (_id) => {
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
          <span style={{ fontWeight: "bold" }}>Quản lý chữ ký số</span>
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
            Tạo mới chữ ký số
          </Button>,
        ]}
      />
      <DetailDigitalSignature
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default TableDigitalSignature;
