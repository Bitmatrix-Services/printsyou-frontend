import React, {FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface petDetailsProps {
  image: string;
  name: string;
  link: string;
}

export const PetsCard: FC<petDetailsProps> = ({image, name, link}) => {
  return (
    <>
      <div className="tp-product group relative bg-white border border-[#edeff2]">
        <div className="p-6">
          <Link href={link} className="block relative h-52 w-52 group">
            <Image
              fill
              className=" w-full h-full hover:scale-110 transition duration-300"
              src={image}
              alt="..."
            />
          </Link>
          <Link href={link} className="block mt-4 text-xl ">
            {name}
          </Link>
        </div>

        <Link href={link} className="border-t border-[#edeff2] flex">
          <div className="py-2 flex-1 flex gap-3 items-center px-6 group-hover:bg-primary-500 group-hover:text-white">
            <div className="as-low text-xs font-semibold mr-auto">
              Call for Pricing
            </div>
          </div>
          <div className="h-16 w-16 flex items-center justify-center bg-white group-hover:bg-black group-hover:border-black group-hover:text-white border-l border-[#edeff2]">
            <Image
              sizes=""
              style={{position: 'relative'}}
              layout="resposive"
              width={25}
              height={25}
              className="object-contain "
              src="/assets/icon-phone.png"
              alt="..."
            />
          </div>
        </Link>
      </div>
    </>
  );
};
