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
      "Click the 'Add to Cart' button on any product page to select items with no immediate payment required. This action requests a quote without any obligation.",
    imageUrl: '/assets/o-step-1.png'
  },
  {
    title: 'Know What You’re Getting',
    description:
      'Enter the necessary details for each product you select. This could include size, color, quantity, or any other specific preferences along with artwork files. Ensure everything is just how you like it!',
    imageUrl: '/assets/o-step-2.png'
  },
  {
    title: 'Sneak Peek of Cart, Ready, Set, Checkout!',
    description:
      'As you shop, keep an eye on your sidebar where your cart summary is displayed. It’s a quick way to see all the goodies you’ve picked up without leaving your current page. Head to the checkout page where every item you picked is listed. This is where you finalize your order.',
    imageUrl: '/assets/o-step-3.png'
  },
  {
    title: 'Update product specification? No Problem!',
    description:
      'Need to adjust your selections? Easily update product details or quantities directly from the checkout page. Make sure everything is perfect before you proceed!',
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
      "Add expected delivery date and addition information about your order and you're done. Review all your details and when everything looks good, hit the submit button. Your order is now on its way!",
    imageUrl: '/assets/o-step-6.png'
  }
];
