import Image from 'next/image';
import {ViewRating} from '@components/globals/view-rating.component';
import React from 'react';

export const CustomerReviewItem = () => {
  return (
    <div className="flex items-start gap-2 flex-col">
      <div className="flex items-center gap-3">
        <div className="rounded-2">
          <Image
            width={50}
            height={50}
            className="object-contain rounded-2"
            src={'/assets/cat-image.jpg'}
            alt={'image.alt'}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className=" font-bold">Emily Selmon </span>
            <span className="text-sm font-normal text-mute3">2 min ago</span>
          </div>
          <div className="mt-2 flex gap-1">
            <ViewRating rating={4} />
          </div>
        </div>
      </div>
      <p className="text-sm font-normal text-mute3">
        You made it so simple. My new site is so much faster and easier to work with than my old sit. I am just choose
        the page, make the changes that can make you too.
      </p>
    </div>
  );
};
