import {CircularProgress} from '@mui/joy';
import React, {FC} from 'react';

interface ICircularLoaderProps {
  color?: string;
}

export const CircularLoader: FC<ICircularLoaderProps> = () => {
  return <CircularProgress color="primary" />;
};
