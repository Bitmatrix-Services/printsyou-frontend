import React, {FC} from 'react';
import {FormikProps} from 'formik';

interface FormInputProps {
  name: string;
  placeHolder: string;
  type: string;
  inputType?: string;
  tooltip?: string;
  formik: any;
}

const FormInput: FC<FormInputProps> = ({
  name,
  placeHolder,
  type,
  inputType,
  tooltip,
  formik
}) => {
  return (
    <>
      {inputType !== 'textarea' ? (
        <input
          className="block border w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
          type={type}
          name={name}
          data-tooltip-trigger="hover"
          data-tooltip-target={name}
          placeholder={placeHolder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      ) : (
        <textarea
          className="block resize-none border w-full h-14 pt-3 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
          name={name}
          placeholder={placeHolder}
          data-tooltip-target={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      )}
      {tooltip && (
        <div
          id={name}
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          {tooltip}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
      {formik.touched[name] && formik.errors[name] ? (
        <p className="text-red-500">{formik.errors[name]}</p>
      ) : null}
    </>
  );
};

export default FormInput;
