import TableAllDocument from "@/components/client/documents/all.documents/table.all.document";
import UploadSignatureModal from "@/components/client/upload.signature.modal";
import { useCurrentApp } from "@/components/context/app.context";

const ListAllDocumentPage = () => {
  const { user } = useCurrentApp();
  return (
    <>
      {!user.isEnable ? (
        <>
          <UploadSignatureModal />
        </>
      ) : (
        <>
          <TableAllDocument />
        </>
      )}
    </>
  );
};

export default ListAllDocumentPage;
