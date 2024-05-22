import CircularProgress from '@mui/material/CircularProgress';
import {FC} from 'react';

interface ICircularLoader {
  color?: string;
  size?: number;
}

export const CircularLoader: FC<ICircularLoader> = ({
  color = '#FFDE57',
  size = 45
}) => {
  return <CircularProgress style={{color: color}} size={size} />;
};
