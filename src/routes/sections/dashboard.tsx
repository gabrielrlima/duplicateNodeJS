import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AccountLayout } from 'src/sections/account/account-layout';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));

const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));
// Wallet
const WalletRealEstatePage = lazy(() => import('src/pages/dashboard/wallet/details'));
const WalletTransferPage = lazy(() => import('src/pages/dashboard/wallet/transfer'));
const WalletTransferCopyPastePage = lazy(
  () => import('src/pages/dashboard/wallet/transfer-copy.-paste')
);
// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// Vendas
const VendasListPage = lazy(() => import('src/pages/dashboard/vendas/list'));
const VendasCreatePage = lazy(() => import('src/pages/dashboard/vendas/new'));
const VendasDetailsPage = lazy(() => import('src/pages/dashboard/vendas/details'));
// Corretores
// Corretores
const CorretoresListPage = lazy(() => import('src/pages/dashboard/corretores/list'));
const CorretoresCreatePage = lazy(() => import('src/pages/dashboard/corretores/new'));
const CorretoresDetailsPage = lazy(() => import('src/pages/dashboard/corretores/details'));
const CorretoresEditPage = lazy(() => import('src/pages/dashboard/corretores/edit'));
// Grupos
const GruposListPage = lazy(() => import('src/pages/dashboard/grupos/list'));
const GruposCreatePage = lazy(() => import('src/pages/dashboard/grupos/new'));
const GruposDetailsPage = lazy(() => import('src/pages/dashboard/grupos/details'));
const GruposEditPage = lazy(() => import('src/pages/dashboard/grupos/edit'));
// Relatórios v4
const RelatoriosListPage = lazy(() => import('src/pages/dashboard/relatorios/list'));
const RelatoriosCreatePage = lazy(() => import('src/pages/dashboard/relatorios/new'));
const RelatoriosVendasPage = lazy(() => import('src/pages/dashboard/relatorios/vendas'));
const RelatoriosDetailsPage = lazy(() => import('src/pages/dashboard/relatorios/details'));
const RelatoriosEditPage = lazy(() => import('src/pages/dashboard/relatorios/edit'));
// Cobrança
const CobrancaListPage = lazy(() => import('src/pages/dashboard/cobranca/list'));
const CobrancaDetailsPage = lazy(() => import('src/pages/dashboard/cobranca/details'));
const CobrancaRecebimentosPage = lazy(() => import('src/pages/dashboard/cobranca/recebimentos'));
// Recebimentos
const RecebimentosListPage = lazy(() => import('src/pages/dashboard/recebimentos/list'));
const RecebimentosDetailsPage = lazy(() => import('src/pages/dashboard/recebimentos/details'));

// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Client
const ClientProfilePage = lazy(() => import('src/pages/dashboard/client/details'));
// const ClientCardsPage = lazy(() => import('src/pages/dashboard/client/cards'));
const ClientListPage = lazy(() => import('src/pages/dashboard/client/list'));
const ClientCreatePage = lazy(() => import('src/pages/dashboard/client/new'));
// const ClientEditPage = lazy(() => import('src/pages/dashboard/client/edit'));
// Property
const PropertyProfilePage = lazy(() => import('src/pages/dashboard/property/details'));
// const PropertyCardsPage = lazy(() => import('src/pages/dashboard/property/cards'));
const PropertyListPage = lazy(() => import('src/pages/dashboard/property/list'));

const PropertyCreatePage = lazy(() => import('src/pages/dashboard/property/new'));
const PropertyEditPage = lazy(() => import('src/pages/dashboard/property/edit'));


// Lead
const LeadListPage = lazy(() => import('src/pages/dashboard/lead/list'));
const LeadCreatePage = lazy(() => import('src/pages/dashboard/lead/new'));
const LeadDetailsPage = lazy(() => import('src/pages/dashboard/lead/details'));

// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
const AccountBillingPage = lazy(() => import('src/pages/dashboard/user/account/billing'));
const AccountSocialsPage = lazy(() => import('src/pages/dashboard/user/account/socials'));
const AccountNotificationsPage = lazy(
  () => import('src/pages/dashboard/user/account/notifications')
);
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
// Blog
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// Job
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// Tour
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// Empreendimentos

