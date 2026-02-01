'use client';
import React, {FC, useMemo} from 'react';
import {FaCalendarAlt, FaInfoCircle} from 'react-icons/fa';

interface OrderTimelineProps {
  productionDays?: number;
  shippingDays?: string;
}

export const OrderTimeline: FC<OrderTimelineProps> = ({productionDays = 4, shippingDays = '8-10'}) => {
  const timeline = useMemo(() => {
    const today = new Date();
    const proofDate = new Date(today);
    proofDate.setDate(today.getDate() + 1);

    const productionEndDate = new Date(proofDate);
    productionEndDate.setDate(proofDate.getDate() + productionDays);

    const deliveryStartDate = new Date(productionEndDate);
    const shippingMin = parseInt(shippingDays.split('-')[0]) || 8;
    const shippingMax = parseInt(shippingDays.split('-')[1]) || 10;
    deliveryStartDate.setDate(productionEndDate.getDate() + shippingMin);

    const deliveryEndDate = new Date(productionEndDate);
    deliveryEndDate.setDate(productionEndDate.getDate() + shippingMax);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    };

    return [
      {
        step: 1,
        label: 'Order Today',
        date: formatDate(today),
        active: true
      },
      {
        step: 2,
        label: 'Proof Ready',
        date: formatDate(proofDate),
        active: false
      },
      {
        step: 3,
        label: 'Production',
        date: `${productionDays} days`,
        active: false
      },
      {
        step: 4,
        label: 'Delivery',
        date: `${formatDate(deliveryStartDate)}-${formatDate(deliveryEndDate).split(' ')[1]}`,
        active: false
      }
    ];
  }, [productionDays, shippingDays]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <FaCalendarAlt className="w-4 h-4 text-primary-500" />
        Your Order Timeline
      </h3>

      <div className="flex items-start justify-between relative px-2">
        {/* Progress Line */}
        <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-200" />

        {timeline.map(item => (
          <div key={item.step} className="relative z-10 flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                item.active ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              {item.step}
            </div>
            <div className="mt-2 text-center">
              <div className="text-xs font-medium text-gray-700">{item.label}</div>
              <div className="text-xs text-gray-500">{item.date}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700 flex items-center gap-2">
        <FaInfoCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Need it faster? Rush production available - contact us for details</span>
      </div>
    </div>
  );
};
