import React, {ReactNode} from 'react';

export const Container = ({children}: {children: ReactNode}) => {
  return (
    <div className="w-full max-w-[120rem] mx-auto px-3 md:px-[4rem] lg:px-[7rem] xl:px-[10rem] 2xl:px-[12rem] relative">
      {children}
    </div>
  );
};
