import { dateRangeValidate } from "@/services/helper";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { App, Avatar, Button, Modal, Popconfirm, Space, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import templatePDF from "assets/files/template.pdf";
import CreateDocumentTemplate from "./create.document.template";
import { BeatLoader } from "react-spinners";
import {
  viewAllDocumentTypesAPI,
  viewAllTemplatesAPI,
} from "@/services/api.service";

const TableDocumentTemplate = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const { message } = App.useApp();

  const fetchDocumentType = async () => {
    setLoading(true);
    const res = await viewAllDocumentTypesAPI("page=1&limit=100000");
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      const active = data.filter(
        (documentType) => documentType.isDeleted === false
      );
      const newDocumentTypeData = active.map((documentType) => ({
        documentTypeId: documentType.documentTypeId,
        documentTypeName: documentType.documentTypeName,
      }));
      setDocumentTypes(newDocumentTypeData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocumentType();
  }, []);

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
      width: "40%",
    },
    {
      title: "Loại văn bản",
      dataIndex: "type",
      valueType: "select",
      hideInSearch: true,
      width: "15%",
    },

    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createDate).format("DD-MM-YYYY HH:mm")}</>;
      },
      width: "15%",
    },

    {
      title: "Người tạo",
      dataIndex: "createBy",
      hideInSearch: true,
      width: "15%",
    },

    {
      title: "Thao tác",
      hideInSearch: true,
      width: "15%",
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
              title="Xác nhận khóa người dùng"
              description="Bạn có chắc chắn muốn khóa người dùng này?"
              // onConfirm={() => handleDeleteUser(entity._id)}
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

  if (loading) {
    return (
      <div
        className="full-screen-overlay"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <BeatLoader size={25} color="#364AD6" />
      </div>
    );
  }

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
            if (params.Name) {
              query += `docName=${params.Name}&`;
            }
            query += `page=${params.current}&pageSize=${params.pageSize}`;
          }
          const res = await viewAllTemplatesAPI(query);
          if (res.data) {
            setMeta({
              page: res.data?.meatadataDto.page,
              limit: res.data?.meatadataDto.limit,
              total: res.data?.size,
            });
          }
          return {
            data: res.data?.content,
            page: res.data?.meatadataDto.page,
            success: true,
            total: res.data?.size,
          };
        }}
        rowKey="id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return <div>{/* {range[0]} - {range[1]} trên {total} dòng */}</div>;
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
              setOpenModalCreate(true);
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
        centered
        style={{ top: 20 }}
        styles={{ body: { height: "80vh", padding: 0 } }}
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
      <CreateDocumentTemplate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
        documentTypes={documentTypes}
      />
    </div>
  );
};

export default TableDocumentTemplate;
