import React from 'react';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {v4 as uuidv4} from 'uuid';

const TermsAndConditions = () => {
  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Terms and Conditions" />
      <div className="bg-white py-8">
        <Container>
          <div className="pt-2 pb-11">
            <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>
            {termsList.map(item => (
              <div key={uuidv4()} className="pb-2">
                {item.title ? <h3 className="text-xl mt-2 mb-1 font-bold text-secondary-500">{item.title}</h3> : null}
                <p className="font-normal text-mute2 text-base leading-[30px]">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default TermsAndConditions;

const termsList = [
  {
    title: `Payment Terms`,
    body: `PrintsYou requires full payment to start production. Outstanding balances must be settled before any new order production can proceed. By signing the Order Acknowledgment, the buyer agrees to the contractual agreement with PrintsYou, allowing PrintsYou to apply any outstanding balance to the provided payment method until paid in full.`
  },
  {
    title: `Check Returns`,
    body: `A $50.00 fee will be assessed for each returned check due to insufficient funds.`
  },
  {
    title: `Net 30 Terms`,
    body: `If payment terms are granted, late payment will result in a 1.5% finance charge or the maximum charge permitted by law. The buyer agrees to pay all PrintsYou's attorney and collection agency fees incurred in pursuing any amount owed.`
  },
  {
    title: `Acceptance`,
    body: `The buyer's online order submission, Estimate/Quote signature, or email acceptance of a Sales Order/Order Acknowledgment indicates conditional acceptance by PrintsYou of the buyer's offer to purchase goods and accept PrintsYou's terms and conditions.`
  },
  {
    title: `Cancellations and Alterations`,
    body: `Once the buyer confirms the Order Acknowledgment and Artwork Approval, production begins. PrintsYou cannot guarantee changes or cancellations after this point. If changes are necessary, PrintsYou must be contacted immediately. Cancellation may incur a minimum charge of $50.00 for preparation expenses, plus any production charges accrued.`
  },
  {
    title: `Claims, Adjustments, and Returns`,
    body: `No returns of imprinted goods are accepted. If problems arise with an order, the buyer must contact customer service at info@printsyou.com within 15 days of receipt. Unauthorized returns will be discarded at PrintsYou's discretion.`
  },
  {
    title: `Overages and Shortages`,
    body: `Overruns and underruns may occur within a 5%-10% range. PrintsYou reserves the right to ship and bill or credit the buyer's charge card or account for up to 10% over or under the desired quantity.`
  },
  {
    title: `Sales Tax`,
    body: `PrintsYou collects applicable state and local taxes for services and goods shipped to Illinois and California. Buyers in other states may need to remit use taxes. Companies exempt from sales tax must provide PrintsYou with a copy of the resale certificate.`
  },
  {
    title: `Shipping Policy`,
    body: `Orders will be shipped using PrintsYou's account and billed with the order at published rates. If using your own account, you will be responsible for insuring your shipment. PrintsYou guarantees shipment of merchandise on or before the desired deadline but is not responsible for carrier delays.`
  },
  {
    title: `Shipping Delays`,
    body: `PrintsYou is not accountable for delays caused by Acts of God or other circumstances beyond its control. Factory shipment or delivery dates are the best estimates of suppliers, and PrintsYou shall not be liable for any damages arising from any delay in delivery.`
  },
  {
    title: `Transfer of Ownership`,
    body: `All goods become the property of the buyer when accepted from the carrier.`
  },
  {
    title: `Warranties`,
    body: `PrintsYou warrants that all goods sold are free of any security interest and will make available to the buyer all transferable warranties made to PrintsYou by the manufacturer of the goods.`
  },
  {
    title: `Proof Policy`,
    body: `PrintsYou requires that all new orders receive a Digital Proof and Order Acknowledgment before final production. If an error is discovered during order or artwork proofing, it must be noted on the paperwork accordingly and/or the sales representative involved contacted.`
  },
  {
    title: `Typographical Errors`,
    body: `PrintsYou is not responsible for typographical mistakes or errors that are overlooked and later approved by the buyer. For example, if an order is approved with a typographical error, PrintsYou cannot be held responsible for the misprint.`
  },
  {
    body: `This revised content maintains the essential information while reducing redundancy and extraneous details.`
  }
];
