'use client';
import React, {FC} from 'react';
import {FaShieldAlt, FaTruck, FaHeadset, FaClock} from 'react-icons/fa';

export const TrustBadges: FC = () => {
  const badges = [
    {
      icon: FaShieldAlt,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Secure Checkout',
      subtitle: 'SSL Encrypted'
    },
    {
      icon: FaTruck,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Free Shipping',
      subtitle: 'On orders $500+'
    },
    {
      icon: FaHeadset,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: '24/7 Support',
      subtitle: 'Always here to help'
    },
    {
      icon: FaClock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Fast Turnaround',
      subtitle: 'Proof in 2 Hours*'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        {badges.map(badge => (
          <div key={badge.title} className="flex flex-col items-center">
            <div className={`w-10 h-10 ${badge.iconBg} rounded-full flex items-center justify-center mb-1.5`}>
              <badge.icon className={`w-5 h-5 ${badge.iconColor}`} />
            </div>
            <div className="text-sm font-medium text-gray-900">{badge.title}</div>
            <div className="text-xs text-gray-500">{badge.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
