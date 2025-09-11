import type { IClientItem } from 'src/types/client';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { _allFiles, _clientBank, _clientPropertys, _clientSocialMedia } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FileManagerView } from 'src/sections/file-manager/view';

import ProfileBank from '../profile-bank';
import { ProfileCover } from '../profile-cover';
import { ClientProfileForm } from '../profile-home';
import { ProfileProperty } from '../profile-property';
import ProfileSocialMedia from '../profile-social-media';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    value: '',
    label: 'Perfil de imóveis',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'personalData',
    label: 'Dados pessoais',
    icon: <Iconify width={24} icon="solar:verified-check-bold" />,
  },
  {
    value: 'documents',
    label: 'Documentos',
    icon: <Iconify width={24} icon="eva:attach-2-fill" />,
  },
  {
    value: 'bankData',
    label: 'Dados bancários',
    icon: <Iconify width={24} icon="solar:shield-keyhole-bold-duotone" />,
  },
  {
    value: 'socialMedia',
    label: 'Redes sociais',
    icon: <Iconify width={24} icon="solar:heart-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

type Props = {
  client?: IClientItem;
  error?: any;
  loading?: boolean;
};

export function ClientDetailsView({ client, error, loading }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  // const [searchFriends, setSearchFriends] = useState('');

  // const handleSearchFriends = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchFriends(event.target.value);
  // }, []);

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={client?.name}
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Clientes', href: paths.dashboard.client.root },
          { name: 'Meus Clientes', href: paths.dashboard.client.list },
          { name: client?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ height: 290 }}>
        <ProfileCover
          profession={client.profession}
          name={client?.name}
          avatarUrl={client?.photoURL}
          coverUrl={client.coverUrl}
        />

        <Box
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            display: 'flex',
            position: 'absolute',
            bgcolor: 'background.paper',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Tabs value={selectedTab}>
            {NAV_ITEMS.map((tab) => (
              <Tab
                component={RouterLink}
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
                href={createRedirectPath(pathname, tab.value)}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {selectedTab === '' && <ProfileProperty property={_clientPropertys} client={client} />}

      {selectedTab === 'personalData' && <ClientProfileForm client={client} />}

      {selectedTab === 'documents' && (
        <Box sx={{ my: 5 }}>
          <FileManagerView
            files={_allFiles}
            title={`Documentos de ${client.name.split(' ')[0]}`}
            uploadeButtonName="Adicionar novo documento"
          />
        </Box>
      )}

      {selectedTab === 'bankData' && <ProfileBank data={_clientBank} client={client} />}

      {selectedTab === 'socialMedia' && (
        <ProfileSocialMedia data={_clientSocialMedia} client={client} />
      )}
    </DashboardContent>
  );
}
