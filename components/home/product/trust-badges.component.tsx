'use client';
import React, {FC} from 'react';
import {FaShieldAlt, FaTruck, FaClock, FaCheckCircle} from 'react-icons/fa';

/**
 * =====================================================
 * TRUST BADGES Component
 * Displays trust indicators to build customer confidence
 * Placed near CTA section for maximum impact
 * =====================================================
 */

export const TrustBadges: FC = () => {
  const badges = [
    {
      icon: FaTruck,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Free Shipping',
      subtitle: 'On bulk orders ($500+)'
    },
    {
      icon: FaClock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Fast Turnaround',
      subtitle: 'Proof in 30 Minutes'
    },
    {
      icon: FaShieldAlt,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Secure Checkout',
      subtitle: 'SSL Encrypted'
    },
    {
      icon: FaCheckCircle,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Trusted',
      subtitle: 'By US Businesses'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        {badges.map(badge => (
          <div key={badge.title} className="flex flex-col items-center">
            {/* Icon Container */}
            <div className={`w-10 h-10 ${badge.iconBg} rounded-full flex items-center justify-center mb-1.5`}>
              <badge.icon className={`w-5 h-5 ${badge.iconColor}`} />
            </div>
            {/* Badge Title */}
            <div className="text-sm font-medium text-gray-900">{badge.title}</div>
            {/* Badge Subtitle */}
            <div className="text-xs text-gray-500">{badge.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
