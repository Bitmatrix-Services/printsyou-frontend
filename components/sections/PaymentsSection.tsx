import React from 'react';

const PaymentsSection = () => {
  return (
    <div className=" bg-[#323a4d]">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8 xl:px-24 py-8 xl:py-14 relative">
        <h2 className="font-bold text-primary-500 text-2xl mb-4">Payments</h2>
        <div className="mb-10 border-[0] border-t border-solid border-mute3" />
        <div className="flex md:flex-row sm:flex-col max-sm:flex-col  md:space-x-4">
          <div className="">
            <h3 className="text-white font-bold mb-5">First Time Orders</h3>
            <p className="text-mute font-semibold">
              First time orders from Non-Rated accounts require a credit card
              deposit or prepayment by company check. You may use a credit card
              as collateral only, and we will bill you Open Account Net 30 days.
              After payment for your transaction, you will then be set up on an
              open account basis for all future orders.
            </p>
          </div>
          <div className="mt-10 md:mt-0">
            <h3 className="text-white font-bold mb-5 ">Purchase Orders</h3>
            <p className="text-mute font-semibold">
              PrintsYou may accept Purchase Orders. Please contact us to see if
              you are eligible for this payment option.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-white font-bold mb-5">Credit Cards</h3>
          <p className="text-mute font-semibold">
            The majority of our customers prefer to pay for their orders by
            credit card. PrintsYou accepts Visa, MasterCard, and American
            Express. We do not recommend submitting your credit card information
            via email. You can call in or fax your card information to us. When
            providing credit card information, please include your order number,
            the type of card, the card number, the expiration date, and your
            full name and billing address as it appears on the card. When paying
            by credit card, you will be charged a maximum of 50% of the amount
            stated on your sales order or agreed upon verbally once approval for
            production is given. Please note, Sales Orders do not always include
            shipping costs. This secures the merchandise and puts the order into
            production to be customized. Should any overruns or underruns be
            applicable, we will typically charge or credit your card within 7
            business days of order shipment (See terms and conditions).
            Information regarding account number and expiration dates as well as
            authorized signatures will be held entirely confidential by
            PrintsYou and its representatives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsSection;
