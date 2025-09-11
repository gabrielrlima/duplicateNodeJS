import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { RealEstateSwitchingLoader } from './real-estate-switching-loader';

// ----------------------------------------------------------------------

type RealEstateLoadingWrapperProps = {
  children: React.ReactNode;
};

export function RealEstateLoadingWrapper({ children }: RealEstateLoadingWrapperProps) {
  const { switchingRealEstate } = useRealEstateContext();

  return (
    <>
      {children}
      <RealEstateSwitchingLoader open={switchingRealEstate} />
    </>
  );
}