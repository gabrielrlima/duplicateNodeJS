import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TerrenoListView } from 'src/sections/terreno/view';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de terrenos | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TerrenoListView />
    </>
  );
}
