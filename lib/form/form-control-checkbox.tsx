import {Controller} from 'react-hook-form';
import React, {FC, ReactNode} from 'react';
import {Checkbox, FormHelperText} from '@mui/joy';
import Typography from '@mui/joy/Typography';

interface IFormControlCheckbox {
  label: string | ReactNode;
  name: string;
  control: any;
  size?: 'md' | 'sm' | 'lg';
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  errors?: any;
  linkUrl?: string;
  linkTitle?: string;
}

export const FormControlCheckbox: FC<IFormControlCheckbox> = ({
  label,
  name,
  control,
  isRequired = false,
  disabled = false,
  errors,
  linkUrl,
  linkTitle
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired
      }}
      render={({field: {onChange, value}}) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 flex-wrap break-words">
            <Checkbox
              sx={{
                color: isRequired && errors[name]?.message ? 'red' : 'inherit'
              }}
              label={label}
              size="md"
              name={name}
              disabled={disabled}
              value={value}
              onChange={onChange}
            />
          </div>
          {linkUrl ? (
            <FormHelperText sx={{marginLeft: '1.9rem'}}>
              <Typography level="body-sm">
                <span className="text-blue-500 cursor-pointer" onClick={() => window.open(linkUrl, '_blank')}>
                  {linkTitle}
                </span>
              </Typography>
            </FormHelperText>
          ) : null}
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
