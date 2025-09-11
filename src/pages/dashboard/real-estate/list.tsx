import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RealEstateListView } from 'src/sections/real-estate/view/real-estate-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de Imobiliárias | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RealEstateListView />
    </>
  );
}