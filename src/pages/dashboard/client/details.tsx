import type { IClientItem } from 'src/types/client';

import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { _clientList } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { ClientDetailsView } from 'src/sections/client/view/client-profile-view';

// ----------------------------------------------------------------------

const metadata = { title: `Cliente | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  // const { client, clientLoading, clientError } = useGetClient(id);
  const client = _clientList.find((item: IClientItem) => item.id === id);
  const clientLoading = false;
  const clientError = false;

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ClientDetailsView client={client} loading={clientLoading} error={clientError} />
    </>
  );
}
