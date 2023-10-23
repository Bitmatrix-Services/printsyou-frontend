import React, {FC} from 'react';
import {FormikProps} from 'formik';

interface FormInputProps {
  name: string;
  placeHolder: string;
  type: string;
  inputType?: string;
  formik: any;
}

const FormInput: FC<FormInputProps> = ({
  name,
  placeHolder,
  type,
  inputType,
  formik
}) => {
  return (
    <div>
      {inputType !== 'textarea' ? (
        <input
          className="block placeholder:text-[#303541] border w-full h-14 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
          type={type}
          name={name}
          placeholder={placeHolder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      ) : (
        <textarea
          className="block resize-none border w-full h-14 pt-3 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
          name={name}
          rows={4}
          cols={8}
          placeholder={placeHolder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      )}
      {formik.touched[name] && formik.errors[name] ? (
        <p className="text-red-500">{formik.errors[name]}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
