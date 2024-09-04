import {IoMdStar, IoMdStarHalf, IoMdStarOutline} from 'react-icons/io';
import {FC} from 'react';

interface IViewRating {
  rating: number;
  totalReviews?: number;
}

export const ViewRating: FC<IViewRating> = ({rating, totalReviews}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const totalStars = 5;

  return (
    <>
      <div className="flex gap-1">
        {[...Array(fullStars)].map((_, index) => (
          <IoMdStar key={index} className="text-primary-500 w-6 h-6" />
        ))}
        {hasHalfStar && <IoMdStarHalf className="text-primary-500 w-6 h-6" />}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <IoMdStarOutline key={index} className="text-primary-500 w-6 h-6" />
        ))}
      </div>
      {totalReviews && (
        <>
          <h3 className="text-base font-semibold capitalize ">{rating} star rating</h3>
          <div className="text-sm font-normal text-mute3">({totalReviews} user feedback)</div>
        </>
      )}
    </>
  );
};
