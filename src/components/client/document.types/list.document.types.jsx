import { ProTable } from "@ant-design/pro-components";
import { Tag } from "antd";
import { useRef, useState } from "react";
import { viewAllDocumentTypesAPI } from "@/services/api.service";

const ListDocumentType = () => {
  const actionRef = useRef();

  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const columns = [
    {
      title: "Loại văn bản",
      dataIndex: "documentTypeName",
      copyable: true,
      width: "60%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên loại văn bản",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      hideInSearch: true,
      width: "20%",
      render: (isDeleted) =>
        isDeleted ? (
          <Tag color="red">Bị khóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
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
          let query = "";
          if (params) {
            if (params.documentTypeName) {
              query += `documentTypeName=${params.documentTypeName}`;
            }
            query += `&page=${params.current}&limit=${params.pageSize}`;
          }

          const res = await viewAllDocumentTypesAPI(query);
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
        rowKey="documentTypeId"
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return <div>{/* {range[0]} - {range[1]} trên {total} dòng */}</div>;
          },
        }}
        headerTitle={
          <span style={{ fontWeight: "bold" }}>Danh sách loại văn bản</span>
        }
      />
    </div>
  );
};

export default ListDocumentType;
