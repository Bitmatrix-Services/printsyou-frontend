'use client';

import React from 'react';
import {Container} from '@components/globals/container.component';
import {FaTruck, FaBoxOpen, FaClock, FaGlobeAmericas, FaEnvelope} from 'react-icons/fa';

const ShippingPolicyComponent = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <Container>
          <div className="text-center">
            <FaTruck className="mx-auto text-5xl mb-4" />
            <h1 className="text-4xl font-bold mb-4">Shipping Policy</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Learn about our shipping methods, delivery times, and policies for getting your custom products to you.
            </p>
            <p className="text-sm opacity-75 mt-4">Last Updated: January 2025</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 max-w-4xl mx-auto">
          {/* Processing Time */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Production & Processing Time</h2>
            </div>
            <p className="text-gray-700 mb-4">
              All PrintsYou products are custom-made to order. Production time begins after you approve your digital proof and payment is confirmed.
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Typical Production Times:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Custom T-Shirts & Apparel</span>
                  <span className="font-semibold">3-5 business days</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Stickers & Labels</span>
                  <span className="font-semibold">2-4 business days</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Banners & Signs</span>
                  <span className="font-semibold">3-5 business days</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Business Cards & Print Materials</span>
                  <span className="font-semibold">3-5 business days</span>
                </li>
                <li className="flex justify-between">
                  <span>Large or Complex Orders</span>
                  <span className="font-semibold">5-10 business days</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-600 text-sm mt-4 italic">
              * Production times are estimates and may vary based on order complexity, quantity, and current order volume. We will notify you if your order requires additional time.
            </p>
          </section>

          {/* Shipping Methods */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaBoxOpen className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Shipping Methods & Delivery Times</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We offer several shipping options to meet your needs. Shipping time is in addition to production time.
            </p>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">Standard Shipping</h3>
                <p className="text-gray-700">5-7 business days after production</p>
                <p className="text-gray-600 text-sm">Most economical option for non-urgent orders</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">Expedited Shipping</h3>
                <p className="text-gray-700">2-3 business days after production</p>
                <p className="text-gray-600 text-sm">Faster delivery when you need it sooner</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">Rush/Priority Shipping</h3>
                <p className="text-gray-700">1-2 business days after production</p>
                <p className="text-gray-600 text-sm">Fastest option for time-sensitive orders</p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              Shipping rates are calculated at checkout based on your location, package weight, and selected shipping method.
            </p>
          </section>

          {/* Shipping Coverage */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaGlobeAmericas className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Where We Ship</h2>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">United States</h3>
            <p className="text-gray-700 mb-4">
              We ship to all 50 states, including Alaska and Hawaii. Some remote areas may require additional shipping time.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">International Shipping</h3>
            <p className="text-gray-700 mb-4">
              Currently, we primarily serve customers within the United States. For international orders, please contact us at info@printsyou.com to discuss shipping options and costs.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm">
                <strong>Note:</strong> International customers are responsible for any customs duties, taxes, or import fees that may be charged by their country.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
            <p className="text-gray-700 mb-4">
              Once your order ships, you will receive a shipping confirmation email with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Tracking number</li>
              <li>Link to track your package</li>
              <li>Estimated delivery date</li>
              <li>Carrier information</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Please allow 24-48 hours for tracking information to update after your package is shipped.
            </p>
          </section>

          {/* Shipping Issues */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Issues</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Lost or Delayed Packages</h3>
            <p className="text-gray-700 mb-4">
              If your package appears to be lost or significantly delayed, please contact us. We will work with the carrier to locate your package. If a package is confirmed lost, we will either reship your order or issue a refund.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Damaged Packages</h3>
            <p className="text-gray-700 mb-4">
              If your package arrives damaged, please take photos of the damaged packaging and products, then contact us within 7 days. We will arrange for a replacement or refund.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Incorrect Address</h3>
            <p className="text-gray-700 mb-4">
              Please double-check your shipping address before completing your order. If you notice an error after placing your order, contact us immediately. If a package is returned due to an incorrect address provided by the customer, reshipping costs may apply.
            </p>
          </section>

          {/* Free Shipping */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Shipping Offers</h2>
            <p className="text-gray-700">
              We occasionally offer free shipping promotions on qualifying orders. Free shipping offers apply to standard shipping within the continental United States only, unless otherwise specified. Any applicable free shipping offer will be displayed during checkout.
            </p>
          </section>

          {/* Local Pickup */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Local Pickup</h2>
            <p className="text-gray-700">
              Local pickup may be available for customers in the Dallas-Fort Worth area. Please contact us before placing your order if you would like to arrange local pickup. We will coordinate a convenient time for you to pick up your order from our location in Rowlett, TX.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-primary-50 rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Shipping Questions?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              If you have questions about shipping or need to make changes to your delivery address, please contact us:
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

export default ShippingPolicyComponent;
