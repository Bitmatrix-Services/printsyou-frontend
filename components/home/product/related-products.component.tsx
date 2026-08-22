import React, {FC} from 'react';
import {EnclosureProduct} from '@components/home/product/product.types';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import {Navigation} from 'swiper/modules';
import {ProductCard} from '@components/home/product/product-card.component';
import Typography from '@mui/joy/Typography';
import {Button} from '@components/globals/button.component';

interface IRelatedProductsSection {
  relatedProducts: EnclosureProduct[] | null;
}

export const RelatedProductsSection: FC<IRelatedProductsSection> = ({relatedProducts}) => {
  return (
    <section className="bg-white">
      {relatedProducts && relatedProducts.length > 0 ? (
        <div className="relative w-full mx-auto py-4 px-12">
          <Typography id="related-products" className="font-bold text-lg">
            You may also like:
          </Typography>
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
                <div className="relative max-w-full h-full p-1" style={{overflow: 'visible'}}>
                  <ProductCard product={product} imagePriority={false} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Button
            variant="icon"
            className="swiper-nav-prev absolute left-1 top-1/2 -translate-y-1/2"
            aria-label="Previous"
          >
            <IoIosArrowBack size={20} />
          </Button>
          <Button
            variant="icon"
            className="swiper-nav-next absolute right-1 top-1/2 -translate-y-1/2"
            aria-label="Next"
          >
            <IoIosArrowForward size={20} />
          </Button>
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
