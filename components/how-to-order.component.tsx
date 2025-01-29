'use client';
import React, {Fragment, useEffect} from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Container} from '@components/globals/container.component';
import {aosGlobalSetting} from '@utils/constants';
import {Breadcrumb} from '@components/globals/breadcrumb.component';

export const HowToOrderComponent = () => {
  useEffect(() => {
    AOS.init(aosGlobalSetting);
  }, []);

  return (
    <section>
      <Breadcrumb list={[]} prefixTitle="How to Order" />
      <Container>
        <div className="py-12">
          <h1 className="text-xl lg:text-2xl xl:text-3xl text-center font-bold mr-auto capitalize">how to order</h1>
          <h2 className="text-mute text-xl font-medium text-center mt-4">
            Understanding that custom ordering might seem daunting, we are dedicated to assisting and navigating you
            through every step.
          </h2>
        </div>
        <div className="space-y-12 relative scroll-container py-12">
          {orderSteps.map((order, index) => (
            <Fragment key={order.title}>
              {index % 2 === 0 ? (
                <figure className="flex flex-row items-center justify-center px-[5%] md:px-[10%] lg:px-0 xl:px-[10%]">
                  <div className="w-full lg:w-[55%] lg:pr-20 xl:pr-32" data-aos="zoom-in-up">
                    <h3 className="sub-title text-xl font-bold text-primary-500 mb-3">Step {index + 1}</h3>
                    <h4 className="title text-3xl font-semibold mb-4">{order.title}</h4>
                    <p className="text-mute text-lg">{order.description}</p>
                  </div>
                  <div className="w-[30%] hidden lg:block">
                    <div className="h-full w-full border-r-4 border-primary-500">
                      <Image
                        data-aos="fade-down-left"
                        className="object-cover"
                        height={500}
                        width={500}
                        quality={100}
                        src={order.imageUrl}
                        alt="order"
                      />
                    </div>
                  </div>
                </figure>
              ) : (
                <figure className="flex flex-row items-center justify-center px-[5%] md:px-[10%] lg:px-0 xl:px-[10%]">
                  <div className="w-[55%] pr-20 xl:pr-32 hidden lg:block">
                    <div className="h-full w-[85%] border-l-4 border-primary-500">
                      <Image
                        data-aos="fade-down-right"
                        className="object-cover"
                        height={500}
                        width={500}
                        quality={100}
                        src={order.imageUrl}
                        alt="order"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-[30%]" data-aos="zoom-in-up">
                    <h3 className="sub-title text-xl font-bold text-primary-500 mb-3">Step {index + 1}</h3>
                    <h4 className="title text-3xl font-semibold mb-4">{order.title}</h4>
                    <p className="text-mute text-lg">{order.description}</p>
                  </div>
                </figure>
              )}
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};

const orderSteps = [
  {
    title: 'Start Your Order',
    description:
      'Explore our curated product catalog and find an item that catches your eye. Click on a product to access detailed information, including its features, variants, and pricing, to help you make an informed decision.',
    imageUrl: '/assets/o-step-1.png'
  },
  {
    title: 'Know What You’re Getting',
    description:
      'Upon selecting a product, you will be directed to its detailed product page, where you can view multiple images highlighting different colors and variants. You will have the option to choose from various color and variant selections, review the comprehensive product description, and explore additional details such as specifications and pricing.',
    imageUrl: '/assets/o-step-2.png'
  },
  {
    title: 'Proceed to Checkout!',
    description:
      'By clicking the "Order Now" button, you\'ll be taken to the checkout page, where you\'ll enter your shipping and billing details. This includes selecting product specifications, providing your address, and reviewing the product details and total cost before completing your purchase.',
    imageUrl: '/assets/o-step-3.png'
  },
  {
    title: 'Choose product specification!',
    description:
      'Enter the product details, including the quantity, item type, color, size, and imprint color. You can also upload a design file for printing on the product. Please make sure all information is accurate and complete before proceeding with your order.',
    imageUrl: '/assets/o-step-4.png'
  },
  {
    title: "Where It's Going?",
    description:
      'Fill in your shipping information so your products can find their way to you. You can have different billing and shipping addresses. Double-check your address to avoid any delivery mishaps.',
    imageUrl: '/assets/o-step-5.png'
  },
  {
    title: 'Click to Complete',
    description:
      'Enter your expected delivery date and any additional order details. Once you’ve reviewed all your information and are satisfied, click the submit button to complete your order. Please note, before submitting, you must agree to our terms and conditions. Your order will be on its way!',
    imageUrl: '/assets/o-step-6.png'
  }
];
