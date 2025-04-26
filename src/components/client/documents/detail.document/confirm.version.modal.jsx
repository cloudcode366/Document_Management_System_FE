import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  App,
  Divider,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PDFViewerWithToken from "@/components/pdf.viewer";
import { useCurrentApp } from "@/components/context/app.context";
import "./confirm.version.modal.scss";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

const { TextArea } = Input;

const ConfirmVersionModal = (props) => {
  const {
    openConfirmModal,
    setOpenConfirmModal,
    uploadedFile,

    documentId,
  } = props;
  const [form] = Form.useForm();
  const { notification, message } = App.useApp();
  const { user } = useCurrentApp();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({});
  }, [openConfirmModal, form, user]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Sẽ throw nếu còn ô chưa thỏa mãn validate
      const values = await form.validateFields();

      console.log(values.name, values.validTo, values.Deadline);
      navigate(`/detail-document/${documentId}`);
    } catch (err) {
      console.warn("Form chưa hợp lệ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseConfirmInfoDocumentModal = () => {
    setOpenConfirmModal(false);
    form.resetFields();
    setIsLoading(false);
  };

  return (
    <div>
      <Modal
        open={openConfirmModal}
        onCancel={handleCloseConfirmInfoDocumentModal}
        footer={null}
        width="90vw"
        centered
        maskClosable={false}
        closable={false}
        bodyProps={{
          style: {
            maxHeight: "80vh",
            overflowY: "auto",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
          }}
        >
          {/* Bên trái: Xem file PDF */}
          <Card
            title="Thông tin chi tiết"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              margin: 0,
              borderRadius: 0,
              borderLeft: "1px solid #f0f0f0",
              height: "100%",
              width: "70%",
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "auto",
              }}
            >
              {uploadedFile && (
                <PDFViewerWithToken
                  url={uploadedFile}
                  token={localStorage.getItem(`access_token`)}
                />
              )}
            </div>
          </Card>

          {/* Bên phải: Form nhập thông tin */}
          <Card
            title="Thông tin chi tiết"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              margin: 0,
              borderRadius: 0,
              borderLeft: "1px solid #f0f0f0",
              height: "100%",
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "auto",
              }}
            >
              <Form form={form} layout="vertical" className="form-large-text">
                <Form.Item
                  label="Tên văn bản"
                  name="Name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên văn bản!" },
                  ]}
                >
                  <Input placeholder="Nhập tên văn bản" />
                </Form.Item>

                <Form.Item
                  label="Loại văn bản"
                  name="DocumentTypeId"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại văn bản!" },
                  ]}
                  hidden
                >
                  <Input placeholder="Loại văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Loại văn bản"
                  name="DocumentTypeName"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại văn bản!" },
                  ]}
                >
                  <Input placeholder="Loại văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Số hiệu văn bản"
                  name="NumberOfDocument"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số hiệu văn bản!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số hiệu văn bản" readOnly />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="DocumentContent"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung!" },
                  ]}
                >
                  <TextArea rows={5} placeholder="Nhập nội dung tóm tắt" />
                </Form.Item>

                <div style={{ marginTop: "auto" }}>
                  <Divider />
                  <Button
                    loading={isLoading}
                    type="primary"
                    onClick={handleSubmit}
                    block
                    size="large"
                  >
                    Xác nhận
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmVersionModal;

// import {
//   Modal,
//   Form,
//   Input,
//   Button,
//   Card,
//   App,
//   Divider,
//   Tooltip,
// } from "antd";
// import { useEffect, useState } from "react";
// import PDFViewerWithToken from "@/components/pdf.viewer"; // Giả sử có component này
// import { useCurrentApp } from "@/components/context/app.context"; // Giả sử có context này
// import "./confirm.version.modal.scss";
// import { useNavigate } from "react-router-dom";

// const { TextArea } = Input;

// const ConfirmInfoDocument = (props) => {
//   const {
//     openConfirmModal,
//     setOpenConfirmModal,
//     uploadedFile,
//     documentId,
//   } = props;
//   const [form] = Form.useForm();
//   const { notification, message } = App.useApp();
//   const { user } = useCurrentApp();
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Mock data từ backend giả định trả về
//   const mockBackendResponse = {
//     documentNameFromBackend: "Quyết định số 123",
//     documentNameFromAI: "Quyết định bổ nhiệm nhân sự",
//     documentType: "Quyết định bổ nhiệm",
//   };

//   // State để theo dõi sự thay đổi của tên từ AI
//   const [documentNameFromAI, setDocumentNameFromAI] = useState(mockBackendResponse.documentNameFromAI);
//   const [isNameChanged, setIsNameChanged] = useState(false);

