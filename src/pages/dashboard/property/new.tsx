import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PropertyCreateView } from 'src/sections/property/view/property-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Cadstrar novo imóvel | Painel - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PropertyCreateView />
    </>
  );
}
