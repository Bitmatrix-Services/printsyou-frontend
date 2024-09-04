import * as React from 'react';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import {IoIosAdd} from 'react-icons/io';
import {Container} from '@components/globals/container.component';
import {Faq} from '@components/home/home.types';
import {FC} from 'react';

interface FaqSectionComponentProps {
  faqsList: Faq[];
}
export const FaqSectionComponent: FC<FaqSectionComponentProps> = ({faqsList}) => {
  return (
    <div className="py-2">
      <Container>
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold capitalize">frequently asked questions</h2>

        <div className="flex justify-center items-center ">
          <AccordionGroup
            className="border-t-2 border-b-2  my-8"
            sx={{
              maxWidth: 800,
              '& .MuiAccordionSummary-indicator': {
                transition: '0.2s'
              },
              '& [aria-expanded="true"] .MuiAccordionSummary-indicator': {
                transform: 'rotate(45deg)'
              }
            }}
          >
            {(faqsList ?? []).map(faq => (
              <Accordion key={faq.id}>
                <AccordionSummary className="py-2 font-bold" indicator={<IoIosAdd className="w-7 h-7" />}>
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails>
                  <span dangerouslySetInnerHTML={{__html: faq.answer}}></span>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionGroup>
        </div>
      </Container>
    </div>
  );
};
