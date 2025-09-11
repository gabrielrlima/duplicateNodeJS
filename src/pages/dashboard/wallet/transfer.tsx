import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { WalletTransferView } from 'src/sections/wallet/view/wallet-transfer-view';

// ----------------------------------------------------------------------

const metadata = { title: `Transferência | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WalletTransferView />
    </>
  );
}
