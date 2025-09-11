import type { ILeadItem } from 'src/types/lead';

import { useParams } from 'react-router';
import { _leadList } from '@/_mock/_lead';
import { Helmet } from 'react-helmet-async';
import { LeadDetailsView } from '@/sections/lead/view/lead-details-view';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Lead | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  // const { client, clientLoading, clientError } = useGetClient(id);
  const lead = _leadList.find((item: ILeadItem) => item.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeadDetailsView lead={lead} />
    </>
  );
}
