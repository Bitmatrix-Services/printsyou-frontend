import React, {FC} from 'react';
import {EnclosureProduct} from '@components/home/product/product.types';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {Navigation} from 'swiper/modules';
import {ProductCard} from '@components/home/product/product-card.component';
import Typography from '@mui/joy/Typography';

interface IRelatedProductsSection {
  relatedProducts: EnclosureProduct[] | null;
}

export const RelatedProductsSection: FC<IRelatedProductsSection> = ({relatedProducts}) => {
  // useEffect(() => {
  //   // Create or update the ld+json script
  //   let script = document.getElementById('RelatedProductsJSON');
  //
  //   if (!script) {
  //     script = document.createElement('script');
  //     script.id = 'RelatedProductsJSON';
  //     script.setAttribute('type', 'application/ld+json');
  //     document.head.appendChild(script);
  //   }
  //
  //   // Generate JSON-LD data
  //   script.innerHTML = JSON.stringify({
  //     '@context': 'http://schema.org',
  //     '@type': 'ItemList',
  //     itemListElement: (relatedProducts ?? []).map((product, index) => ({
  //       '@type': 'ListItem',
  //       position: index + 1,
  //       item: {
  //         '@type': 'Product',
  //         name: product.productName,
  //         image: product.imageUrl,
  //         sku: product.sku,
  //         offers: {
  //           '@type': 'Offer',
  //           priceCurrency: 'USD',
  //           price: product.salePrice || product.minPrice,
  //           availability: 'http://schema.org/InStock',
  //           itemCondition: 'http://schema.org/NewCondition',
  //           url: `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`
  //         }
  //       }
  //     }))
  //   });
  // }, [relatedProducts]);

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
                // Screens larger than 1024px
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 2,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                },
                0: {
                  slidesPerView: 1,
                  spaceBetween: 12,
                }
              }}
          >
            {relatedProducts.map(product => (
              <SwiperSlide key={product.id}>
                <div className="relative max-w-full p-1" style={{aspectRatio: '3 / 4'}}>
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className="swiper-nav-prev absolute -bottom-10 left-4 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition z-10 shadow-md"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            className="swiper-nav-next absolute -bottom-10 right-4 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition z-10 shadow-md"
            aria-label="Next"
          >
            →
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
