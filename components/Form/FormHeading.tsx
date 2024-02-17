import React, {FC} from 'react';

interface FormHeadingProps {
  text: string;
}

const FormHeading: FC<FormHeadingProps> = ({text}) => {
  return (
    <h4 className="text-headingColor my-6 text-lg font-normal capitalize inline-block border-b border-[#ddd] after:mt-1 after:block after:w-1/2 after:h-1 after:bg-primary-500">
      {' '}
      {text}
    </h4>
  );
};

export default FormHeading;
