import * as React from 'react';
import {FC} from 'react';

interface ILinearProgressWithLabel {
  progress: number;
}

const LinearProgressWithLabel: FC<ILinearProgressWithLabel> = ({progress}) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 my-2">
      <div
        className="bg-primary-500 h-2 rounded-full flex items-center justify-center text-xs text-white font-bold"
        style={{width: `${progress}%`}}
      ></div>
    </div>
  );
};

export default LinearProgressWithLabel;
