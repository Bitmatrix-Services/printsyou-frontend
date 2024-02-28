import React from 'react';
import Container from '@components/globals/Container';

const testimonials = [
  {
    text: 'My portfolios actually arrived a day early, and they came in perfect. Thanks again. I was worried about the small stars in the logo, but they came out sharp and clear. I am sure we will be placing another order for these at our summer show.',
    name: 'Cindy L.',
    company: 'Sage Supply Co.'
  },
  {
    text: 'All great. Always a pleasure working with you - honestly. Your professionalism, speed and a lovely attitude are amazing!',
    name: 'Deborah M.',
    company: 'The Internationalist'
  },
  {
    text: 'I just attended a meeting to debrief everyone on how our recent conference in Atlanta went. The team that attended the conference gave my group high marks on everything we did as far as preparation for them, and especially noted how much they liked the cloud stress balls. Apparently everyone at the conference liked them, because they did not have any left to ship back to us here in Columbus they gave them all away! It sounds like they were very popular. I am sure you know how difficult it is to order something off the internet from a company you are unfamiliar with. I just wanted to say thanks for doing a terrific job for us, and we will certainly look to you again if we decide to order materials for future conferences.',
    name: 'Matt B',
    company: 'CGI Federal'
  },
  {
    text: 'I used PrintsYou for a promotional baby bib order and had the pleasure of working with Bart. Bart was timely, professional and asked all the right questions. Our business will definitely use PrintsYou again for their quality work and professionalism.',
    name: 'J.B.',
    company: ''
  },

  {
    text: 'PrintsYou has done it again. Our shirts were at the hotel in Vegas when we arrived, just as promised. Keep up the good work. I have also passed your name on to our H.R. department. They should be using PrintsYou as well.',
    name: 'Steve H.',
    company: ' Woodhaven Rx'
  },

  {
    text: 'Your customer service is top notch. I am hoping this letter reaches the owner or president, and that he or she gives a special Pat on the Back to Danny Siegel. He was extremely patient and courteous throughout the whole ordering process, and called me the day after I received my shipment in order to be sure I was pleased with the product. I have used other promo product vendors in the past, but am now a loyal PrintsYou customer.',
    name: 'Steve H.',
    company: ' Woodhaven Rx'
  },
  {
    text: 'The laser pointers arrived today and look great! We are really, really happy with how our logo printed on the pointers. Thank you so much for all of your help and assistance! The next time we are interested in promotional items, we will definitely be contacting PrintsYou!',
    name: 'Dee L. ',
    company: 'Blair, Church & Flynn'
  }
];

const middleIndex = Math.floor(testimonials.length / 2);
const firstHalfTestimonials = testimonials.slice(0, middleIndex); // returns [1, 2, 3]
const secondHalfTestimonials = testimonials.slice(middleIndex);
const TestimonialsSection = () => {
  return (
    <div className="bg-white py-14">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <ul className="">
              {firstHalfTestimonials.map((testimonial, index) => (
                <li key={index} className="mb-10">
                  <div className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins italic  space-y-4">
                    <p>"{testimonial.text}"</p>
                  </div>
                  <div className="text-base text-lime-950ute mt-4">
                    <span className="text-[14px] flex align-middle font-poppins content-center items-center">
                      <span className="text-xl  font-bold capitalize mr-2">
                        <span className="mr-2">-</span>
                        {testimonial.name}
                      </span>{' '}
                      <span className="text-2xl font-normal mr-2">/</span>
                      <span className="text-lg font-normal ">
                        {testimonial.company}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-6">
              {secondHalfTestimonials.map((testimonial, index) => (
                <li key={index} className="mb-10">
                  <div className="font-medium text-mute3  text-[16px] leading-[30px] font-poppins italic  space-y-4">
                    <p>"{testimonial.text}"</p>
                  </div>
                  <div className="text-base text-lime-950ute mt-4">
                    <span className="text-[14px] flex align-middle font-poppins content-center items-center">
                      <span className="text-xl  font-bold capitalize mr-2">
                        <span className="mr-2">-</span>
                        {testimonial.name}
                      </span>{' '}
                      <span className="text-2xl font-normal mr-2">/</span>
                      <span className="text-lg font-normal ">
                        {testimonial.company}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TestimonialsSection;
