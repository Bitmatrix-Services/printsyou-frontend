import React, {FC} from 'react';
import {getIn} from 'formik';
import {statesList} from '@utils/Constants';

interface FormInputProps {
  name: string;
  label: string;
  placeHolder: string;
  type: string;
  inputType?: string;
  formik: any;
  required?: boolean;
  handleOnBlur?: () => void;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<FormInputProps> = ({
  name,
  label,
  placeHolder,
  type,
  inputType,
  formik,
  required,
  handleOnBlur,
  handleOnChange
}) => {
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
          <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-secondary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[20%] peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
            {label}
            {required && <span className="text-red-600">*</span>}
          </label>
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
            placeholder={placeHolder}
          >
            {/* {!value && <option value="choose a state" className='text-gray-500'>Choose a State</option>} */}
            {statesList.map(stateName => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
          <label
            className={`absolute text-sm ${
              isTouched && isError ? 'text-red-500' : 'text-gray-500'
            } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-secondary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[55%] peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
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
            onChange={e =>
              handleOnChange ? handleOnChange(e) : formik.handleChange(e)
            }
            onBlur={e => {
              formik?.handleBlur(e);
              handleOnBlur && handleOnBlur();
            }}
          />
          <label
            className={`absolute text-sm ${
              isTouched && isError ? 'text-red-500' : 'text-gray-500'
            } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-secondary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[55%] peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      )}
      {isTouched && isError ? (
        <p className="text-red-500 text-sm font-normal mt-1">{isError}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