// Real Estate
const RealEstateListPage = lazy(() => import('src/pages/dashboard/real-estate/list'));
const RealEstateCreatePage = lazy(() => import('src/pages/dashboard/real-estate/new'));
// Comissões
const ComissoesListPage = lazy(() => import('src/pages/dashboard/comissoes/list'));
const ComissoesCreatePage = lazy(() => import('src/pages/dashboard/comissoes/new'));
const ComissoesDetailsPage = lazy(() => import('src/pages/dashboard/comissoes/details'));
const ComissoesEditPage = lazy(() => import('src/pages/dashboard/comissoes/edit'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

const accountLayout = () => (
  <AccountLayout>
    <SuspenseOutlet />
  </AccountLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? (
      dashboardLayout()
    ) : (
      <AuthGuard>
        {dashboardLayout()}
      </AuthGuard>
    ),
    children: [
      { index: true, element: <IndexPage /> },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'course', element: <OverviewCoursePage /> },
      {
        path: 'user',
        children: [
          { index: true, element: <UserProfilePage /> },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              { path: 'billing', element: <AccountBillingPage /> },
              { path: 'notifications', element: <AccountNotificationsPage /> },
              { path: 'socials', element: <AccountSocialsPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
            ],
          },
        ],
      },
      {
        path: 'client',
        children: [
          { index: true, element: <ClientListPage /> },
          { path: 'list', element: <ClientListPage /> },
          { path: 'new', element: <ClientCreatePage /> },
          { path: ':id', element: <ClientProfilePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
        ],
      },
      {
        path: 'property',
        children: [
          { index: true, element: <PropertyListPage /> },
          { path: 'list', element: <PropertyListPage /> },

          { path: 'new', element: <PropertyCreatePage /> },
          { path: ':id', element: <PropertyProfilePage /> },
          { path: ':id/edit', element: <PropertyEditPage /> },
        ],
      },

      {
        path: 'wallet',
        children: [
          { index: true, element: <WalletRealEstatePage /> },
          { path: 'transfer', element: <WalletTransferPage /> },
          { path: 'transfer-copy-paste', element: <WalletTransferCopyPastePage /> },
        ],
      },
      {
        path: 'lead',
        children: [
          { index: true, element: <LeadListPage /> },
          { path: 'list', element: <LeadListPage /> },
          { path: 'new', element: <LeadCreatePage /> },
          { path: ':id', element: <LeadDetailsPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { index: true, element: <OrderListPage /> },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { index: true, element: <InvoiceListPage /> },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'vendas',
        children: [
          { index: true, element: <VendasListPage /> },
          { path: 'list', element: <VendasListPage /> },
          { path: 'new', element: <VendasCreatePage /> },
          { path: ':id', element: <VendasDetailsPage /> },
        ],
      },

      {
        path: 'corretores',
        children: [
          { index: true, element: <CorretoresListPage /> },
          { path: 'list', element: <CorretoresListPage /> },
          { path: 'new', element: <CorretoresCreatePage /> },
          { path: ':id', element: <CorretoresDetailsPage /> },
          { path: ':id/edit', element: <CorretoresEditPage /> },
        ],
      },
      {
        path: 'grupos',
        children: [
          { index: true, element: <GruposListPage /> },
          { path: 'list', element: <GruposListPage /> },
          { path: 'new', element: <GruposCreatePage /> },
          { path: ':id', element: <GruposDetailsPage /> },
          { path: ':id/edit', element: <GruposEditPage /> },
        ],
      },
      {
        path: 'relatorios',
        children: [
          { index: true, element: <RelatoriosListPage /> },
          { path: 'list', element: <RelatoriosListPage /> },
          { path: 'new', element: <RelatoriosCreatePage /> },
          { path: 'vendas', element: <RelatoriosVendasPage /> },
          { path: ':id', element: <RelatoriosDetailsPage /> },
          { path: ':id/edit', element: <RelatoriosEditPage /> },
        ],
      },
      {
        path: 'cobranca',
        children: [
          { index: true, element: <CobrancaListPage /> },
          { path: 'list', element: <CobrancaListPage /> },
          { path: ':id', element: <CobrancaDetailsPage /> },
          { path: ':id/recebimentos', element: <CobrancaRecebimentosPage /> },
        ],
      },
      {
        path: 'recebimentos',
        children: [
          { index: true, element: <RecebimentosListPage /> },
          { path: 'list', element: <RecebimentosListPage /> },
          { path: ':id', element: <RecebimentosDetailsPage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { index: true, element: <BlogPostsPage /> },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { index: true, element: <JobListPage /> },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { index: true, element: <TourListPage /> },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },

      {
        path: 'real-estate',
        children: [
          { index: true, element: <RealEstateListPage /> },
          { path: 'list', element: <RealEstateListPage /> },
          { path: 'new', element: <RealEstateCreatePage /> },
        ],
      },
      {
        path: 'comissoes',
        children: [
          { index: true, element: <ComissoesListPage /> },
          { path: 'list', element: <ComissoesListPage /> },
          { path: 'new', element: <ComissoesCreatePage /> },
          { path: ':id', element: <ComissoesDetailsPage /> },
          { path: ':id/edit', element: <ComissoesEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
