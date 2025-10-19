'use client';

import Link from 'next/link';
import React, {useState} from 'react';

// Mock Container component since it's not available
const Container = ({children}: {children: React.ReactNode}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);

export const ThreePLServicesDetails = () => {
  const [calculator, setCalculator] = useState({
    serviceType: 'fba',
    quantity: '',
    packageType: 'regular'
  });

  const calculatePrice = () => {
    const quantity = parseInt(calculator.quantity) || 0;
    if (quantity <= 0) return null;

    let price = 0;
    let priceText = '';

    if (calculator.serviceType === 'fba') {
      if (quantity >= 1 && quantity <= 29) {
        price = quantity * 1.0;
      } else if (quantity >= 30 && quantity <= 50) {
        price = quantity * 0.75;
      } else if (quantity > 50) {
        price = quantity * 0.5;
      }
      priceText = `$${price.toFixed(2)}`;
    } else if (calculator.serviceType === 'fbm') {
      if (calculator.packageType === 'regular') {
        price = quantity * 2.25;
        priceText = `$${price.toFixed(2)}`;
      } else {
        priceText = 'Contact Us';
      }
    } else if (calculator.serviceType === 'storage') {
      price = quantity * 0.5;
      priceText = `$${price.toFixed(2)}/month`;
    }

    return priceText;
  };

  const ServiceCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    highlight?: boolean;
  }> = ({title, icon, children, highlight = false}) => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${highlight ? 'border-primary-200 bg-gradient-to-br from-primary-50 to-white' : 'border-gray-100'}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${highlight ? 'bg-primary-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white flex items-center justify-center text-xl font-bold`}
        >
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  const PricingTier: React.FC<{range: string; price: string; highlight?: boolean}> = ({
    range,
    price,
    highlight = false
  }) => (
    <div
      className={`p-3 rounded-lg border-l-4 ${highlight ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-primary-500'} mb-2`}
    >
      <div className="font-semibold text-gray-700 text-sm">{range}</div>
      <div className={`font-bold text-lg ${highlight ? 'text-green-600' : 'text-primary-600'}`}>{price}</div>
    </div>
  );

  interface FreeServiceItemProps {
    name: string;
    icon: string;
  }

  const FreeServiceItem: React.FC<{name: string; icon: string}> = ({name, icon}) => (
    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
      <div className="w-8 h-8 bg-green-500 rounded-lg text-white flex items-center justify-center text-sm">{icon}</div>
      <span className="text-gray-700 font-medium">{name}</span>
      <span className="ml-auto bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">FREE</span>
    </div>
  );

  const estimatedPrice = calculatePrice();

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <Container>
        {/* Hero Section with Warehouse Background */}
        <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background warehouse image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              alt="Conveyor belt system with packages and cardboard boxes in fulfillment center"
              className="w-full h-full object-cover"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
          </div>

          {/* Central content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
              🚀 Streamline Your Business
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Iconic eCommerce brands
              <br />
              need fulfillment they can trust.
              <br />
              <span className="text-blue-600">So they choose us.</span>
            </h1>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="font-semibold text-gray-700">3PL + Fulfillment</span>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-semibold text-gray-700">Fast Delivery</span>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="font-semibold text-gray-700">Lower Shipping Rates</span>
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From FBA prep to storage solutions, we handle your fulfillment so you can focus on growing your business.
            </p>

            {/* CTA Button */}
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
              <a href="/contact-us">Get a Quote 🚀</a>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-16 h-16 bg-blue-200 rounded-lg opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-green-200 rounded-lg opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-32 w-8 h-8 bg-purple-200 rounded-lg opacity-30 animate-pulse delay-500"></div>
        </div>

        {/* Quick Calculator - Enhanced */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-8 shadow-2xl border border-blue-100 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100 to-transparent rounded-full translate-y-24 -translate-x-24 opacity-50"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-4 shadow-lg">
                  <span className="text-2xl">💰</span>
                  Quick Price Calculator
                </div>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                  Get an instant estimate for your fulfillment needs - no hidden fees, transparent pricing
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1">
                  <label className="block font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                    Service Type
                  </label>
                  <div className="relative">
                    <select
                      value={calculator.serviceType}
                      onChange={e => setCalculator({...calculator, serviceType: e.target.value})}
                      className="w-full p-4 pr-8 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white shadow-sm font-medium"
                    >
                      <option value="fba">📦 FBA Services</option>
                      <option value="fbm">🏷️ FBM Services</option>
                      <option value="storage">🏪 Storage</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                    Quantity/Units
                  </label>
                  <input
                    type="number"
                    value={calculator.quantity}
                    onChange={e => setCalculator({...calculator, quantity: e.target.value})}
                    placeholder="e.g., 1000"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white shadow-sm font-medium"
                    min="1"
                  />
                </div>
                <div className="lg:col-span-1">
                  <label className="block font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                    Package Type
                  </label>
                  <div className="relative">
                    <select
                      value={calculator.packageType}
                      onChange={e => setCalculator({...calculator, packageType: e.target.value})}
                      className="w-full p-4 pr-8 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white shadow-sm font-medium"
                    >
                      <option value="regular">📏 Regular Size</option>
                      <option value="medium">📐 Medium/Large</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1 flex items-end">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Calculate 🚀
                  </button>
                </div>
              </div>

              {estimatedPrice && (
                <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white p-8 rounded-2xl text-center shadow-2xl transform animate-pulse">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">💸</span>
                    <h3 className="text-2xl font-bold">Your Estimated Cost</h3>
                    <span className="text-3xl">💸</span>
                  </div>
                  <div className="text-5xl font-black mb-2">{estimatedPrice}</div>
                  <p className="text-green-100 text-lg">Ready to get started? Contact us for a detailed quote!</p>
                </div>
              )}

              {!estimatedPrice && calculator.quantity && (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-8 rounded-2xl text-center">
                  <div className="text-4xl mb-4">🤔</div>
                  <p className="text-gray-600 text-lg">Enter a quantity to see your estimate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* FBA Services */}
          <ServiceCard title="FBA Services" icon="📦">
            <PricingTier range="1-29 Units" price="$1.00/Unit" />
            <PricingTier range="30-50 Units" price="$0.75/Unit" />
            <PricingTier range="50+ Units" price="$0.50/Unit" highlight />
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-yellow-800 font-medium">Shipping to AWH: Cost + 10%</span>
              </div>
            </div>
          </ServiceCard>

          {/* FBM Services */}
          <ServiceCard title="FBM Services" icon="🏷️">
            <PricingTier range="Regular Size Package" price="$2.25/Label" />
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <div className="font-semibold text-gray-700 text-sm">Medium & Large Items</div>
              <div className="font-bold text-lg text-blue-600">Contact Us for Pricing</div>
            </div>
            <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              <a href="/contact-us">Get Custom Quote</a>
            </button>
          </ServiceCard>

          {/* Storage */}
          <ServiceCard title="Storage Solutions" icon="🏪">
            <PricingTier range="Monthly Storage Rate" price="$0.50/Unit/Month" />
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <span className="text-xl">🎉</span>
                <div>
                  <div className="font-bold">First 7 Days FREE!</div>
                  <div className="text-sm">No storage fees for your first week</div>
                </div>
              </div>
            </div>
          </ServiceCard>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🔧 Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg text-white flex items-center justify-center text-xl mb-3">
                📦
              </div>
              <h3 className="font-bold text-gray-800 mb-2">New Box</h3>
              <p className="text-green-600 font-semibold">$1.50 - $3.50</p>
              <p className="text-gray-500 text-sm">Size dependent</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg text-white flex items-center justify-center text-xl mb-3">
                🫧
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Bubble Wrap</h3>
              <p className="text-green-600 font-semibold">$0.50/item</p>
              <p className="text-gray-500 text-sm">For fragile items</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg text-white flex items-center justify-center text-xl mb-3">
                📋
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Multi-Pack 2-3</h3>
              <p className="text-green-600 font-semibold">$0.50</p>
              <p className="text-gray-500 text-sm">Bundle packaging</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg text-white flex items-center justify-center text-xl mb-3">
                📦
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Multi-Pack 4-6</h3>
              <p className="text-green-600 font-semibold">$0.70</p>
              <p className="text-gray-500 text-sm">Larger bundles</p>
            </div>
          </div>
        </div>

        {/* Free Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🆓 Included Free Services</h2>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FreeServiceItem name="Inventory Receiving" icon="📥" />
              <FreeServiceItem name="FNSKU Labeling" icon="🏷️" />
              <FreeServiceItem name="Sticker Removal" icon="🗑️" />
              <FreeServiceItem name="Expiration Labels" icon="⏰" />
              <FreeServiceItem name="Package Material" icon="🛍️" />
              <FreeServiceItem name="Volume Discounts" icon="💰" />
              <FreeServiceItem name="Product Inspection" icon="🔍" />
              <FreeServiceItem name="7 Days Free Storage" icon="🏪" />
              <FreeServiceItem name="Invoice Scanning" icon="📄" />
              <FreeServiceItem name="Product Pictures" icon="📸" />
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <ServiceCard title="Why Choose PackPro?" icon="⭐" highlight>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="font-semibold text-gray-800">Affordable Rates</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="font-semibold text-gray-800">Free Basic Services</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="font-semibold text-gray-800">Beginner-Friendly</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="font-semibold text-gray-800">24/7 Customer Support</span>
              </div>
            </div>
          </ServiceCard>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Fulfillment?</h2>
          <p className="text-xl mb-6 opacity-90">Join hundreds of businesses who trust us with their 3PL needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact-us"
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Get Quote Now
            </a>
            <a
              href="https://wa.me/14694347035"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 border-2 border-green-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-600 hover:border-green-600 transition-colors text-lg"
              aria-label="Chat with us on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 2.11.55 4.08 1.6 5.86L.5 23.5l5.79-1.55A11.46 11.46 0 0012 23.5c6.27 0 11.5-5.23 11.5-11.5S18.27.5 12 .5zm0 20.77c-1.88 0-3.71-.5-5.3-1.44l-.38-.22-3.44.92.92-3.36-.25-.39a9.5 9.5 0 01-1.47-5.18c0-5.27 4.28-9.55 9.55-9.55s9.55 4.28 9.55 9.55-4.28 9.55-9.55 9.55zm5.43-7.13c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.18c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.76-1.68-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.05 1.02-1.05 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.07 4.49.71.3 1.27.47 1.7.6.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.41-.07-.1-.27-.17-.57-.32z" />
              </svg>
              WhatsApp (469) 434-7035
            </a>
            <a
              href="tel:14694347035"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              📞 Call (469) 434-7035
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ThreePLServicesDetails;
