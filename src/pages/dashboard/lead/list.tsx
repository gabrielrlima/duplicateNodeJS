import { Helmet } from 'react-helmet-async';
import { LeadListView } from '@/sections/lead/view/lead-list-view';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de leads | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeadListView />
    </>
  );
}
