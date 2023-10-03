import React from 'react';

import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';

const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'The best way to get the order process started is by clicking the "place order" button on the product page. This will put in a request for a quote. No payment is required at this point in the order process. Once the order is placed online, and we receive all your information and artwork, we will assign a sales rep who will work with you through the rest of the order process. We will begin by clarifying any information or questions we may have regarding your order or artwork.  We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.  The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork. The artwork proof can be changed as often as you like until you are satisfied with the layout or design. Once the sales confirmation and artwork are approved, we will send you our credit card form to be completed. After completion of the credit card form we will send the order to production.<br/>There is no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we will work closely with you until you are ready.<br/>We know that ordering custom items can be intimidating, but we are here to help and guide you through the process.'
  },
  {
    question: 'How Much Is Shipping?',
    answer:
      'The best way to get the order process started is by clicking the "place order" button on the product page. This will put in a request for a quote. No payment is required at this point in the order process. Once the order is placed online, and we receive all your information and artwork, we will assign a sales rep who will work with you through the rest of the order process. We will begin by clarifying any information or questions we may have regarding your order or artwork.  We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.  The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork. The artwork proof can be changed as often as you like until you are satisfied with the layout or design. Once the sales confirmation and artwork are approved, we will send you our credit card form to be completed. After completion of the credit card form we will send the order to production. There is no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we will work closely with you until you are ready. We know that ordering custom items can be intimidating, but we are here to help and guide you through the process.'
  },
  {
    question: 'What are the artwork requirements?',
    answer:
      'The best way to get the order process started is by clicking the "place order" button on the product page. This will put in a request for a quote. No payment is required at this point in the order process. Once the order is placed online, and we receive all your information and artwork, we will assign a sales rep who will work with you through the rest of the order process. We will begin by clarifying any information or questions we may have regarding your order or artwork.  We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.  The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork. The artwork proof can be changed as often as you like until you are satisfied with the layout or design. Once the sales confirmation and artwork are approved, we will send you our credit card form to be completed. After completion of the credit card form we will send the order to production. There is no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we will work closely with you until you are ready. We know that ordering custom items can be intimidating, but we are here to help and guide you through the process.'
  },
  {
    question: 'What methods of payment are accepted?',
    answer:
      'The best way to get the order process started is by clicking the "place order" button on the product page. This will put in a request for a quote. No payment is required at this point in the order process. Once the order is placed online, and we receive all your information and artwork, we will assign a sales rep who will work with you through the rest of the order process. We will begin by clarifying any information or questions we may have regarding your order or artwork.  We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.  The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork. The artwork proof can be changed as often as you like until you are satisfied with the layout or design. Once the sales confirmation and artwork are approved, we will send you our credit card form to be completed. After completion of the credit card form we will send the order to production. There is no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we will work closely with you until you are ready. We know that ordering custom items can be intimidating, but we are here to help and guide you through the process.'
  },
  {
    question: 'What is standard production time?',
    answer:
      'The best way to get the order process started is by clicking the "place order" button on the product page. This will put in a request for a quote. No payment is required at this point in the order process. Once the order is placed online, and we receive all your information and artwork, we will assign a sales rep who will work with you through the rest of the order process. We will begin by clarifying any information or questions we may have regarding your order or artwork.  We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.  The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork. The artwork proof can be changed as often as you like until you are satisfied with the layout or design. Once the sales confirmation and artwork are approved, we will send you our credit card form to be completed. After completion of the credit card form we will send the order to production. There is no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we will work closely with you until you are ready. We know that ordering custom items can be intimidating, but we are here to help and guide you through the process.'
  },
  {
    question: 'Will I see a proof?',
    answer:
      'The best way to get the order process started is by clicking the "place order" button on the product page. This will put in a request for a quote. No payment is required at this point in the order process. Once the order is placed online, and we receive all your information and artwork, we will assign a sales rep who will work with you through the rest of the order process. We will begin by clarifying any information or questions we may have regarding your order or artwork.  We will then send you a sales confirmation, along with an artwork proof showing how your artwork or logo will look on the item.  The sales confirmation will include all charges, including shipping, taxes, setup fees, or any additional charges that may be required based on your artwork. The artwork proof can be changed as often as you like until you are satisfied with the layout or design. Once the sales confirmation and artwork are approved, we will send you our credit card form to be completed. After completion of the credit card form we will send the order to production. There is no commitment to placing the order online. You can cancel the order at any time before production begins. There will be plenty of communication before we begin production, and we will work closely with you until you are ready. We know that ordering custom items can be intimidating, but we are here to help and guide you through the process.'
  }
];

const HowToOrderPage = () => {
  return (
    <>
      <PageHeader pageTitle={'Frequently Asked Questions'} />
      <Container>
        <div className="py-12">
          <p className="text-mute3  font-medium text-[16px] leading-[30px]">
            We hope that our list of Frequently Asked Questions provides the
            simple answers you are looking for. If not, please call one of our
            experienced sales representatives to get the quick answers you need.
            We realize that there are many variables involved in ordering custom
            printed promotional items, so it's often best to speak to us first
            with your technical questions.
          </p>
        </div>
        <div className="" />
        <div className="py-12">
          <div className=" flex flex-wrap flex-1 flex-row sm:gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="md:w-[48%] lg:w-[47%]  mb-4">
                <Accordion className="border border-[#e1e1e1] shadow-none">
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="panel1a-content"
                    id={`${index}-header`}
                    className=""
                  >
                    <div className="flex my-1 md:pr-6 items-center">
                      <div className="pr-6 ">
                        <div className="h-8 w-8 bg-[#febe40] rounded-full ">
                          <p className="w-4 h-4 relative text-white text-center top-1 left-2">
                            {index + 1}
                          </p>
                        </div>
                      </div>

                      <h4 className="text-[16px] text-[#303541] font-bold capitalize">
                        {faq.question}
                      </h4>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <p className="text-[14px] text-mute3 leading-6 space-y-1 pl-5 ">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default HowToOrderPage;
