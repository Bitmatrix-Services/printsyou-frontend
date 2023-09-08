import React from 'react';
import Link from 'next/link';

import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';

function ContactUs() {
  return (
    <div>
      <PageHeader pageTitle="Contact Us" />
      <Container>
        <div className="xs:flex md:grid md:grid-cols-2 pt-8">
          <div className="w-full">
            <input
              className="block border w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
              name="name"
              placeholder="Full Name"
              type="text"
              required
            />
            <div className="flex justify-between space-x-4">
              <input
                className="block border my-6 w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
                type="text"
                name="email"
                placeholder="Email"
              />
              <input
                className="block border my-6 w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
                type="text"
                name="phone"
                placeholder="Phone"
              />
            </div>
            <input
              className="block border w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
              type="text"
              name="subject"
              placeholder="Subject"
              required
            />
            <div className="my-6">
              <textarea
                className="p-4 block border w-full h-[200px] focus:outline-none resize-none"
                placeholder="Message"
                name="message"
              />
            </div>
            <button className="w-fit hidden md:block py-6 px-32 text-sm  font-bold  bg-primary-500 hover:bg-body text-white">
              SUBMIT
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactUs;
