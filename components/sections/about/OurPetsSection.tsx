import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

import Container from '../../globals/Container';
import {PetsCard} from '@components/cards/PetsCard';

const OurPetsSection = () => {
  const petsDetails = [
    {
      name: 'Bruno',
      imageSrc: '/assets/pet-1.jpg',
      link: '#'
    },
    {
      name: 'Bean',
      imageSrc: '/assets/pet-2.jpg',
      link: '#'
    },
    {
      name: 'Fifi',
      imageSrc: '/assets/pet-3.jpg',
      link: '#'
    },
    {
      name: 'Hank',
      imageSrc: '/assets/pet-4.jpg',
      link: '#'
    },
    {
      name: 'Bruno',
      imageSrc: '/assets/pet-1.jpg',
      link: '#'
    }
  ];
  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    },

    600: {
      slidesPerView: 2,
      spaceBetween: 10
    },

    800: {
      slidesPerView: 3,
      spaceBetween: 20
    },

    1024: {
      slidesPerView: 4,
      spaceBetween: 20
    }
  };

  return (
    <section className="bg-white py-8 lg:pb-16 lg:pt-9">
      <Container>
        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-6">
          <h2 className="text-3xl lg:text-[28px] font-bold capitalize text-center mb-5 md:text-left md:mr-auto">
            Meet our Pets
          </h2>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation
          breakpoints={breakpoints}
          className="featured-swiper"
        >
          {petsDetails.map((petDetail, index) => (
            <SwiperSlide key={index}>
              <PetsCard
                image={petDetail.imageSrc}
                name={petDetail.name}
                link={petDetail.link}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default OurPetsSection;
