import {Controller} from 'react-hook-form';
import React, {FC, ReactNode} from 'react';
import {Checkbox} from '@mui/joy';

interface IFormControlCheckbox {
  label: string | ReactNode;
  name: string;
  control: any;
  size?: 'md' | 'sm' | 'lg';
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  errors?: any;
}

export const FormControlCheckbox: FC<IFormControlCheckbox> = ({
  label,
  name,
  control,
  isRequired = false,
  disabled = false,
  errors
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired
      }}
      render={({field: {onChange, value}}) => (
        <div className="flex items-center">
          <Checkbox label={label} size="md" name={name} disabled={disabled} value={value} onChange={onChange} />
          {isRequired && errors[name]?.message ? (
            <div className="flex justify-start mt-2">
              <p className="text-red-600">{errors[name]?.message}</p>
            </div>
          ) : null}
        </div>
      )}
    />
  );
};
