import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PropertyListView } from 'src/sections/property/view/property-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de imóveis | Painel - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PropertyListView />
    </>
  );
}
