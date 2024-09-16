import {Controller} from 'react-hook-form';
import React, {FC} from 'react';
import {Select, selectClasses} from '@mui/joy';
import {MdOutlineKeyboardArrowDown} from 'react-icons/md';
import {statesList} from '@utils/constants';
import Option from '@mui/joy/Option';
import {v4 as uuidv4} from 'uuid';
import {deepFind} from '@utils/utils';

interface IFormControlSelect {
  label?: string;
  name: string;
  control: any;
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  errors?: any;
}

export const FormControlSelect: FC<IFormControlSelect> = ({
  label,
  name,
  control,
  placeholder,
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
        <div>
          {label ? (
            <div className="flex">
              <h4 className="text-sm text-mute4 font-normal mb-2">{label}</h4>
              {isRequired && <span className="text-red-600">*</span>}
            </div>
          ) : null}

          <Select
            placeholder={placeholder}
            indicator={<MdOutlineKeyboardArrowDown />}
            sx={{
              borderRadius: '3px 3px  3px 3px',
              height: '2.7rem',
              '& select::placeholder': {
                color: 'gray',
                fontSize: 'sm'
              },
              [`& .${selectClasses.indicator}`]: {
                transition: '0.2s',
                [`&.${selectClasses.expanded}`]: {
                  transform: 'rotate(-180deg)'
                }
              }
            }}
            disabled={disabled}
            value={value}
            onChange={(event, value) => onChange(value)}
          >
            {statesList.map(state => (
              <Option key={uuidv4()} value={state.value}>
                {state.name}
              </Option>
            ))}
          </Select>

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
