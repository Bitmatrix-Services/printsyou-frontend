import React, {FC} from 'react';
import {getIn} from 'formik';
import {statesList} from '@utils/constants';
import {v4 as uuidv4} from 'uuid';

interface FormInputProps {
  name: string;
  label: string;
  placeHolder: string;
  type: string;
  inputType?: string;
  formik: any;
  required?: boolean;
  handleOnBlur?: () => void;
  handleOnChange?: (_: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<FormInputProps> = ({name, placeHolder, type, inputType, formik, handleOnBlur, handleOnChange}) => {
  const isError = getIn(formik.errors, name);
  const isTouched = getIn(formik.touched, name);
  const value = getIn(formik.values, name);

  return (
    <div>
      {inputType === 'textarea' ? (
        <div className="relative">
          <textarea
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500 ${
              isTouched && isError && 'border-red-500'
            } peer`}
            name={name}
            rows={6}
            placeholder={placeHolder}
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      ) : inputType === 'select' ? (
        <div className="relative">
          <select
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500 ${
              isTouched && isError ? 'border-red-500' : ''
            } peer`}
            name={name}
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {/* {!value && <option value="choose a state" className='text-gray-500'>Choose a State</option>} */}
            {statesList.map(state => (
              <option key={uuidv4()} value={state.value}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="relative">
          <input
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500 ${
              isTouched && isError && 'border-red-500'
            } peer`}
            type={type}
            name={name}
            placeholder={placeHolder}
            value={value}
            onChange={e => (handleOnChange ? handleOnChange(e) : formik.handleChange(e))}
            onBlur={e => {
              formik?.handleBlur(e);
              handleOnBlur && handleOnBlur();
            }}
          />
        </div>
      )}
      {isTouched && isError ? <p className="text-red-500 text-sm font-normal mt-1">{isError}</p> : null}
    </div>
  );
};

export default FormInput;
