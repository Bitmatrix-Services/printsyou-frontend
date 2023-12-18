import PageHeader from '@components/globals/PageHeader';
import {metaConstants} from '@utils/Constants';
import {NextSeo} from 'next-seo';
import Container from '@components/globals/Container';
import React from 'react';
import Link from 'next/link';

const list = [
  {
    heading: 'Experience',
    para: '- Our account reps have an average of 8 years experience in the promotional products industry. We know the business of imprinted promotional products, and will help guide you to the right item with the right decoration, as well as the best method of laying out your custom imprint.  We are knowledgeable in promotional product marketing, vigilant about business ethics, and will always have your best interest in mind.  Our dedication to customer satisfaction, and creative promotional product ideas is why hundreds of logo gift buyers rely on us for all of their imprinted logo items.'
  },
  {
    heading: 'Service',
    para: `- Our in-house art department makes purchasing promotional items a breeze.  Just submit your logo, image and text, and we'll send you back a completed mockup of how it lays out best on the item(s) you have chosen.   We can even help you design your logo.  Free logo samples, art renderings, customized product presentations and free warehousing and fulfillment services are all part of our overall commitment to providing the very best service in the promotional products industry.`
  },
  {
    heading: 'Dedicated Account Reps',
    para: `- Your order will be assigned to a dedicated account specialist.  You'll have one person responsible for seeing through every detail of your custom printed logo gift. Trained back up staff in our order department can also help with real time status on the production and status of your order.`
  },
  {
    heading: 'Long Term Relationships',
    para: `- Say no to nickel and dime promotional product distributors. We're here to build a lasting relationship with our valued clients. We don't charge for samples, e-mail proofs, or art services. We don't charge for a reasonable amount of imprinted logo samples. We don't charge for drop shipments or reorder set ups. There are no hidden costs. We are up front about every charge, and will never hit you with an additional fee without notifying you first. After 31 years of working with promotional product buyers, I know what it takes to keep a client coming back, and honesty is the most important element.`
  },
  {
    heading: 'Volume Rebates',
    para: `- Ask your account representative about our volume rebate programs.  Once you purchase over $10,000 of imprinted logo merchandise you will be eligible for a credit back to your account.  The more you purchase, the greater the rebate.  You can use this rebate on your next purchase, or request a check back at the end of the year. We want to encourage you to look to Identity-Links for ALL of your custom printed logo items.`
  },
  {
    heading: '100% satisfaction',
    para: `- If you are not totally satisfied with your order of custom logo merchandise, we will do whatever it takes to make it right.  Our no-hassle policy of resolving quality issues has set an industry standard.`
  },
  {
    heading: 'Product Choice',
    para: `- We attend every major trade show in the promotional products industry, always in search of the newest, and most innovative imprinted logo items.  Our web site contains over 24,000 hand selected items for your review, and we are continually updating the site.  In addition to the logo merchandise shown online, your account rep has a data base of over 300,000 additional imprinted promotional ideas.  Just tell us a theme, and we'll get back to you with a ton of creative ideas just for you.`
  },
  {
    heading: 'Rush Service',
    para: `- In a perfect world, our clients would order custom printed promotional items without any deadline. But that doesn't happen. That's why we offer over 800 customized promotional items with 24 hour service, at no additional charge.  We even offer logo pens and imprinted mugs with same day service!`
  }
];

const IdentityLinksAdvantage = () => {
  return (
    <>
      <NextSeo
        title={`The Identity Links Advantage | ${metaConstants.SITE_NAME}`}
      />
      <PageHeader pageTitle="The Identity Links Advantage" />
      <Container>
        <div className="mt-5 pb-8 mb-12">
          <h1 className="text-2xl mb-5 font-bold">
            Why choose Identity-Links for your custom printed promotional
            merchandise?
          </h1>
          <h4 className="text-md mb-10">
            Welcome to the Identity Links website. My name is Mark Siegel,
            President of Identity-Links, and always just a phone call away.
            We're a family business dedicated to converting customers into long
            term clients. Please take a look at the following reasons why I
            encourage you to trust us with your order.
          </h4>
          <ul className="mb-6 list-disc ml-6">
            {list.map(listItem => (
              <li key={listItem.heading} className="mb-5">
                <span className="mr-2 font-bold">{listItem.heading}</span>
                <span>{listItem.para}</span>
              </li>
            ))}
          </ul>
          <div className="text-md mt-12">
            Want to know about the company, and what we promise. Call me
            anytime. Or speak to one of my sons, Danny, or Michael. We don't
            want to be the biggest, but we'll do whatever it takes to be the
            BEST{' '}
            <Link href="/" className="text-blue-500">
              promotional products
            </Link>{' '}
            dealer in the country. Honest.
          </div>
        </div>
      </Container>
    </>
  );
};

export default IdentityLinksAdvantage;
