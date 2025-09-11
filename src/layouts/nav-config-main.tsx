import { Iconify } from 'src/components/iconify';

import type { NavMainProps } from './main/nav/types';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  { title: 'Início', path: '/', icon: <Iconify width={22} icon="solar:home-2-bold-duotone" /> },
  {
    title: 'Sobre',
    path: '/about',
    icon: <Iconify width={22} icon="solar:atom-bold-duotone" />,
  },
  {
    title: 'Planos',
    path: '/prices',
    icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  },
  {
    title: 'Dúvidas Frequentes',
    path: '/faq',
    icon: <Iconify width={22} icon="solar:notebook-bold-duotone" />,
  },
];
