import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CorretoresListView } from 'src/sections/corretores';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de corretores | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title} </title>
      </Helmet>

      <CorretoresListView />
    </>
  );
}
