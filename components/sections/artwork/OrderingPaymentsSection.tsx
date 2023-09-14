import React from 'react';
import Image from 'next/image';

export const sectionDetials = [
  {
    title: 'Online',
    description:
      'This is the fastest and easiest way to place an order with Identity Links. Simply click on the "Place Order" button under the product to get started. You can fill out all of your information, including shipping, billing, product details and artwork submission. Once you submit this form, your information will be sent to a sales associate. You will then receive an email or phone call regarding your order, as well as a proof of your artwork with the product information that you provide us. We will also provide you with a sales quote regarding your order. Once you approve the order and artwork proof, we will collect your credit card information send your order to production.',
    imageSrc: '/assets/anh1.png'
  },
  {
    title: 'Phone',
    description:
      "Do you prefer to speak with an actual human being when placing your order? We completely understand! That is why you can reach us from Monday to Friday 8 A.M. to 5 P.M. One of our experienced sales associates will walk you through the order process. To make the ordering process a little easier, write down the product you are interested in, the color you would like and the size when applicable. We know that some orders might be more complicated than others so don/'t hesitate to give us a call regarding your order at 888-282-9507.",
    imageSrc: '/assets/anh2.png'
  },
  {
    title: 'Email',
    description:
      "If you just don/'t have the time to fill out the online form or call us, you can shoot us a quick email to info@identity-links.com. Please include as much information as possible about the product you are interested in, such as item number, size, color, quantity and the shipping address. One of our dedicated sales associates will return your email during regular business hours. Any questions that you have regarding your order can be sent via email as well.",
    imageSrc: '/assets/anh3.png'
  },
  {
    title: 'Fax',
    description:
      'Do you love combining the technology of the internet with the fax machine? We find it to be pretty useful as well. Go ahead and print off this order form and fill it out. You can send it back to us via fax at 847-329-9797. We will process your order and respond to your request by the end of the business day. You will also find the fax useful for sending us your credit card authorization form and approval of your proof.',
    imageSrc: '/assets/anh4.png'
  }
];

const OrderingPaymentsSection = () => {
  return (
    <>
      <section className="bg-greyLight pt-2 pb-2 ">
        <div className="pt-2 pb-8 mb-10">
          <div className="text-2xl mb-5 font-bold">Ordering</div>
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
            There are four ways by which you can place an order with Identity
            Links: online, over the phone, by email or by fax. No matter how you
            place your order, our sales associates are ready to make the process
            as easy and quick as possible.
          </p>
        </div>
        <div className="flex flex-wrap gap-6  xl:gap-8 2xl:gap-20 items-center justify-center">
          {sectionDetials.map((detail, index) => (
            <>
              {index % 2 === 0 ? ( // If the index is even, render the title first and then the image
                <>
                  <div
                    key={index}
                    className="mt-16 sm:mt-0 md:basis-[41%]  md:py-12 "
                  >
                    <Image
                      sizes=""
                      style={{position: 'relative'}}
                      layout="resposive"
                      width={437}
                      height={281}
                      className="object-contain w-[85%]"
                      src={detail.imageSrc}
                      alt="..."
                    />
                  </div>
                  <div
                    key={index}
                    className="mt-16 sm:mt-0 md:basis-[55%]  md:py-12"
                  >
                    <h2 className="text-3xl lg:text-[28px] font-bold capitalize  mb-5 md:text-left md:mr-auto">
                      {detail.title}
                    </h2>
                    <div className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins space-y-4">
                      <p> {detail.description}</p>
                    </div>
                  </div>
                </>
              ) : (
                //     // If the index is odd, render the image first and then the title
                <>
                  <div
                    key={index}
                    className="mt-16 sm:mt-0 md:basis-[55%]  md:py-12"
                  >
                    <h2 className="text-3xl lg:text-[28px] font-bold capitalize  mb-5 md:text-left md:mr-auto">
                      {detail.title}
                    </h2>
                    <div className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins space-y-4">
                      <p> {detail.description}</p>
                    </div>
                  </div>
                  <div
                    key={index}
                    className="mt-16 sm:mt-0 md:basis-[41%]  md:py-12"
                  >
                    <Image
                      sizes=""
                      style={{position: 'relative'}}
                      layout="resposive"
                      width={437}
                      height={281}
                      className="object-contain w-[85%]"
                      src={detail.imageSrc}
                      alt="..."
                    />
                  </div>
                </>
              )}
            </>
          ))}
        </div>
      </section>
    </>
  );
};

export default OrderingPaymentsSection;
