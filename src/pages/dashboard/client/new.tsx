import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ClientCreateView } from 'src/sections/client/view/client-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Criar novo cliente | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ClientCreateView />
    </>
  );
}
