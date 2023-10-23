import React, {FC, ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import Tooltip, {TooltipProps, tooltipClasses} from '@mui/material/Tooltip';

const BootstrapTooltip = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} arrow classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: theme.typography.pxToRem(16)
  }
}));

interface TootipBlackProps {
  title: string;
  children: ReactNode;
}

const TootipBlack: FC<TootipBlackProps> = ({title, children}) => {
  return (
    <BootstrapTooltip title={title}>
      <div>{children}</div>
    </BootstrapTooltip>
  );
};

export default TootipBlack;
