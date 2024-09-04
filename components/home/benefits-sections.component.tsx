import {Container} from '@components/globals/container.component';
import {SectionHeading} from '@components/home/section-heading.component';
import Image from 'next/image';

export const Benefits = () => {
  return (
    <section>
      <Container>
        <SectionHeading title="Benefits of Choosing PrintsYou" />
        <div className="py-8 lg:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-20">
          <div className="col sm:col-span-2 lg:col-span-1 text-center">
            <Image
              width={102}
              height={102}
              className="mx-auto mb-2 min-h-[6.375rem] h-[6.375rem] max-h-[6.375rem]"
              src="/assets/b-icon-1.svg"
              alt="fff"
            />
            <h3 className="mb-2 text-xl text-black font-semibold">Thousands of vendors</h3>
            <i className="text-md font-light text-black ">
              A large number of retail establishments, potentially ranging from small local shops to large chain stores.
              These stores could offer a variety of products and services, catering to diverse customer needs. The
              phrase highlights the vastness and diversity of the retail landscape, suggesting extensive shopping
              options available to consumers.
            </i>
          </div>
          <div className="col text-center">
            <Image
              width={102}
              height={102}
              className="mx-auto mb-2 min-h-[6.375rem] h-[6.375rem] max-h-[6.375rem]"
              src="/assets/b-icon-2.svg"
              alt="fff"
            />
            <h3 className="mb-2 text-xl text-black font-semibold">100% Trusted by customers and store owners</h3>
            <i className="text-md font-light text-black italic">
              Trusted by customers and store owners, our products consistently deliver quality
            </i>
          </div>
          <div className="col text-center">
            <Image
              width={102}
              height={102}
              className="mx-auto mb-2 min-h-[6.375rem] h-[6.375rem] max-h-[6.375rem]"
              src="/assets/b-icon-3.png"
              alt="fff"
            />
            <h3 className="mb-2 text-xl text-black font-semibold">Easy Checkout & payment system</h3>
            <i className="text-md font-light text-black  ">
              Streamlined platform designed to simplify and expedite the online shopping
            </i>
          </div>
        </div>
      </Container>
    </section>
  );
};
