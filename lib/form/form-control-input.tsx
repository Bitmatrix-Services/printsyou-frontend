import {Controller} from 'react-hook-form';
import React, {FC} from 'react';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';

interface IFormControlInput {
  label?: string;
  name: string;
  control: any;
  size?: 'md' | 'sm' | 'lg';
  placeholder?: string;
  inputType?: 'textField' | 'textarea';
  disabled?: boolean;
  isRequired?: boolean;
  errors?: any;
}

export const FormControlInput: FC<IFormControlInput> = ({
  label,
  name,
  control,
  placeholder,
  isRequired = false,
  disabled = false,
  inputType = 'textField',
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
        <div>
          {label ? (
            <div className="flex">
              <h4 className="text-sm text-mute4 font-normal mb-2">{label}</h4>
              {isRequired && <span className="text-red-600">*</span>}
            </div>
          ) : null}
          {inputType === 'textField' ? (
            <Input
              sx={{
                borderRadius: '3px 3px  3px 3px',
                height: '2.7rem',
                '& input::placeholder': {
                  color: 'gray',
                  fontSize: 'sm'
                },
                '&:focus': {
                  borderColor: '#DB0481'
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              onChange={onChange}
            />
          ) : inputType === 'textarea' ? (
            <Textarea
              sx={{
                borderRadius: '3px 3px  3px 3px',
                '& input::placeholder': {
                  color: 'gray',
                  fontSize: 'sm'
                },
                '&:focus': {
                  borderColor: '#DB0481'
                }
              }}
              minRows={6}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              onChange={onChange}
            />
          ) : null}
          {errors && errors[name]?.message ? (
            <div className="flex justify-start mt-2">
              <p className="text-red-600">{errors[name]?.message}</p>
            </div>
          ) : null}
        </div>
      )}
    />
  );
};
