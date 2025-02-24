import {FC} from 'react';
import {productColors} from '@components/home/product/product.types';
import {getContrastColor} from '@utils/utils';

interface IColorSwatch {
  color: productColors | null;
  selectedColor: string;
  onSelect: (_: productColors | null) => void;
}

export const ColorSwatch: FC<IColorSwatch> = ({color, selectedColor, onSelect}) => {
  return (
    <div style={{display: 'flex', gap: '10px', position: 'relative'}}>
      <div
        className={color?.coloredProductImage ? 'hover:cursor-pointer' : ''}
        style={{
          backgroundColor: color?.colorHex,
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '1px solid grey',
          position: 'relative'
        }}
        onClick={() => onSelect(color)}
      />
      {selectedColor === color?.colorName && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            color: getContrastColor(color.colorHex),
            fontWeight: 'bold'
          }}
        >
          ✔
        </div>
      )}
    </div>
  );
};
