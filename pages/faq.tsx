import React, {FC} from 'react';
import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import {http} from 'services/axios.service';
import sanitize from 'sanitize-html';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';

type Faqs = {
  id: string;
  question: string;
  answer: string;
  sequenceNumber: number;
};

interface FaqsProps {
  faqs: Faqs[];
}

const Faqs: FC<FaqsProps> = ({faqs}) => {
  return (
    <>
      <NextSeo title={`Frequently Asked Questions | FAQ | ${metaConstants.SITE_NAME}`} />
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
            {[...faqs]
              ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map((faq, index) => (
                <div key={index} className="md:w-[48%] lg:w-[47%]  mb-4">
                  <Accordion className="border border-[#e1e1e1] shadow-none">
                    <AccordionSummary
                      id={faq.id}
                      expandIcon={<AddIcon />}
                      aria-controls="panel1a-content"
                    >
                      <div className="flex my-1 md:pr-6 items-center">
                        <div className="pr-6 ">
                          <div className="h-8 w-8 bg-[#febe40] rounded-full ">
                            <p className="w-4 h-4 relative text-white text-center top-1 left-2">
                              {faq.sequenceNumber}
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
                        <p
                          dangerouslySetInnerHTML={{
                            __html: sanitize(faq.answer)
                          }}
                          className="text-[14px] text-mute3 leading-6 space-y-1 px-5 pb-3"
                        ></p>
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

export const getServerSideProps = async () => {
  const {data} = await http.get(`/faqs/all`);
  const faqs = data.payload;
  return {props: {faqs}};
};

export default Faqs;
