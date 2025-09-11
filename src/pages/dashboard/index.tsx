import { Helmet } from 'react-helmet-async';

import { OverviewDashboardView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Painel Principal</title>
      </Helmet>

      <OverviewDashboardView />
    </>
  );
}
