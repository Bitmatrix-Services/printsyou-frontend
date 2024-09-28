import React, {FC, ReactNode} from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container: FC<ContainerProps> = ({className = '', children}) => {
  return (
    <div
      className={`w-full max-w-[120rem] mx-auto px-3 md:px-[4rem] lg:px-[7rem] xl:px-[10rem] 2xl:px-[12rem] relative ${className}`}
    >
      {children}
    </div>
  );
};
