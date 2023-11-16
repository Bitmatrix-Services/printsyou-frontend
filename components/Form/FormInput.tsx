import React, {FC} from 'react';

interface FormInputProps {
  name: string;
  placeHolder: string;
  type: string;
  inputType?: string;
  formik: any;
  handleOnBlur?: () => void;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<FormInputProps> = ({
  name,
  placeHolder,
  type,
  inputType,
  formik,
  handleOnBlur,
  handleOnChange
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
          onChange={e =>
            handleOnChange ? handleOnChange(e) : formik.handleChange(e)
          }
          onBlur={e => {
            formik?.handleBlur(e);
            handleOnBlur && handleOnBlur();
          }}
        />
      ) : (
        <textarea
          className="block placeholder:text-[#303541] resize-none border w-full pt-3 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
          name={name}
          rows={6}
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
