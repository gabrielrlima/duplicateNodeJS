import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ClientListView } from 'src/sections/client/view/client-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de clientes | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ClientListView />
    </>
  );
}
