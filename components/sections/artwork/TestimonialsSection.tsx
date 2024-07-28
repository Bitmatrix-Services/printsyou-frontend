import React from 'react';
import Container from '@components/globals/Container';

const testimonials: {text: string; name: string; company: string}[] = [];

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
                      <h2 className="text-xl font-bold capitalize mr-2">
                        <span className="mr-2">-</span>
                        {testimonial.name}
                      </h2>{' '}
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
