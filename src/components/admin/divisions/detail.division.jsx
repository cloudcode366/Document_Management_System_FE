import { Descriptions, Drawer, Image, Table, Tag } from "antd";

const DetailDivision = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      render(dom, entity) {
        return (
          <Image
            width={40}
            height={40}
            src={entity?.avatar || undefined}
            fallback="/default-avatar.png"
            style={{
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        );
      },
      width: "10%",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      width: "20%",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "25%",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      width: "25%",
    },
  ];

  return (
    <>
      {dataViewDetail && (
        <Drawer
          title={`Chi tiết phòng ban`}
          width={"60vw"}
          open={openViewDetail}
          onClose={onClose}
          styles={{ body: { padding: 0, overflow: "hidden", height: "100vh" } }}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item
              label="Tên phòng ban"
              labelStyle={{ fontWeight: "bold" }}
            >
              {dataViewDetail?.divisionName}
            </Descriptions.Item>
            <Descriptions.Item
              label="Trạng thái"
              labelStyle={{ fontWeight: "bold" }}
            >
              {dataViewDetail?.isDeleted ? (
                <Tag color="red">Bị khóa</Tag>
              ) : (
                <Tag color="green">Hoạt động</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Table
            dataSource={dataViewDetail.users || []}
            columns={columns}
            rowKey="userId"
            pagination={false}
            style={{ padding: 10 }}
            scroll={{ y: "100%" }}
          />
        </Drawer>
      )}
    </>
  );
};

export default DetailDivision;
