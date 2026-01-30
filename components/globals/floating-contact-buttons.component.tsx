'use client';
import React, {FC, useState, useCallback} from 'react';
import {FaWhatsapp} from 'react-icons/fa';
import {HiX} from 'react-icons/hi';

const WHATSAPP_NUMBER = '14694347035';

interface FloatingContactButtonsProps {
  show?: boolean;
}

export const FloatingContactButtons: FC<FloatingContactButtonsProps> = ({show = true}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Analytics helper
  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
    console.log('[Analytics]', eventName, params);
  }, []);

  const handleWhatsAppClick = useCallback(() => {
    trackEvent('whatsapp_click', {source: 'floating_button'});
  }, [trackEvent]);

  const getWhatsAppLink = () => {
    const message = `Hi, I'm interested in your promotional products. Can you help me with a quote?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  if (!show) return null;

  // Minimized state - just show small WhatsApp icon
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 z-30 lg:bottom-6">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-colors"
          aria-label="Open WhatsApp chat"
        >
          <FaWhatsapp className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-30 lg:bottom-6">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-56">
        {/* Header */}
        <div className="bg-green-500 px-3 py-2 flex items-center justify-between">
          <span className="text-white text-sm font-medium">Need Help?</span>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Minimize"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-xs text-gray-600 mb-3">
            Chat with us on WhatsApp for quick assistance!
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <FaWhatsapp className="w-4 h-4" />
            Start Chat
          </a>
        </div>
      </div>
    </div>
  );
};
