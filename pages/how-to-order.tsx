import React, {useEffect} from 'react';
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
      "Click the 'Add to Cart' button on any product page to select items with no immediate payment required. This action requests a quote without any obligation."
  },
  {
    title: 'Connect with a Sales Rep',
    description:
      'Once you submit your order with all details and artwork, a dedicated sales representative will be assigned to you. They will assist with any questions and guide you through the next steps.'
  },
  {
    title: 'Review and Confirm',
    description:
      "We'll clarify any questions regarding your order and provide a sales confirmation along with an artwork proof for your approval. This document includes a detailed breakdown of all charges, such as shipping, taxes, and setup fees."
  },
  {
    title: 'Customize Your Design',
    description:
      'Adjust the artwork proof freely until you are satisfied with the design.'
  },
  {
    title: 'Finalize Your Order',
    description:
      "Upon approving the artwork and sales confirmation, we will send an invoice with a secure payment link. There's no commitment until you decide to proceed with production, with the option to cancel anytime before production begins."
  },
  {
    title: 'Production and Payment',
    description:
      "After payment is received, we'll initiate the production process. We ensure open communication throughout, allowing for a smooth transition to production when you are ready."
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
        <div className="space-y-12 relative scroll-container py-12">
          {[0, 2, 4].map((order, index) => (
            <>
              <figure className="scroll-step-1 top-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                <div className="col lg:col-span-3 hidden lg:block">
                  <div className="h-full w-full border-l-4 border-primary-500">
                    <Image
                      data-aos="fade-down-right"
                      className="object-cover"
                      height={800}
                      width={800}
                      src={`/assets/h-step-1.svg`}
                      alt="..."
                    />
                  </div>
                </div>
                <div
                  className="col self-center lg:col-span-2"
                  data-aos="zoom-in-up"
                >
                  <h6 className="sub-title text-xl text-primary-500 mb-3">
                    Step {order + 1}
                  </h6>
                  <h3 className="title text-3xl font-semibold mb-4">
                    {orderSteps[index].title}
                  </h3>
                  <p className="text-mute3 text-lg">
                    {orderSteps[index].description}
                  </p>
                </div>
              </figure>
              <figure className="scroll-step-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="col self-center" data-aos="zoom-in-up">
                  <h6 className="sub-title tetx-xl text-primary-500 mb-3">
                    Step {order + 2}
                  </h6>
                  <h3 className="title text-3xl font-semibold mb-4">
                    {orderSteps[index + 1].title}
                  </h3>
                  <p className="text-mute3 text-lg">
                    {orderSteps[index + 1].description}
                  </p>
                </div>
                <div className="col lg:col-span-2 hidden lg:block">
                  <div className="h-full w-full border-r-4 border-primary-500">
                    <Image
                      data-aos="fade-down-left"
                      className="object-cover"
                      height={800}
                      width={800}
                      src={`/assets/h-step-2.svg`}
                      alt="..."
                    />
                  </div>
                </div>
              </figure>
            </>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowToOrderPage;
