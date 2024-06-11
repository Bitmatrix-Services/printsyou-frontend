import React, {Fragment, useEffect} from 'react';
import Container from '@components/globals/Container';
import {NextSeo} from 'next-seo';
import {aosGlobalSetting, metaConstants} from '@utils/Constants';
import Image from 'next/image';
import AOS from 'aos';

import 'aos/dist/aos.css';

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

const HowToOrderPage = () => {
  useEffect(() => {
    AOS.init(aosGlobalSetting);
  }, []);

  return (
    <section className="bg-white pt-3 pb-10 lg:py-5">
      <NextSeo title={`How to Order | ${metaConstants.SITE_NAME}`} />
      <Container>
        <div className="py-12">
          <div className="text-2xl mb-5 font-bold text-center">
            How To Order
          </div>
          <p className="text-mute text-xl font-medium text-center">
            Understanding that custom ordering might seem daunting, we're
            dedicated to assisting and navigating you through every step.
          </p>
        </div>
        <div className="space-y-12 relative scroll-container py-12 md:ml-[6rem]">
          {orderSteps.map((order, index) => (
            <Fragment key={order.title}>
              {index % 2 === 0 ? (
                <figure className="scroll-step-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:space-x-52">
                  <div className="col self-center" data-aos="zoom-in-up">
                    <h6 className="sub-title tetx-xl text-primary-500 mb-3">
                      Step {index + 1}
                    </h6>
                    <h3 className="title text-3xl font-semibold mb-4">
                      {order.title}
                    </h3>
                    <p className="text-mute3 text-lg">{order.description}</p>
                  </div>
                  <div className="col lg:col-span-2 hidden lg:block">
                    <div className="h-full w-[47%] border-r-4 border-primary-500">
                      <Image
                        data-aos="fade-down-left"
                        className="object-cover"
                        height={500}
                        width={500}
                        src={order.imageUrl}
                        alt="order"
                      />
                    </div>
                  </div>
                </figure>
              ) : (
                <figure className="scroll-step-1 top-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 md:space-x-52">
                  <div className="col lg:col-span-2 hidden lg:block">
                    <div className="h-full w-full border-l-4 border-primary-500">
                      <Image
                        data-aos="fade-down-right"
                        className="object-cover"
                        height={500}
                        width={500}
                        src={order.imageUrl}
                        alt="order"
                      />
                    </div>
                  </div>
                  <div
                    className="col self-center lg:col-span-2"
                    data-aos="zoom-in-up"
                  >
                    <h6 className="sub-title text-xl text-primary-500 mb-3">
                      Step {index + 1}
                    </h6>
                    <h3 className="title text-3xl font-semibold mb-4">
                      {order.title}
                    </h3>
                    <p className="text-mute3 text-lg">{order.description}</p>
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

export default HowToOrderPage;
