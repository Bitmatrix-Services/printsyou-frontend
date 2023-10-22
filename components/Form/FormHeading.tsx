import React, {FC} from 'react';

interface FormHeadingProps {
  text: string;
}

const FormHeading: FC<FormHeadingProps> = ({text}) => {
  return <h4 className="text-xl font-bold my-5"> {text}</h4>;
};

export default FormHeading;
