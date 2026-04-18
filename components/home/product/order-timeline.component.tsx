'use client';
import React, {FC} from 'react';
import {FaClipboardList, FaPaintBrush, FaCog, FaTruck} from 'react-icons/fa';

/**
 * =====================================================
 * HOW IT WORKS - Process Timeline Component
 * Shows the 4-step ordering process to build trust
 * =====================================================
 */

interface OrderTimelineProps {
  productionDays?: number;
  shippingDays?: string;
}

export const OrderTimeline: FC<OrderTimelineProps> = ({productionDays = 4}) => {
  // Timeline steps with icons and descriptions
  const steps = [
    {
      step: 1,
      icon: FaClipboardList,
      label: 'Place Order',
      description: 'Order or request quote',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600'
    },
    {
      step: 2,
      icon: FaPaintBrush,
      label: 'Logo Proof',
      description: '30 mins - 2 hours',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      step: 3,
      icon: FaCog,
      label: 'Production',
      description: `${productionDays}-${productionDays + 2} days`,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      step: 4,
      icon: FaTruck,
      label: 'Delivery',
      description: 'Fast shipping',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Section Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        How It Works
      </h3>

      {/* Steps Grid - Responsive layout */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {steps.map((item, index) => (
          <div key={item.step} className="relative flex flex-col items-center text-center">
            {/* Connecting Line (except for last item) */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 hidden md:block" />
            )}

            {/* Step Icon */}
            <div
              className={`relative z-10 w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center mb-2`}
            >
              <item.icon className={`w-4 h-4 ${item.iconColor}`} />
            </div>

            {/* Step Label */}
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              {item.label}
            </div>

            {/* Step Description */}
            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 leading-tight">
              {item.description}
            </div>
          </div>
        ))}
      </div>

      {/* Rush Option Notice */}
      <div className="mt-4 p-2 bg-green-50 rounded text-xs text-green-700 text-center">
        <span className="font-medium">Need it faster?</span> Rush production available - contact us!
      </div>
    </div>
  );
};
