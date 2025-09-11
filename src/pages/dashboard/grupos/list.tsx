import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { GruposListView } from 'src/sections/grupos';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de grupos | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title} </title>
      </Helmet>

      <GruposListView />
    </>
  );
}