//   useEffect(() => {
//     if (openConfirmModal) {
//       // Cập nhật dữ liệu vào form khi modal mở
//       form.setFieldsValue({
//         DocumentNameFromBackend: mockBackendResponse.documentNameFromBackend,
//         DocumentNameFromAI: mockBackendResponse.documentNameFromAI,
//         DocumentType: mockBackendResponse.documentType,
//       });
//     }
//   }, [openConfirmModal, form]);

//   // Hàm xử lý khi tên do AI thay đổi
//   const handleAINameChange = (e) => {
//     const newName = e.target.value;
//     setDocumentNameFromAI(newName);

//     // Kiểm tra nếu tên từ AI khác với tên backend
//     if (newName !== mockBackendResponse.documentNameFromAI) {
//       setIsNameChanged(true);
//     } else {
//       setIsNameChanged(false);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true);
//       // Sẽ throw nếu còn ô chưa thỏa mãn validate
//       const values = await form.validateFields();
//       console.log(values); // Kiểm tra dữ liệu khi submit
//       // Điều hướng hoặc thực hiện hành động sau khi submit
//       navigate("/some-path");
//     } catch (err) {
//       console.warn("Form chưa hợp lệ:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCloseConfirmInfoDocumentModal = () => {
//     setOpenConfirmModal(false);
//     form.resetFields();
//     setIsLoading(false);
//   };

//   return (
//     <div>
//       <Modal
//         open={openConfirmModal}
//         onCancel={handleCloseConfirmInfoDocumentModal}
//         footer={null}
//         width="90vw"
//         centered
//         maskClosable={false}
//         closable={false}
//         bodyProps={{
//           style: {
//             maxHeight: "80vh",
//             overflowY: "auto",
//           },
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             height: "100%",
//           }}
//         >
//           {/* Bên trái: Xem file PDF */}
//           <Card
//             title="Thông tin chi tiết"
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               margin: 0,
//               borderRadius: 0,
//               borderLeft: "1px solid #f0f0f0",
//               height: "100%",
//               width: "70%",
//             }}
//           >
//             <div
//               style={{
//                 flex: 1,
//                 overflow: "auto",
//               }}
//             >
//               {uploadedFile && (
//                 <PDFViewerWithToken
//                   url={uploadedFile}
//                   token={localStorage.getItem(`access_token`)}
//                 />
//               )}
//             </div>
//           </Card>

//           {/* Bên phải: Form nhập thông tin */}
//           <Card
//             title="Thông tin chi tiết"
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               margin: 0,
//               borderRadius: 0,
//               borderLeft: "1px solid #f0f0f0",
//               height: "100%",
//             }}
//           >
//             <div
//               style={{
//                 flex: 1,
//                 overflow: "auto",
//               }}
//             >
//               <Form form={form} layout="vertical" className="form-large-text">
//                 {/* Tên văn bản từ backend */}
//                 <Form.Item
//                   label="Tên văn bản (Backend)"
//                   name="DocumentNameFromBackend"
//                   rules={[{ required: true, message: "Vui lòng nhập tên văn bản từ backend!" }]}
//                 >
//                   <Input placeholder="Tên văn bản từ backend" readOnly />
//                 </Form.Item>

//                 {/* Tên văn bản từ AI */}
//                 <Form.Item
//                   label="Tên văn bản (AI)"
//                   name="DocumentNameFromAI"
//                   rules={[{ required: true, message: "Vui lòng nhập tên văn bản từ AI!" }]}
//                   help={isNameChanged ? "Tên văn bản đã thay đổi so với thông tin AI quét." : ""}
//                 >
//                   <Input
//                     placeholder="Tên văn bản từ AI"
//                     value={documentNameFromAI}
//                     onChange={handleAINameChange}
//                   />
//                 </Form.Item>

//                 {/* Loại văn bản */}
//                 <Form.Item
//                   label="Loại văn bản"
//                   name="DocumentType"
//                   rules={[{ required: true, message: "Vui lòng chọn loại văn bản!" }]}
//                 >
//                   <Input placeholder="Loại văn bản" readOnly />
//                 </Form.Item>

//                 <Form.Item
//                   label="Số hiệu văn bản"
//                   name="NumberOfDocument"
//                   rules={[{ required: true, message: "Vui lòng nhập số hiệu văn bản!" }]}
//                 >
//                   <Input placeholder="Nhập số hiệu văn bản" readOnly />
//                 </Form.Item>

//                 <Form.Item
//                   label="Nội dung"
//                   name="DocumentContent"
//                   rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
//                 >
//                   <TextArea rows={5} placeholder="Nhập nội dung tóm tắt" />
//                 </Form.Item>

//                 <div style={{ marginTop: "auto" }}>
//                   <Divider />
//                   <Button
//                     loading={isLoading}
//                     type="primary"
//                     onClick={handleSubmit}
//                     block
//                     size="large"
//                   >
//                     Xác nhận
//                   </Button>
//                 </div>
//               </Form>
//             </div>
//           </Card>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ConfirmInfoDocument;
