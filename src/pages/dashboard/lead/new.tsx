import { Helmet } from 'react-helmet-async';
import { LeadCreateView } from '@/sections/lead/view/lead-create-view';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Adicionar novo lead | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeadCreateView />
    </>
  );
}
