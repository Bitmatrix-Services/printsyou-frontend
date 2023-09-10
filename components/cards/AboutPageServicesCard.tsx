import React, {FC} from 'react';
import Image from 'next/image';

interface ServicesCardProps {
  image: string;
  heading: string;
  text: string;
}

const AboutPageServicesCard: FC<ServicesCardProps> = ({
  image,
  heading,
  text
}) => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center pt-2 pb-2 px-7 ">
        <div className="h-20 w-20 min-w-[5rem] relative  mb-5">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw "
            fill
            className="object-contain"
            style={{color: '#febe40'}}
            src={image}
            alt="..."
          />
        </div>
        <h6 className="mt-4 font-bold text-base mb-5">{heading}</h6>
        <div className="text-mute3 font-medium text-[14px] leading-6 px-3">
          {text}
        </div>
      </div>
    </div>
  );
};

export default AboutPageServicesCard;
