import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TerrenoCreateView } from 'src/sections/terreno/view';

// ----------------------------------------------------------------------

const metadata = { title: `Novo terreno | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TerrenoCreateView />
    </>
  );
}
