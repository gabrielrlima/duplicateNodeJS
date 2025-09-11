import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { GrupoCreateView } from 'src/sections/grupos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Novo grupo | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title} </title>
      </Helmet>

      <GrupoCreateView />
    </>
  );
}
