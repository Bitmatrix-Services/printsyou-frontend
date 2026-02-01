'use client';
import React, {FC, useState, useEffect} from 'react';
import {FaWhatsapp} from 'react-icons/fa';
import {IoClose} from 'react-icons/io5';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: FC<WhatsAppButtonProps> = ({
  phoneNumber = '14694347035',
  defaultMessage = 'Hi! I have a question about custom printing.'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Show expanded tooltip after user scrolls a bit (engagement signal)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !hasScrolled) {
        setHasScrolled(true);
        setIsExpanded(true);
        // Auto-collapse after 5 seconds
        setTimeout(() => setIsExpanded(false), 5000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    // bottom-20 on mobile to avoid covering sticky CTA, bottom-4 on desktop
    <div className="fixed bottom-20 sm:bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {/* Expanded message bubble */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-[280px] animate-fade-in">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200"
          >
            <IoClose className="w-3 h-3 text-gray-500" />
          </button>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Need help with your order?</span>
            <br />
            Chat with our team about customization, bulk pricing, or artwork questions.
          </p>
          <button
            onClick={handleClick}
            className="mt-2 w-full bg-[#25D366] text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
          >
            <FaWhatsapp className="w-4 h-4" />
            Start Chat
          </button>
        </div>
      )}

      {/* WhatsApp FAB */}
      <button
        onClick={() => isExpanded ? handleClick() : setIsExpanded(true)}
        onMouseEnter={() => setIsExpanded(true)}
        className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
        {/* Show text on mobile only when not expanded */}
        <span className="hidden sm:inline text-sm font-medium pr-1">Chat with us</span>
      </button>

      {/* Mobile-only persistent hint (shows once) */}
      {!hasScrolled && (
        <div className="sm:hidden absolute -top-1 -left-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
      )}
    </div>
  );
};
