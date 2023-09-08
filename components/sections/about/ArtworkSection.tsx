import React from 'react';
import Container from '../../globals/Container';
import Image from 'next/image';

export const aboutInfo = [
  {
    title: 'Identity Links',
    text: 'A family-operated promotional products company has been in business since 1971. We are importers and distributors of low cost promotional items, executive logo gifts, and corporate apparel. As veterans in the corporate imprinted gift industry, we know what it takes to attract and keep valued clients. Prompt customer service, a knowledgeable and friendly sales staff, and the lowest prices on the web are what keep our clients coming back.',
    imageSrc: '/assets/image-1.png'
  }
];

const ArtworkSection = () => {
  return (
    <>
      <section className="bg-greyLight pt-2 pb-2 ">
        <div className="pt-2 pb-8">
          <div className="text-2xl mb-5 font-bold">
            Help! I don't have a logo or artwork!
          </div>
          <p className="text-mute font-medium text-xl">
            Don't have a fancy logo? No problem! We can imprint a simple text
            message on your item at no additional cost. Many people choose to
            use just their company name, address and/or phone number imprinted
            in simple text on a promotional product. If you'd like a simple logo
            but don't have your own artwork, we can accommodate that too. We
            will work with you to create a simple logo that will complement your
            company information. Want something a little fancier? Contact us for
            quotes on the cost of creating new artwork. Artwork costs are
            typically on a per-hour basis and depend on the complexity of the
            logo you have in mind.
          </p>
        </div>
        <div className="pt-2 pb-8">
          <div className="text-2xl mb-5 font-bold">
            Help! I have a logo from our website/letterhead/business card; can I
            use this as my artwork?
          </div>
          <p className="text-mute font-medium text-xl">
            We can work with just about any image that you send us. However, we
            want your logo to show clearly on our promotional products, which is
            why we recommend using certain formats over others for production.
            Typically a logo taken off of a website or scanned from letterhead
            is not sharp or large enough to look good when imprinted on an
            object. That is why we recommend using a vector format image to get
            ideal results that will look better than scanned images.
          </p>
          <p className="text-mute font-medium text-xl mt-3">
            If you do not have access to a vector format, we can recreate your
            image in vector format for free if it is a simple image. More
            complicated images may incur a small conversion fee. If you're
            unsure, send us your artwork and we will take a look and see if we
            can re-create it for free, or if it will incur artwork costs. More
            often than not, our art department can produce a vector conversion
            for free, so don't hesitate to contact us with questions!
          </p>
        </div>
        <div className="pt-2 pb-8">
          <div className="text-2xl mb-5 font-bold">
            Help! What is a proof and why do I need one?
          </div>
          <p className="text-mute font-medium text-xl">
            To ensure that you are completely happy with your promotional
            product, we provide you with a proof before the item even goes to
            production. All of our proofs are completely free, even if you
            change your mind about ordering a product. A proof simply allows you
            to see what your logo/message will look like on a product. While we
            can create a spec product of your sample, in most cases it is very
            costly. That is why we offer free proofs to show you just how good
            your logo will look on one of our thousands of promotional products.
            Once you send us the artwork, product number and any additional
            information via email (see How To Order), we will return your proof
            within 1 hour to 24 hours.
          </p>
        </div>
        <div className="pt-2 pb-8">
          <div className="text-2xl mb-5 font-bold">Time Frame for Proofs</div>
          <p className="text-mute font-medium text-xl">
            Depending on the complexity of your artwork and the format in which
            it is sent to us, your proof will take anywhere from 1 hour to 24
            hours. In most cases, you will receive your proof within a few hours
            of emailing it to us at info@identity-links.com. It is important to
            remember that we will not place any order without approval of the
            artwork. This ensures that you are completely satisfied with the
            proof before we send it to production. If you are in a rush, please
            indicate this when placing your order. Please note that any
            revisions you make to the proof will take additional time, so it is
            important to send us the artwork well in advance of your event date.
          </p>
          <p className="text-mute font-medium text-xl mt-3">
            Since many of our items have a quick turnaround production period of
            7 business days, we can have the item produced and sent to you in as
            little as two weeks. When placing your order, please inquire about
            the production time to ensure that we have enough time to create
            your proof and send it to the factory, as well as for shipping. If
            you need an item fast, we do offer rush service on some of our
            promotional products for an additional fee. For rush orders, it is
            important to send us all of the information required for the proof
            to ensure that your order is sent quickly to our factory. Confused?
          </p>
          <p className="text-mute font-medium text-xl mt-3">
            If it is your first time ordering a promotional product, all of this
            jargon about vector formats and production times can be confusing.
            In short, we will try to work with whatever type of image you can
            send us to create a promotional product that will wow your clients.
            Just send us whatever information/graphics you do have and we will
            work with you to make the process as simple as possible.
          </p>
        </div>
      </section>
    </>
  );
};

export default ArtworkSection;
