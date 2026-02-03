'use client';

import React, {FC, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Modal, ModalDialog, ModalClose} from '@mui/joy';
import {FormControlInput} from '@lib/form/form-control-input';
import {FormControlSelect} from '@lib/form/form-control-select';
import {MaskInput} from '@lib/form/mask-input.component';
import Option from '@mui/joy/Option';
import {statesList} from '@utils/constants';
import {shippingAddressSchema, ShippingAddressFormSchemaType} from '@utils/validation-schemas';
import {CircularLoader} from '@components/globals/circular-loader.component';
import axios from 'axios';
import {ProofRoutes} from '@utils/routes/be-routes';
import {FaTruck, FaLock} from 'react-icons/fa';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ShippingAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  proofId: string;
  customerName?: string;
  totalAmount?: number;
}

export const ShippingAddressModal: FC<ShippingAddressModalProps> = ({
  open,
  onClose,
  onSuccess,
  proofId,
  customerName,
  totalAmount
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ShippingAddressFormSchemaType>({
    resolver: yupResolver(shippingAddressSchema),
    defaultValues: {
      phoneNumber: '',
      shippingAddressLine1: '',
      shippingAddressLine2: '',
      shippingCity: '',
      shippingState: '',
      shippingZipCode: ''
    }
  });

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = methods;

  const onSubmit = async (data: ShippingAddressFormSchemaType) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(
        `${API_BASE_URL}${ProofRoutes.updateShippingAddress.replace('{id}', proofId)}`,
        data
      );
      onSuccess();
    } catch (err: any) {
      console.error('Error updating shipping address:', err);
      setError(
        err.response?.data?.message ||
          'Failed to save shipping address. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        sx={{
          maxWidth: 500,
          width: '95%',
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3
        }}
      >
        <ModalClose />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaTruck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
              <p className="text-sm text-gray-500">Where should we ship your order?</p>
            </div>
          </div>
          {customerName && (
            <p className="text-sm text-gray-600 mt-2">
              Hi <span className="font-medium">{customerName}</span>, please provide your shipping address to complete your order.
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Phone Number */}
            <MaskInput
              label="Phone Number"
              name="phoneNumber"
              isRequired={true}
              disabled={isSubmitting}
              control={control}
              errors={errors}
            />

            {/* Street Address */}
            <FormControlInput
              label="Street Address"
              name="shippingAddressLine1"
              isRequired={true}
              disabled={isSubmitting}
              control={control}
              errors={errors}
              placeholder="123 Main St"
            />

            {/* Address Line 2 */}
            <FormControlInput
              label="Apt, Suite, Unit (optional)"
              name="shippingAddressLine2"
              isRequired={false}
              disabled={isSubmitting}
              control={control}
              errors={errors}
              placeholder="Apt 4B"
            />

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControlInput
                label="City"
                name="shippingCity"
                isRequired={true}
                disabled={isSubmitting}
                control={control}
                errors={errors}
                placeholder="Dallas"
              />

              <FormControlSelect
                name="shippingState"
                label="State"
                isRequired={true}
                disabled={isSubmitting}
                control={control}
                errors={errors}
              >
                {statesList.map(state => (
                  <Option key={state.value} value={state.value}>
                    {state.name}
                  </Option>
                ))}
              </FormControlSelect>
            </div>

            {/* Zip Code */}
            <FormControlInput
              label="ZIP Code"
              name="shippingZipCode"
              isRequired={true}
              disabled={isSubmitting}
              control={control}
              errors={errors}
              placeholder="75001"
            />

            {/* Order Total */}
            {totalAmount && totalAmount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <CircularLoader />
                  Saving...
                </>
              ) : (
                <>
                  <FaLock className="w-4 h-4" />
                  Continue to Payment
                </>
              )}
            </button>

            {/* Cancel Link */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>

            {/* Security Note */}
            <p className="text-xs text-center text-gray-500 mt-4">
              <FaLock className="inline w-3 h-3 mr-1" />
              Your information is secure and encrypted
            </p>
          </form>
        </FormProvider>
      </ModalDialog>
    </Modal>
  );
};
