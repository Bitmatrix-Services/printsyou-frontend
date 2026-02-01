'use client';

import React, {FC} from 'react';
import Link from 'next/link';
import {useAppSelector} from '../../store/hooks';
import {selectCartRootState} from '../../store/slices/cart/cart.slice';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {FaShoppingCart} from 'react-icons/fa';

interface OrderSummaryProps {
  showEditLink?: boolean;
  className?: string;
}

export const OrderSummary: FC<OrderSummaryProps> = ({showEditLink = true, className = ''}) => {
  const cartRoot = useAppSelector(selectCartRootState);
  const cartItems = cartRoot?.cartItems ?? [];
  const totalPrice = cartRoot?.totalCartPrice ?? 0;

  if (cartItems.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
        <div className="text-center py-8">
          <FaShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-sm text-gray-500 mb-4">Add some items to get started</p>
          <Link href="/" className="text-primary-500 hover:underline text-sm font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Order Summary</h2>
        {showEditLink && (
          <Link href="/cart" className="text-sm text-primary-500 hover:underline">
            Edit Cart
          </Link>
        )}
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-start gap-3">
            {/* Product Image */}
            <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
              <ImageWithFallback
                width={64}
                height={64}
                src={item.imageUrl}
                alt={item.productName}
                style={{objectFit: 'contain', width: '100%', height: '100%'}}
              />
            </div>

            {/* Product Details */}
            <div className="flex-grow min-w-0">
              <h4
                className="text-sm font-medium text-gray-800 line-clamp-2"
                dangerouslySetInnerHTML={{__html: item.productName}}
              />
              <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-600">
                  Qty: {item.qtyRequested} × ${item.priceQuotedPerItem?.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-gray-900">${item.itemTotalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-500 italic">Calculated after checkout</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Setup/Art Fees</span>
          <span className="text-gray-500 italic">If applicable</span>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Estimated Total</span>
            <span className="font-bold text-lg text-gray-900">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-4">
        <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          Final total including shipping and any additional charges will be confirmed before payment.
        </p>
      </div>
    </div>
  );
};
