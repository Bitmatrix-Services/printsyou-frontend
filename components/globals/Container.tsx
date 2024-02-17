import React, {ReactNode} from 'react';

const Container = ({children}: {children: ReactNode}) => {
  return (
    <div className="max-w-[120rem] mx-auto px-4 md:px-8 xl:px-24 relative">
      {children}
    </div>
  );
};

export default Container;
