import {Controller} from 'react-hook-form';
import React, {FC, FocusEventHandler} from 'react';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import {deepFind} from '@utils/utils';

interface IFormControlInput {
  label?: string;
  name: string;
  control: any;
  size?: 'md' | 'sm' | 'lg';
  placeholder?: string;
  inputType?: 'textField' | 'textarea';
  fieldType?: 'text' | 'number';
  disabled?: boolean;
  isRequired?: boolean;
  errors?: any;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const FormControlInput: FC<IFormControlInput> = ({
  label,
  name,
  control,
  placeholder,
  isRequired = false,
  disabled = false,
  inputType = 'textField',
  fieldType = 'text',
  errors,
  onBlur,
  onFocus
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
              {isRequired ? <span className="text-red-600">*</span> : null}
            </div>
          ) : null}
          {inputType === 'textField' ? (
            <Input
              sx={{
                borderRadius: '3px 3px  3px 3px',
                height: '2.7rem',
                minWidth: '15rem',
                '& input::placeholder': {
                  color: 'gray',
                  fontSize: 'sm'
                },
                '&:focus': {
                  borderColor: '#DB0481'
                }
              }}
              type={fieldType}
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
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
              name={name}
              minRows={6}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              onChange={onChange}
            />
          ) : null}
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
