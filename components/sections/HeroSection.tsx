import React from "react";
import Container from "../globals/Container";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const slidesData = [
  {
    backgroundImage: "/assets/banner-1.png",
    title: "Made In the USA Promotional Products",
    bulletPoints: [
      "Made In the USA Promotional Products",
      "Support Our Country",
      "Hundreds of Items To Choose From",
      "All Proudly Made In the USA",
    ],
  },
  {
    backgroundImage: "/assets/banner-2.png",
    title: "Sunglasses",
  },
  {
    backgroundImage: "/assets/banner-3.png",
    title: "Drinkware",
    bulletPoints: ["Bottles", "Mugs", "Tumblers", "And Much More!"],
  },
  {
    backgroundImage: "/assets/banner-4.png",
    title: "Lip Balm",
  },
];

const HeroSection = () => {
  return (
    <section className="bg-greyLight pt-8 lg:pt-20">
      <Container>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="hero-swiper"
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="slide-item bg-center"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                }}
              >
                <div className="h-[25rem] py-6 md:px-20 max-w-[40rem] flex flex-col justify-center text-center">
                  <h3 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-5">
                    {slide.title}
                  </h3>
                  {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                    <div className="list">
                      <ul className="text-white text-base space-y-2">
                        {slide.bulletPoints.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-8">
                    <Link
                      href="!#"
                      className="py-4 px-20 text-sm tracking-[3.5px] font-bold btn-primary"
                    >
                      SHOP NOW
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default HeroSection;
