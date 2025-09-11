import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { WalletDetailsView } from 'src/sections/wallet/view/wallet-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Carteira da imobiliária | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WalletDetailsView />
    </>
  );
}
