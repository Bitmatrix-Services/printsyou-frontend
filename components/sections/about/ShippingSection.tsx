import React from 'react';
import Container from '../../globals/Container';
import Image from 'next/image';
import HeadlineCard from '@components/cards/HeadlineCard';

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

const ShippingSection = () => {
  return (
    <>
      <section className="bg-greyLight pt-2 pb-2 ">
        <div className="pt-2 pb-11 ">
          <div className="text-2xl mb-5 font-bold">Shipping Information</div>
          <p className="text-mute font-medium text-xl">
            We make best efforts to ship your products to your desired
            destination in the most economical way possible given your specified
            date and production limitations. The most economical means of
            transportation is typically UPS Ground. In some cases where product
            is extremely heavy, another common carrier may be used.
          </p>
        </div>
        <div className="flex flex-wrap gap-6  xl:gap-8 2xl:gap-20 items-center justify-center">
          <HeadlineCard text="Should you have special shipping needs, including the need to divide shipments among multiple destinations, please contact info@identity-links." />
        </div>
        <div className="pt-4  pb-11 ">
          <p className="text-mute font-medium text-xl">
            We make best efforts to ship your products to your desired
            destination in the most economical way possible given your specified
            date and production limitations. The most economical means of
            transportation is typically UPS Ground. In some cases where product
            is extremely heavy, another common carrier may be used.
          </p>
        </div>
        <div className="flex flex-wrap gap-6  xl:gap-8 2xl:gap-20 items-center justify-center">
          <HeadlineCard text="We are able to ship to most locations in the US and abroad although individual carriers have restrictions regarding PO and APO boxes." />
        </div>
        <div className="pt-4  pb-4 ">
          <p className="text-mute font-medium text-xl">
            All orders will be shipped using Identity-Links account and billed
            with your order at published rates for that carrier. If you prefer
            to use your own account, we can accommodate you. Please provide us
            with the carrier name and your account number via email. If you
            choose to use your own account, you will be solely responsible for
            the insuring of your shipment. If your shipment is damaged or lost
            in transit, you will be responsible for the full invoiced amount of
            the items.
          </p>
        </div>
        <div className="py-4 ">
          <p className="text-mute font-medium text-xl">
            Unless otherwise specified, all shipments sent using UPS or Federal
            Express services will be insured for full value by Identity-Links
            and included as part of our shipping and handling charges to you.
            Any customer not wishing to pay for this expense must communicate
            this to us on their Order Acknowledgement.
          </p>
        </div>
        <div className="py-4 ">
          <p className="text-mute font-medium text-xl">
            Identity-Links offers all classes of service offered by Fed Ex and
            UPS.
            <br />
            <br />
            Additionally, Saturday deliveries are limited to domestic US
            shipments only and only apply to UPS Next Day service. Saturday
            deliveries will result in additional shipping charges.
          </p>
        </div>
        <div className="py-4 ">
          <p className="text-mute font-medium text-xl">
            Please keep in mind that there are differences in transit time and
            charges to residential and commercial address. If shipping to
            residential address you must specify to your sales rep prior to
            ordering. Transit times and charges vary between residential and
            commercial addresses and we cannot be held responsible for these
            differences or delays. You will receive an order confirmation
            confirming your shipping address to approve. Please note that we
            assume all shipping addresses provided with a company name are not
            residential addresses and addresses without company names as
            residential.
          </p>
        </div>
        <div className="py-4 ">
          <p className="text-mute font-medium text-xl">
            Finally, because Identity-Links sends its products from a network of
            factories around the country, orders placed on the same day may
            arrive at different times. If you have unique needs regarding
            arrival of products, please be sure to specify those needs in an
            email. If you have additional needs after placing an order, please
            call you representative directly.
          </p>
        </div>
        <div className="py-4 ">
          <div className="text-2xl mb-5 font-bold">Split Shipments</div>
          <p className="text-mute font-medium text-xl">
            Do you have a trade show in Los Angeles and a sales meeting in
            Boston? At Identity-Links, it is no problem at all for us to send
            your items where they need to be. In an email, just specify that you
            need your order sent to multiple locations. A Customer Care
            Representative will call you or send you an email in order to obtain
            the details. We require that at least one full carton of product is
            shipped to each location. Freight will be billed individually for
            each shipment on your final invoice and a handling charge of $10.00
            for each additional location may be added.
          </p>
        </div>
      </section>
    </>
  );
};

export default ShippingSection;
