import { CONFIG } from 'src/global-config';

import type { WorkspacesPopoverProps } from './components/workspaces-popover';

// ----------------------------------------------------------------------

export const _workspaces: WorkspacesPopoverProps['data'] = [
  {
    id: 'team-1',
    name: 'Negócio ABC',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`,
    plan: 'Pro',
  },
  {
    id: 'team-2',
    name: 'Negócio DFG',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
    plan: 'Pro',
  },
  {
    id: 'team-3',
    name: 'Negócio HIJ',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-3.webp`,
    plan: 'Pro',
  },
];
