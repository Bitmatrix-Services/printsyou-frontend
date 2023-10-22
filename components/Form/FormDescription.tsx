import React, {FC} from 'react';

interface FormDescriptionProps {
  textArray: string[];
}

const FormDescription: FC<FormDescriptionProps> = ({textArray}) => {
  return textArray?.map(item => (
    <p key={item} className="text-mute text-sm mb-4">
      {item}
    </p>
  ));
};

export default FormDescription;
