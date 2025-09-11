import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RealEstateCreateView } from 'src/sections/real-estate/view';

// ----------------------------------------------------------------------

const metadata = { title: `Nova Imobiliária | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RealEstateCreateView />
    </>
  );
}