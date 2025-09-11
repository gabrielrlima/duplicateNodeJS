import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetProperty } from 'src/actions/property';

import { PropertyDetailsView } from 'src/sections/property/view/property-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Detalhes do Imóvel | Painel - ${CONFIG.appName}` };

export default function PropertyDetailsPage() {
  const { id = '' } = useParams();

  const { property } = useGetProperty(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PropertyDetailsView property={property} />
    </>
  );
}
