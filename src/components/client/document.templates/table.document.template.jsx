import { dateRangeValidate } from "@/services/helper";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { App, Avatar, Button, Modal, Popconfirm, Space, Tag } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import templatePDF from "assets/files/template.pdf";

const data = [
  {
    id: "template1",
    name: "Mẫu quyết định khen thưởng",
    document_type: "Quyết định",
    workflow: "Văn bản toàn trường",
    created_at: "2025-03-13T07:11:00.943Z",
    created_by: "Lê Phan Hoài Nam",
  },
  {
    id: "template2",
    name: "Mẫu công văn thông báo lịch họp",
    document_type: "Thông báo",
    workflow: "Văn bản đi",
    created_at: "2025-03-14T07:11:00.943Z",
    created_by: "Ngô Huỳnh Tấn Lộc",
  },
  {
    id: "template3",
    name: "Mẫu biên bản họp phòng ban",
    document_type: "Biên bản",
    workflow: "Văn bản phòng ban",
    created_at: "2025-02-10T07:11:00.943Z",
    created_by: "Hà Công Hiếu",
  },
  {
    id: "template4",
    name: "Mẫu quy chế nội bộ",
    document_type: "Quy chế",
    workflow: "Văn bản toàn trường",
    created_at: "2025-04-01T07:11:00.943Z",
    created_by: "Tạ Gia Nhật Minh",
  },
  {
    id: "template5",
    name: "Mẫu chỉ thị từ Ban Giám hiệu",
    document_type: "Chỉ thị",
    workflow: "Văn bản đi",
    created_at: "2025-03-03T07:11:00.943Z",
    created_by: "Lê Phan Hoài Nam",
  },
];
const TableDocumentTemplate = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const columns = [
    {
      title: "Tên mẫu văn bản",
      dataIndex: "name",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập tên mẫu văn bản",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
      render(dom, entity) {
        return (
          <a
            onClick={() => {
              setOpenPreview(true);
              setSelectedTemplate(entity);
            }}
            style={{ cursor: "pointer" }}
          >
            {entity.name}
          </a>
        );
      },
      width: "30%",
    },
    {
      title: "Loại văn bản",
      dataIndex: "document_type",
      valueType: "select",
      request: async () => {
        // Call API getllRole()
        return [
          {
            label: "Quyết định",
            value: "qđ",
          },
          { label: "Chỉ thị", value: "ct" },
          { label: "Quy chế", value: "qc" },
          { label: "Quy định", value: "qd" },
          { label: "Thông báo", value: "tb" },
          { label: "Báo cáo", value: "bc" },
        ];
      },
      fieldProps: {
        placeholder: "Vui lòng chọn loại văn bản",
        showSearch: true,
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
      width: "15%",
    },

    {
      title: "Luồng xử lý",
      dataIndex: "workflow",
      valueType: "select",
      request: async () => {
        // Call API getllRole()
        return [
          { label: "Văn bản đến", value: "incoming" },
          { label: "Văn bản đi", value: "outgoing" },
          { label: "Văn bản phòng ban", value: "division" },
          { label: "Văn bản toàn trường", value: "school" },
        ];
      },
      fieldProps: {
        placeholder: "Vui lòng chọn luồng xử lý",
        showSearch: true,
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
      width: "15%",
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
      width: "15%",
    },

    {
      title: "Người tạo",
      dataIndex: "created_by",
      hideInSearch: true,
    },

    // {
    //   title: "Hành động",
    //   hideInSearch: true,
    //   width: "10%",
    //   render(dom, entity, index, action, schema) {
    //     return (
    //       <>
    //         <EditTwoTone
    //           twoToneColor="#f57800"
    //           style={{ cursor: "pointer", marginRight: 15 }}
    //           onClick={() => {
    //             setDataUpdate(entity);
    //             setOpenModalUpdate(true);
    //           }}
    //         />
    //         <Popconfirm
    //           placement="leftTop"
    //           title="Xác nhận khóa người dùng"
    //           description="Bạn có chắc chắn muốn khóa người dùng này?"
    //           onConfirm={() => handleDeleteUser(entity._id)}
    //           okText="Xác nhận"
    //           cancelText="Hủy"
    //           okButtonProps={{ loading: isDeleteUser }}
    //         >
    //           <span style={{ cursor: "pointer", marginLeft: 20 }}>
    //             <DeleteTwoTone
    //               twoToneColor="#ff4d4f"
    //               style={{ cursor: "pointer" }}
    //             />
    //           </span>
    //         </Popconfirm>
    //       </>
    //     );
    //   },
    // },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
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
        headerTitle={
          <span style={{ fontWeight: "bold" }}>Quản lý mẫu văn bản</span>
        }
        toolBarRender={() => [
          <Button
            key="buttonAddNew"
            icon={<PlusOutlined />}
            onClick={() => {
              //   setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo mới mẫu văn bản
          </Button>,
        ]}
      />
      <Modal
        open={openPreview}
        onCancel={() => setOpenPreview(false)}
        footer={null}
        title={selectedTemplate?.name}
        width="80%"
        style={{ top: 20 }}
        bodyStyle={{ height: "80vh", padding: 0 }}
        destroyOnClose
      >
        {selectedTemplate && (
          <iframe
            src={templatePDF}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default TableDocumentTemplate;
