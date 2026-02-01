'use client';

import React, {FC} from 'react';
import {FaCheck, FaShoppingCart, FaFileAlt, FaCreditCard} from 'react-icons/fa';

export type CheckoutStep = 'cart' | 'details' | 'payment' | 'confirmed';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

interface StepConfig {
  key: CheckoutStep;
  label: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {key: 'cart', label: 'Cart', icon: <FaShoppingCart className="w-4 h-4" />},
  {key: 'details', label: 'Checkout + Art', icon: <FaFileAlt className="w-4 h-4" />},
  {key: 'payment', label: 'Payment', icon: <FaCreditCard className="w-4 h-4" />},
  {key: 'confirmed', label: 'Confirmed', icon: <FaCheck className="w-4 h-4" />}
];

export const CheckoutStepper: FC<CheckoutStepperProps> = ({currentStep}) => {
  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="w-full mb-8">
      {/* Desktop stepper */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Step circle and label */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isCurrent ? 'bg-primary-500 text-white ring-4 ring-primary-100' : ''}
                    ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  {isCompleted ? <FaCheck className="w-4 h-4" /> : step.icon}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${isCompleted ? 'text-green-600' : ''}
                    ${isCurrent ? 'text-primary-600' : ''}
                    ${isUpcoming ? 'text-gray-400' : ''}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile stepper - simplified */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`
                  w-3 h-3 rounded-full transition-all
                  ${isCompleted ? 'bg-green-500' : ''}
                  ${isCurrent ? 'bg-primary-500 w-6' : ''}
                  ${index > currentStepIndex ? 'bg-gray-200' : ''}
                `}
              />
            );
          })}
        </div>
        <p className="text-center text-sm font-medium text-gray-700">
          Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.label}
        </p>
      </div>
    </div>
  );
};
