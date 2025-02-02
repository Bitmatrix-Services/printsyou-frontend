import {Metadata} from 'next';
import {Container} from '@components/globals/container.component';
import {metaConstants} from '@utils/constants';
import React from 'react';

const TextConsent = () => {
  return (
    <>
      <div className="bg-white py-8">
        <Container>
          <div className="pt-2 pb-11">
            <h1 className="text-3xl font-bold mb-6 text-center">Text Notification Consent</h1>
            <div className="pb-2">
              <h3 className="text-xl mt-2 mb-1 font-bold text-primary-500">Text Notification Consent</h3>
              <p className="font-normal text-mute2 text-base leading-[30px]">
                At <a href="/">PrintsYou.com</a>, we offer text notifications to keep you informed about your orders,
                special promotions, and updates. Signing up for text notifications is completely optional, and you can
                opt out at any time.
              </p>
            </div>
            <div className="pb-2">
              <h3 className="text-xl mt-2 mb-1 font-bold text-primary-500">How It Works</h3>
              <p className="font-normal text-mute2 text-base leading-[30px]">
                By opting in, you agree to receive automated text messages from <a href="/">PrintsYou.com</a> related to
                your order status, promotions, and important updates. Message and data rates may apply. Your consent to
                receive these messages is not required to make a purchase.
              </p>
            </div>
            <div className="pb-2">
              <h3 className="text-xl mt-2 mb-1 font-bold text-primary-500">How to Opt Out</h3>
              <p className="font-normal text-mute2 text-base leading-[30px]">
                If you wish to stop receiving text notifications, you can:
                <br />
                <br />
                <ul style={{listStyleType: 'initial'}}>
                  <li>
                    Reply <strong>STOP</strong> to any message you receive.
                  </li>
                  <li>
                    Email us at <a href="mailto:support@printsyou.com">support@printsyou.com</a> with your request to
                    unsubscribe.
                  </li>
                </ul>
                <br />
                We respect your privacy, and your contact information will only be used for the purposes you consent to.
                For more details, please review our Privacy Policy.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default TextConsent;

export const metadata: Metadata = {
  title: `Text Notifications Consent | ${metaConstants.SITE_NAME}`,
  description: 'Consent for text notifications',
  alternates: {
    canonical: `${process.env.FE_URL}text-consent`
  }
};
