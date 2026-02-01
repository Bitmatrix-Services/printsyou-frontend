'use client';

import React, {FC} from 'react';
import {Control, FieldErrors} from 'react-hook-form';
import {FormControlInput} from '@lib/form/form-control-input';
import {FormControlSelect} from '@lib/form/form-control-select';
import {MaskInput} from '@lib/form/mask-input.component';
import Option from '@mui/joy/Option';
import {statesList} from '@utils/constants';
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
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
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
          />

          <FormControlInput
            label="Last Name"
            name="lastName"
            isRequired={true}
            disabled={disabled}
            control={control}
            errors={errors}
            placeholder="Smith"
          />

          <MaskInput
            label="Phone Number"
            name="phone"
            isRequired={false}
            disabled={disabled}
            control={control}
            errors={errors}
          />

          <FormControlInput
            label="Company"
            name="company"
            isRequired={false}
            disabled={disabled}
            control={control}
            errors={errors}
            placeholder="Company Name (optional)"
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormControlInput
              label="Street Address"
              name="address"
              isRequired={true}
              disabled={disabled}
              control={control}
              errors={errors}
              placeholder="123 Main St"
            />
          </div>

          <div className="md:col-span-2">
            <FormControlInput
              label="Apt, Suite, Unit (optional)"
              name="addressLine2"
              isRequired={false}
              disabled={disabled}
              control={control}
              errors={errors}
              placeholder="Apt 4B"
            />
          </div>

          <FormControlInput
            label="City"
            name="city"
            isRequired={true}
            disabled={disabled}
            control={control}
            errors={errors}
            placeholder="Dallas"
          />

          <FormControlSelect
            name="state"
            label="State"
            isRequired={true}
            disabled={disabled}
            control={control}
            errors={errors}
          >
            {statesList.map(state => (
              <Option key={state.value} value={state.value}>
                {state.name}
              </Option>
            ))}
          </FormControlSelect>

          <FormControlInput
            label="ZIP Code"
            name="zipCode"
            isRequired={true}
            disabled={disabled}
            control={control}
            errors={errors}
            placeholder="75001"
          />
        </div>
      </div>
    </div>
  );
};
