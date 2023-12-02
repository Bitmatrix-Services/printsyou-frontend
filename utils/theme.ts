import {createTheme} from '@mui/material';
import cssVariables from '../styles/variables.module.scss';

export const theme = createTheme({
  palette: {
    primary: {
      main: cssVariables.primaryColor
    }
  }
});
