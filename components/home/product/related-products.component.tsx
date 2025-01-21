import React, {FC} from 'react';
import {EnclosureProduct} from '@components/home/product/product.types';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import {Navigation} from 'swiper/modules';
import {ProductCard} from '@components/home/product/product-card.component';
import Typography from '@mui/joy/Typography';

interface IRelatedProductsSection {
  relatedProducts: EnclosureProduct[] | null;
}

export const RelatedProductsSection: FC<IRelatedProductsSection> = ({relatedProducts}) => {
  return (
    <section className="bg-white py-8 md:py-10 lg:py-16">
      {relatedProducts && relatedProducts.length > 0 ? (
        <div className="relative w-full mx-auto py-4">
          <Typography className="font-bold text-lg">You may also like:</Typography>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: `.swiper-nav-next`,
              prevEl: `.swiper-nav-prev`
            }}
            loop={true}
            slidesPerView={5}
            spaceBetween={2}
            breakpoints={{
              1024: {
                slidesPerView: 5,
                spaceBetween: 2
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 2
              },
              0: {
                slidesPerView: 2,
                spaceBetween: 2
              }
            }}
          >
            {relatedProducts.map(product => (
              <SwiperSlide key={product.id}>
                <div className="relative max-w-full p-1" style={{overflow: 'visible', height: 'auto'}}>
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className="swiper-nav-prev absolute -left-2.5 top-1/2 transform -translate-y-1/2 z-10"
            aria-label="Previous"
          >
            <IoIosArrowBack
              size={48}
              className="p-2 bg-transparent text-blue-600 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition"
            />
          </button>
          <button
            className="swiper-nav-next absolute -right-2.5 top-1/2 transform -translate-y-1/2 z-10"
            aria-label="Next"
          >
            <IoIosArrowForward
              size={48}
              className="p-2 bg-transparent text-blue-600 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition"
            />
          </button>
        </div>
      ) : (
        <div className="m-16 flex items-center justify-center">
          <h4 className="text-xl text-gray-600">No Related Products Found</h4>
        </div>
      )}
    </section>
  );
};

export default RelatedProductsSection;
