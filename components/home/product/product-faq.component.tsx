'use client';
import React, {FC, useState, useEffect} from 'react';
import {FaQuestionCircle, FaChevronDown, FaChevronUp} from 'react-icons/fa';
import {FaqRoutes} from '@utils/routes/be-routes';

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}


interface ProductFAQProps {
  productId?: string;
  faqs?: FAQItem[];
}

export const ProductFAQ: FC<ProductFAQProps> = ({productId, faqs: propFaqs}) => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [faqs, setFaqs] = useState<FAQItem[]>(propFaqs || []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${FaqRoutes.productFaqs}/${productId}?includeGlobal=false`)
        .then(res => res.json())
        .then(data => {
          // Backend returns data in 'payload' field
          const faqData = data.payload || data.response || data;
          if (Array.isArray(faqData)) {
            setFaqs(faqData);
          }
        })
        .catch(err => console.error('Error fetching FAQs:', err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [productId]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Don't render if no FAQs and not loading
  if (!isLoading && faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaQuestionCircle className="w-5 h-5 text-primary" />
        Frequently Asked Questions
      </h2>

      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading FAQs...</div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 py-3 text-left font-medium hover:bg-gray-50 flex items-center justify-between"
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <FaChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm border-t border-gray-100 pt-3">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        Still have questions?{' '}
        <a href="/contact-us" className="text-primary hover:underline">
          Contact Us
        </a>{' '}
        or call{' '}
        <a href="tel:4694347035" className="text-primary hover:underline">
          (469) 434-7035
        </a>
      </div>
    </div>
  );
};
