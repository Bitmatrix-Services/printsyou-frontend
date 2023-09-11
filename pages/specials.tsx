import React, {FC} from 'react';

import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';
import ProductsSection from '@components/sections/specials/ProductsSection';

const HowToOrderPage = () => {
  return (
    <>
      <PageHeader pageTitle={'Specials and Sales'} />

      <div className="py-12">
        <ProductsSection />
      </div>
    </>
  );
};

interface PricingCardProps {
  title: number;
  description: string;
}

const pricingList = [
  `The best way to get the order process started is by clicking the "place order" button on the product page. Think of it more like a request for a quote. No payment is required at this point in the order process.`,
  `Once the order is placed online, and we receive all your information and artwork, we will assign a sales rep who will work with you through the rest of the order process.`,
  `We will begin by clarifying any information or questions we may have regarding your order or artwork. We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.`,
  `The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork.`,
  `The artwork proof can be changed as often as you'd like until you're satisfied with the layout or design.`,
  `
  Once the sales confirmation and artwork are approved, and you're ready to move forward with production, we will send you an invoice with a link to securly submit your payment online. After the payment is received we will send the order to production.`,
  `
  There's no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we'll work closely with you until you're ready.`
];

const PricingCard: FC<PricingCardProps> = ({title, description}) => {
  return (
    <div className="flex my-6 md:pr-6">
      <div className="pr-6 pt-2 text-primary text-5xl font-bold">{title}</div>
      <div className="text-mute font-medium px-3">{description}</div>
    </div>
  );
};

export default HowToOrderPage;
