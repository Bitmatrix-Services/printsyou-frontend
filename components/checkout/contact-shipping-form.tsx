'use client';

import React, {FC} from 'react';
import {Control, FieldErrors} from 'react-hook-form';
import {FormControlInput} from '@lib/form/form-control-input';
import {MaskInput} from '@lib/form/mask-input.component';
import {StripeCheckoutFormSchemaType} from '@utils/validation-schemas';

interface ContactShippingFormProps {
  control: Control<StripeCheckoutFormSchemaType>;
  errors: FieldErrors<StripeCheckoutFormSchemaType>;
  disabled?: boolean;
}

export const ContactShippingForm: FC<ContactShippingFormProps> = ({control, errors, disabled = false}) => {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-900 mb-4">Contact Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormControlInput
              label="Email Address"
              name="email"
              isRequired={true}
              disabled={disabled}
              control={control}
              errors={errors}
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          <FormControlInput
            label="First Name"
            name="firstName"
            isRequired={true}
            disabled={disabled}
            control={control}
            errors={errors}
            placeholder="John"
            autoComplete="given-name"
          />

          <FormControlInput
            label="Last Name"
            name="lastName"
            isRequired={true}
            disabled={disabled}
            control={control}
            errors={errors}
            placeholder="Smith"
            autoComplete="family-name"
          />

          <MaskInput
            label="Phone Number"
            name="phone"
            isRequired={false}
            disabled={disabled}
            control={control}
            errors={errors}
            autoComplete="tel"
          />

          <FormControlInput
            label="Company"
            name="company"
            isRequired={false}
            disabled={disabled}
            control={control}
            errors={errors}
            placeholder="Company Name (optional)"
            autoComplete="organization"
          />
        </div>
      </fieldset>
    </div>
  );
};
