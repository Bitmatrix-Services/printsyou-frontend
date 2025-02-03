import {CircularLoader} from '@components/globals/circular-loader.component';
import React, {FC, useEffect} from 'react';

interface LoaderWithBackdropProps {
  loading: boolean;
}

export const LoaderWithBackdrop: FC<LoaderWithBackdropProps> = ({loading}) => {
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <CircularLoader />
        <p className="text-white mt-4">Loading...</p>
      </div>
    </div>
  ) : null;
};
