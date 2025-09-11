import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetProperty } from 'src/actions/property';

import { PropertyEditView } from 'src/sections/property/view';

// ----------------------------------------------------------------------

const metadata = { title: `Property edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { property: currentProperty } = useGetProperty(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PropertyEditView property={currentProperty} />
    </>
  );
}
