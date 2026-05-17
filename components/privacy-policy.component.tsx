'use client';

import React from 'react';
import {Container} from '@components/globals/container.component';
import {FaShieldAlt, FaLock, FaUserShield, FaCookieBite, FaEnvelope} from 'react-icons/fa';

const PrivacyPolicyComponent = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <Container>
          <div className="text-center">
            <FaShieldAlt className="mx-auto text-5xl mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how PrintsYou collects, uses, and protects your personal information.
            </p>
            <p className="text-sm opacity-75 mt-4">Last Updated: January 2025</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              PrintsYou (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website printsyou.com, place an order, or interact with our services. Please read this policy carefully. By using our website or services, you consent to the practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaUserShield className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-700 mb-4">When you place an order or contact us, we may collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Billing and shipping addresses</li>
              <li>Company name (if applicable)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Order history and preferences</li>
              <li>Artwork and design files you upload</li>
              <li>Communications with our customer service team</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">When you visit our website, we automatically collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
              <li>Geographic location (country/region)</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations, shipping updates, and invoices</li>
              <li>Create and send virtual proofs of your custom products</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website, products, and services</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Prevent fraud and maintain security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Third parties who help us operate our business (payment processors, shipping carriers, email services)</li>
              <li><strong>Suppliers:</strong> Manufacturers who produce your custom products (only information necessary to fulfill your order)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaCookieBite className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking Technologies</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of our website.
            </p>
            <p className="text-gray-700">
              We use Google Analytics and Meta (Facebook) Pixel to understand how visitors interact with our site and to serve relevant advertisements. These services may collect information about your online activities over time and across different websites.
            </p>
          </section>

          {/* Data Security */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaLock className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our website uses SSL encryption to protect data transmitted between your browser and our servers. Payment information is processed through PCI-compliant payment processors (Stripe) and is never stored on our servers.
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Data Retention */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Order information is retained for a minimum of 7 years for tax and legal compliance purposes.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-700">
              Our website and services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated &quot;Last Updated&quot; date at the top of this page. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-primary-50 rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-800 font-semibold">PrintsYou</p>
              <p className="text-gray-700">8602 Royal Star Rd</p>
              <p className="text-gray-700">Rowlett, TX 75089</p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:info@printsyou.com" className="text-primary-600 hover:underline">
                  info@printsyou.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong>{' '}
                <a href="tel:+14694347035" className="text-primary-600 hover:underline">
                  (469) 434-7035
                </a>
              </p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicyComponent;
