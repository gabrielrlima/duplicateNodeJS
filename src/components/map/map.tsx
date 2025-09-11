import type { Theme, SxProps } from '@mui/material/styles';
import type { MapRef, MapProps as ReactMapProps } from 'react-map-gl';

import { forwardRef } from 'react';
import ReactMap from 'react-map-gl';

import { styled } from '@mui/material/styles';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type MapProps = ReactMapProps & { sx?: SxProps<Theme> };

export const Map = forwardRef<MapRef, MapProps>((props, ref) => {
  const { sx, projection, ...other } = props;

  // Handle projection type compatibility issue
  const safeProjection = typeof projection === 'string' ? undefined : projection;

  return (
    <MapRoot sx={sx}>
      <ReactMap
        ref={ref}
        mapboxAccessToken={CONFIG.mapboxApiKey}
        projection={safeProjection}
        {...other}
        logoPosition="bottom-right" // Set a valid logoPosition
        terrain={undefined} // Ensure terrain is explicitly undefined
      />
    </MapRoot>
  );
});

// ----------------------------------------------------------------------

const MapRoot = styled('div')({
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
});
