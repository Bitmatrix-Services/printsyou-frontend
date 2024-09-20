import React, {useState} from 'react';
import {Box, IconButton} from '@mui/joy';
import {IoMdStar, IoMdStarOutline} from 'react-icons/io';

interface RatingStarProps {
  value?: number;
  onChange?: (_: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStar: React.FC<RatingStarProps> = ({value = 0, onChange, max = 5, size = 'sm'}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (onChange) {
      onChange(index + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <Box display="flex">
      {[...Array(max)].map((_, index) => (
        <IconButton
          key={index}
          variant="plain"
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          sx={{
            color:
              hoverValue !== null
                ? index < hoverValue
                  ? 'warning.main'
                  : 'grey.400'
                : index < value
                  ? 'warning.main'
                  : 'grey.400',
            fontSize: size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : '2rem'
          }}
        >
          {index < (hoverValue !== null ? hoverValue : value) ? <IoMdStar /> : <IoMdStarOutline />}
        </IconButton>
      ))}
    </Box>
  );
};

export default RatingStar;
