'use client';

import React from 'react';
import {Container} from '@components/globals/container.component';
import {FaUndo, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaEnvelope} from 'react-icons/fa';

const ReturnPolicyComponent = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <Container>
          <div className="text-center">
            <FaUndo className="mx-auto text-5xl mb-4" />
            <h1 className="text-4xl font-bold mb-4">Return & Refund Policy</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              We stand behind the quality of our custom printed products. Learn about our return and refund policies.
            </p>
            <p className="text-sm opacity-75 mt-4">Last Updated: January 2025</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 max-w-4xl mx-auto">
          {/* Important Notice */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-2xl text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Important: Custom Products</h2>
                <p className="text-gray-700">
                  Please note that all PrintsYou products are custom-made to your specifications. Because each item is personalized with your unique design, artwork, or customizations, we cannot accept returns for change of mind, incorrect ordering, or design errors approved by you during the proofing process.
                </p>
              </div>
            </div>
          </section>

          {/* When We Accept Returns */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-2xl text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">When We Accept Returns & Refunds</h2>
            </div>
            <p className="text-gray-700 mb-4">We will gladly provide a replacement or refund in the following situations:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700"><strong>Manufacturing Defects:</strong> Items that have printing errors, misprints, or quality issues that were not present in your approved proof</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700"><strong>Damaged in Shipping:</strong> Products that arrive damaged due to shipping or handling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700"><strong>Wrong Item Received:</strong> If you receive a different product than what you ordered</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700"><strong>Significant Color Variation:</strong> If the printed colors differ significantly from your approved digital proof (beyond normal printing tolerances)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700"><strong>Missing Items:</strong> If your order is incomplete or items are missing</span>
              </li>
            </ul>
          </section>

          {/* When We Cannot Accept Returns */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaTimesCircle className="text-2xl text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">When We Cannot Accept Returns</h2>
            </div>
            <p className="text-gray-700 mb-4">Due to the custom nature of our products, we cannot accept returns for:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span className="text-gray-700">Change of mind after order is placed or in production</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span className="text-gray-700">Errors in your submitted artwork or design files</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span className="text-gray-700">Spelling, grammatical, or content errors that were present in your approved proof</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span className="text-gray-700">Incorrect size, quantity, or product selection made by the customer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span className="text-gray-700">Minor color variations that fall within standard printing tolerances</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✗</span>
                <span className="text-gray-700">Products that have been used, washed, or altered after delivery</span>
              </li>
            </ul>
          </section>

          {/* Return Process */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Return or Refund</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Contact Us Within 7 Days</h3>
                  <p className="text-gray-700">Email us at info@printsyou.com within 7 days of receiving your order with your order number and a description of the issue.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Provide Photos</h3>
                  <p className="text-gray-700">Include clear photos showing the defect, damage, or issue with your product. This helps us process your claim quickly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Await Our Response</h3>
                  <p className="text-gray-700">Our team will review your request and respond within 1-2 business days with a resolution.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Resolution</h3>
                  <p className="text-gray-700">If approved, we will either reprint your order at no additional cost or issue a full refund to your original payment method.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Timeline */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Processing Time</h2>
            <p className="text-gray-700 mb-4">
              Once a refund is approved, please allow:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Credit/Debit Cards:</strong> 5-10 business days for the refund to appear on your statement</li>
              <li><strong>PayPal:</strong> 3-5 business days</li>
              <li><strong>Other Payment Methods:</strong> Processing times may vary</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Refunds are issued to the original payment method used at checkout. We cannot issue refunds to a different payment method.
            </p>
          </section>

          {/* Cancellations */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Cancellations</h2>
            <p className="text-gray-700 mb-4">
              You may request to cancel your order under the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Before Proof Approval:</strong> Full refund available if you cancel before approving your proof</li>
              <li><strong>After Proof Approval but Before Production:</strong> Full refund may be available depending on timing</li>
              <li><strong>After Production Begins:</strong> Cancellation is not possible once your custom product is in production</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To request a cancellation, contact us immediately at info@printsyou.com with your order number.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-primary-50 rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Questions About Returns?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              If you have questions about our return policy or need assistance with a return, please contact us:
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

export default ReturnPolicyComponent;
