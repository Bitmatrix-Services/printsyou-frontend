import {Controller} from 'react-hook-form';
import React, {FC} from 'react';
import {deepFind} from '@utils/utils';
import {IMaskInput} from 'react-imask';

interface IMaskInputProps {
  label?: string;
  name: string;
  control: any;
  size?: 'md' | 'sm' | 'lg';
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  errors?: any;
  autoComplete?: string;
}

export const MaskInput: FC<IMaskInputProps> = ({label, name, control, isRequired = false, errors, autoComplete}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired
      }}
      render={({field: {onChange, value}}) => (
        <div>
          {label ? (
            <div className="flex">
              <h4 className="text-sm text-mute4 font-normal mb-2">{label}</h4>
              {isRequired ? <span className="text-red-600">*</span> : null}
            </div>
          ) : null}

          <IMaskInput
            style={{
              borderRadius: '3px 3px  3px 3px',
              height: '2.7rem',
              padding: '0 12px'
            }}
            className="block border w-full "
            mask="+1 (000) 000-0000"
            placeholder={'+1 (123) 456-7890'}
            name={name}
            value={value}
            radix="-"
            unmask="typed"
            onAccept={onChange}
            autoComplete={autoComplete || 'tel'}
          />
          {isRequired && deepFind(errors ?? {}, name)?.message ? (
            <div className="flex justify-start mt-2">
              <p className="text-red-600">{deepFind(errors ?? {}, name)?.message}</p>
            </div>
          ) : null}
        </div>
      )}
    />
  );
};
