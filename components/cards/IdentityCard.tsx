import React, { FC } from "react";
import Image from "next/image";

interface IdentityCardProps {
  image: string;
  heading: string;
}

const IdentityCard: FC<IdentityCardProps> = ({ image, heading }) => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center">
        <div className="h-20 w-20 min-w-[5rem] relative">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            className="object-contain"
            src={image}
            alt="..."
          />
        </div>
        <h6 className="mt-4 text-white font-semibold text-base">{heading}</h6>
      </div>
    </div>
  );
};

export default IdentityCard;
