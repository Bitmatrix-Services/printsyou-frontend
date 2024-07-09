import React from 'react';
import HeadlineCard from '@components/cards/HeadlineCard';
import Container from '@components/globals/Container';

const ShippingSection = () => {
  return (
    <div className="bg-white py-8">
      <Container>
        <div className="pt-2 pb-11 ">
          <h2 className="text-2xl mb-5 font-bold">Shipping Information</h2>
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
            We make best efforts to ship your products to your desired
            destination in the most economical way possible given your specified
            date and production limitations. The most economical means of
            transportation is typically UPS Ground. In some cases where product
            is extremely heavy, another common carrier may be used.
          </p>
        </div>
        <div className="flex flex-wrap gap-6  xl:gap-8 2xl:gap-20 items-center justify-center">
          <HeadlineCard text="Should you have special shipping needs, including the need to divide shipments among multiple destinations, please contact info@printsyou." />
        </div>
        <div className="pt-4  pb-11 ">
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
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
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
            All orders will be shipped using PrintsYou account and billed with
            your order at published rates for that carrier. If you prefer to use
            your own account, we can accommodate you. Please provide us with the
            carrier name and your account number via email. If you choose to use
            your own account, you will be solely responsible for the insuring of
            your shipment. If your shipment is damaged or lost in transit, you
            will be responsible for the full invoiced amount of the items.
          </p>
        </div>
        <div className="py-4 ">
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
            Unless otherwise specified, all shipments sent using UPS or Federal
            Express services will be insured for full value by PrintsYou and
            included as part of our shipping and handling charges to you. Any
            customer not wishing to pay for this expense must communicate this
            to us on their Order Acknowledgement.
          </p>
        </div>
        <div className="py-4 ">
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
            PrintsYou offers all classes of service offered by Fed Ex and UPS.
            <br />
            <br />
            Additionally, Saturday deliveries are limited to domestic US
            shipments only and only apply to UPS Next Day service. Saturday
            deliveries will result in additional shipping charges.
          </p>
        </div>
        <div className="py-4 ">
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
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
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
            Finally, because PrintsYou sends its products from a network of
            factories around the country, orders placed on the same day may
            arrive at different times. If you have unique needs regarding
            arrival of products, please be sure to specify those needs in an
            email. If you have additional needs after placing an order, please
            call you representative directly.
          </p>
        </div>
        <div className="py-4 ">
          <div className="text-2xl mb-5 font-bold">Split Shipments</div>
          <p className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins">
            Do you have a trade show in Los Angeles and a sales meeting in
            Boston? At PrintsYou, it is no problem at all for us to send your
            items where they need to be. In an email, just specify that you need
            your order sent to multiple locations. A Customer Care
            Representative will call you or send you an email in order to obtain
            the details. We require that at least one full carton of product is
            shipped to each location. Freight will be billed individually for
            each shipment on your final invoice and a handling charge of $10.00
            for each additional location may be added.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default ShippingSection;
