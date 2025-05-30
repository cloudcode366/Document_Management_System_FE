import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "styles/global.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListUserPage from "pages/client/users/list.user";
import ListInComingDocumentPage from "pages/client/documents/incoming.documents/list.incoming.document";
import ListOutgoingDocumentPage from "pages/client/documents/outgoing.documents/list.outgoing.document";
import ListSchoolScopedDocumentPage from "pages/client/documents/school.scoped.documents/list.school.scoped.document";
import ListDivisionScopedDocumentPage from "pages/client/documents/division.scoped.documents/list.division.scoped.document";
import LayoutAdmin from "@/layout.admin";
import NotificationPage from "pages/notification";
import ManageDivisionPage from "pages/admin/divisions/manage.division";
import ManageUserPage from "pages/admin/users/manage.user";
import ManageDocumentTypePage from "pages/admin/document.types/manage.document.type";
import ManageLogPage from "pages/admin/log.list/manage.log";
import ManagePermissionPage from "pages/admin/permissions/manage.permission";
import ManageWorkflowPage from "pages/admin/workflows/manage.workflow";
import LoginPage from "pages/auth/login";
import ForgotPasswordPage from "pages/auth/forgot.password";
import ChangePasswordPage from "pages/auth/change.password";
import ProfilePage from "pages/profile";
import UserGuidePage from "pages/user.guide";
import ListArchivedDocumentPage from "pages/client/archived.documents/list.archived.document";
import ListDocumentTemplatePage from "pages/client/document.templates/list.document.template";
import ListDocumentTypePage from "pages/client/document.types/list.document.type";
import ListProgressPage from "pages/client/progresses/list.progress";
import ListTaskPage from "pages/client/tasks/list.task";
import ListWorkflowPage from "pages/client/workflows/list.workflow";
import viVN from "antd/locale/vi_VN";
import { App, ConfigProvider } from "antd";
import ListAllDocumentPage from "pages/client/documents/all.documents/list.all.documents";
import LayoutClient from "@/layout";
import TaskDetailPage from "pages/client/tasks/task.detail";
import DetailDocument from "pages/client/documents/detail.document";
import { AppProvider } from "components/context/app.context";
import ProtectedRoute from "components/auth";
import "nprogress/nprogress.css";
import ListDivisionPage from "pages/client/divisions/list.division";
import { NotificationProvider } from "components/context/notification.context";
import DetailProgress from "pages/client/progresses/detail.progress";
import DetailArchivedDocument from "pages/client/archived.documents/detail.archived.document";
import InitProgress from "pages/client/progresses/init.progress";
import SendEmailPage from "./pages/client/send.email/send.email";
import DigitalSignature from "./pages/client/digital.signatures/digital.signature";
import VersionDocument from "@/pages/client/documents/version.document";
import CreateFirstTaskPage from "./pages/client/tasks/create.first.task";
import TestPosition from "./pages/client/test/test.position";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <LayoutClient />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <ListAllDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/test",
        element: (
          <ProtectedRoute>
            <TestPosition />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute>
            <ListUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/division",
        element: (
          <ProtectedRoute>
            <ListDivisionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/incoming-document",
        element: (
          <ProtectedRoute>
            <ListInComingDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/outgoing-document",
        element: (
          <ProtectedRoute>
            <ListOutgoingDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/school-scoped-document",
        element: (
          <ProtectedRoute>
            <ListSchoolScopedDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/division-scoped-document",
        element: (
          <ProtectedRoute>
            <ListDivisionScopedDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/detail-document/:documentId",
        element: (
          <ProtectedRoute>
            <DetailDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "/digital-signature/:documentId",
        element: (
          <ProtectedRoute>
            <DigitalSignature />
          </ProtectedRoute>
        ),
      },
      {
        path: "/version-document",
        element: (
          <ProtectedRoute>
            <VersionDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "/archived-document",
        element: (
          <ProtectedRoute>
            <ListArchivedDocumentPage />
          </ProtectedRoute>
        ),
      },

      {
        // path: "/detail-archived-document/:documentId",
        path: "/detail-archived-document",
        element: (
          <ProtectedRoute>
            <DetailArchivedDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "/document-template",
        element: (
          <ProtectedRoute>
            <ListDocumentTemplatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/document-type",
        element: (
          <ProtectedRoute>
            <ListDocumentTypePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/progress",
        element: (
          <ProtectedRoute>
            <ListProgressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/detail-progress/:documentId",
        element: (
          <ProtectedRoute>
            <DetailProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: "/init-progress/:documentId/:taskChiefId?",
        element: (
          <ProtectedRoute>
            <InitProgress />
          </ProtectedRoute>
        ),
      },

      {
        path: "/task",
        element: (
          <ProtectedRoute>
            <ListTaskPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/task-detail/:taskId",
        element: (
          <ProtectedRoute>
            <TaskDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-first-task/:documentId",
        element: (
          <ProtectedRoute>
            <CreateFirstTaskPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/workflow",
        element: (
          <ProtectedRoute>
            <ListWorkflowPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/change-password",
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notification",
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user-guide",
        element: (
          <ProtectedRoute>
            <UserGuidePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/send-email",
        element: (
          <ProtectedRoute>
            <SendEmailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "notification",
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "division",
        element: (
          <ProtectedRoute>
            <ManageDivisionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "document-type",
        element: (
          <ProtectedRoute>
            <ManageDocumentTypePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "log",
        element: (
          <ProtectedRoute>
            <ManageLogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "permission",
        element: (
          <ProtectedRoute>
            <ManagePermissionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "workflow",
        element: (
          <ProtectedRoute>
            <ManageWorkflowPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-guide",
        element: (
          <ProtectedRoute>
            <UserGuidePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <AppProvider>
        <NotificationProvider>
          <ConfigProvider locale={viVN}>
            <RouterProvider router={router} />
          </ConfigProvider>
        </NotificationProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
