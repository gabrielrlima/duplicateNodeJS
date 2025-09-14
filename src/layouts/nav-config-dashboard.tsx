import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Painel Principal',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: <Iconify icon="solar:widget-bold-duotone" />,
      },
      {
        title: 'Minhas Imobiliárias',
        path: paths.dashboard.realEstate.root,
        icon: <Iconify icon="solar:buildings-3-bold-duotone" />,
        children: [
          { title: 'Lista de imobiliárias', path: paths.dashboard.realEstate.list },
          { title: 'Nova imobiliária', path: paths.dashboard.realEstate.new },
        ],
      },
      {
        title: 'Calendário',
        path: paths.dashboard.calendar,
        icon: <Iconify icon="solar:calendar-bold-duotone" />,
      },
    ],
  },
  /**
   * Core Business
   */
  {
    subheader: 'Gestão de Negócios',
    items: [
      {
        title: 'Produtos',
        path: paths.dashboard.property.root,
        icon: <Iconify icon="solar:box-bold-duotone" />,
        children: [
          { title: 'Todos os produtos', path: paths.dashboard.property.list },
          { title: 'Cadastrar produto', path: paths.dashboard.property.new },
        ],
      },

      {
        title: 'Clientes',
        path: paths.dashboard.client.root,
        icon: <Iconify icon="solar:users-group-rounded-bold-duotone" />,
        children: [
          { title: 'Lista de clientes', path: paths.dashboard.client.list },
          { title: 'Novo cliente', path: paths.dashboard.client.new },
        ],
      },
      {
        title: 'Vendas & Atendimentos',
        path: paths.dashboard.vendas.root,
        icon: <Iconify icon="solar:cart-check-bold-duotone" />,
        children: [
          { title: 'Minhas Vendas', path: paths.dashboard.vendas.list },
          { title: 'Novo atendimento', path: paths.dashboard.vendas.new },
        ],
      },
      {
        title: 'Regras de Comissões',
        path: paths.dashboard.comissoes.root,
        icon: <Iconify icon="solar:calculator-bold-duotone" />,
        children: [
          { title: 'Gerenciar regras', path: paths.dashboard.comissoes.list },
          { title: 'Nova regra', path: paths.dashboard.comissoes.new },
        ],
      },
      {
        title: 'Leads',
        path: paths.dashboard.lead.list,
        icon: <Iconify icon="solar:star-bold-duotone" />,
        children: [
          { title: 'Gerenciar leads', path: paths.dashboard.lead.list },
          { title: 'Capturar lead', path: paths.dashboard.lead.new },
        ],
      },
    ],
  },
  /**
   * Financial
   */
  {
    subheader: 'Financeiro',
    items: [
      {
        title: 'Carteira Digital',
        path: paths.dashboard.wallet.root,
        icon: <Iconify icon="solar:wallet-money-bold-duotone" />,
      },
      {
        title: 'Cobrança',
        path: paths.dashboard.cobranca.root,
        icon: <Iconify icon="solar:bill-list-bold-duotone" />,
        children: [{ title: 'Gerenciar cobranças', path: paths.dashboard.cobranca.list }],
      },
    ],
  },
  /**
   * Management & Analytics
   */
  {
    subheader: 'Análises & Relatórios',
    items: [
      {
        title: 'Relatórios',
        path: paths.dashboard.relatorios.root,
        icon: <Iconify icon="solar:chart-square-bold-duotone" />,
      },
    ],
  },
  /**
   * Team Management
   */
  {
    subheader: 'Gestão de Equipe',
    items: [
      {
        title: 'Corretores',
        path: paths.dashboard.corretores.root,
        icon: <Iconify icon="solar:user-id-bold-duotone" />,
        children: [
          { title: 'Equipe de corretores', path: paths.dashboard.corretores.list },
          { title: 'Cadastrar corretor', path: paths.dashboard.corretores.new },
        ],
      },
      {
        title: 'Grupos',
        path: paths.dashboard.grupos.root,
        icon: <Iconify icon="solar:users-group-two-rounded-bold-duotone" />,
        children: [
          { title: 'Gerenciar grupos', path: paths.dashboard.grupos.list },
          { title: 'Criar grupo', path: paths.dashboard.grupos.new },
        ],
      },
    ],
  },
];
