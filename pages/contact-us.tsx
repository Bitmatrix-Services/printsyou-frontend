import React from 'react';

import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';

function ContactUs() {
  return (
    <div>
      <PageHeader pageTitle="Contact Us" />
      <Container>
        <div className="xs:flex md:grid md:grid-cols-2 pt-8">
          <div className="w-full pr-6">
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
          <iframe
            className="custom-map w-full h-full pl-6"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2964.1479667071944!2d-87.78585458441495!3d42.018558064591296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fc8d799d677fb%3A0xa65daeb86f4aae92!2sIdentity-Links%20-%20Promotional%20Products!5e0!3m2!1sen!2sus!4v1624371789928!5m2!1sen!2sus"
          />
        </div>
      </Container>
    </div>
  );
}

export default ContactUs;
