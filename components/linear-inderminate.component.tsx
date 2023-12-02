import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {useAppSelector} from '@store/hooks';
import {getTopProgressState} from '@store/slices/progress.slice';

export const LinearIndeterminate = () => {
  const isVisible = useAppSelector(getTopProgressState);

  return isVisible ? (
    <LinearProgress
      style={{position: 'fixed', top: '0', width: '100%'}}
      color="primary"
    />
  ) : null;
};
