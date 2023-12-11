import React, {FC} from 'react';
import {statesList} from '@utils/Constants';

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
      {inputType === 'textarea' ? (
        <textarea
          className="block placeholder:text-[#303541] resize-none border w-full pt-3 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
          name={name}
          rows={6}
          placeholder={placeHolder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      ) : inputType === 'select' ? (
        <select
          className="block placeholder:text-[#303541] border w-full h-14 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeHolder}
        >
          {!formik.values[name] && <option value="state">State*</option>}
          {statesList.map(stateName => (
            <option key={stateName} value={stateName}>
              {stateName}
            </option>
          ))}
        </select>
      ) : (
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
      )}
      {formik.touched[name] && formik.errors[name] ? (
        <p className="text-red-500">{formik.errors[name]}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
