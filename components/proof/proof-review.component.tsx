'use client';

import React, {FC, useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {Container} from '@components/globals/container.component';
import {useMutation, useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {LoaderWithBackdrop} from '@components/globals/loader-with-backdrop.component';
import {SuccessModal} from '@components/globals/success-modal.component';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {FaCheck, FaEdit, FaHistory, FaFileAlt, FaLock, FaTshirt} from 'react-icons/fa';
import {IoClose} from 'react-icons/io5';
import {CheckoutRoutes} from '@utils/routes/be-routes';
import {SizeBreakdown, SizeQuantity, isApparelProduct} from '@components/checkout/size-breakdown.component';
import {ShippingAddressModal} from './shipping-address-modal.component';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ProofData {
  id: string;
  quoteRequestId: string;
  status: 'DRAFT' | 'SENT' | 'CHANGES_REQUESTED' | 'APPROVED' | 'EXPIRED';
  version: number;
  proofImageUrl: string;
  proofPdfUrl: string;
  adminNotes: string;
  customerFeedback: string;
  sentAt: string;
  approvedAt: string;
  expiresAt: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  referenceNumber: number;
  productCategory: string;
  revisions: ProofRevision[];
  quotedAmount?: number;
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  source?: string;  // 'order-now' for Direct Orders, null/other for Quote Requests
  specialInstructions?: string;
  // Pricing breakdown
  quantity?: number;
  unitPrice?: number;
  setupFee?: number;
  shippingFee?: number;
  priceAdjustment?: number;
  productName?: string;
  // Sizes for apparel
  availableSizes?: string[];
  sizeBreakdown?: SizeQuantity[];
  // Flag for admin-whatsapp quotes that need shipping address
  requiresShippingAddress?: boolean;
}

interface ProofRevision {
  id: string;
  version: number;
  proofImageUrl: string;
  proofPdfUrl: string;
  adminNotes: string;
  customerFeedback: string;
  createdAt: string;
}

interface ProofReviewComponentProps {
  proofId: string;
}

export const ProofReviewComponent: FC<ProofReviewComponentProps> = ({proofId}) => {
  const searchParams = useSearchParams();
  const wasCancelled = searchParams.get('cancelled') === 'true';

  const [showRequestChanges, setShowRequestChanges] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [modalState, setModalState] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [sizeBreakdown, setSizeBreakdown] = useState<SizeQuantity[]>([]);
  const [showShippingModal, setShowShippingModal] = useState(false);

  // Show cancelled payment message on load
  useEffect(() => {
    if (wasCancelled) {
      setModalTitle('Payment Cancelled');
      setModalMessage('No worries! Your payment was cancelled and no charges were made. When you\'re ready, click "Approve & Pay" to complete your order.');
      setModalState('warning');
    }
  }, [wasCancelled]);

  // Fetch proof data
  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['proof', proofId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/proofs/${proofId}`);
      return response.data.payload as ProofData;
    },
    enabled: !!proofId
  });

  // Approve mutation (for proofs - Direct Orders that are already paid)
  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_BASE_URL}/proofs/${proofId}/approve`);
      return response.data.payload;
    },
    onSuccess: () => {
      // For Direct Orders (already paid), production begins immediately
      // For Quote Requests without payment, this button wouldn't be shown
      setModalTitle('Proof Approved!');
      setModalMessage(
        'Your proof has been approved and your order is now in production. We\'ll send you tracking information once it ships. Thank you for your business!'
      );
      setModalState('success');
      refetch();
    },
    onError: () => {
      setModalTitle('Approval Failed');
      setModalMessage('We couldn\'t approve your proof. Please try again or contact our support team.');
      setModalState('error');
    }
  });

  // Request changes mutation
  const requestChangesMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_BASE_URL}/proofs/${proofId}/request-changes`, {
        feedback
      });
      return response.data.payload;
    },
    onSuccess: () => {
      setModalTitle('Feedback Submitted');
      setModalMessage(
        'Thank you for your feedback! Our design team will review your comments and create an updated proof. You\'ll receive an email when the new version is ready.'
      );
      setModalState('success');
      setShowRequestChanges(false);
      setFeedback('');
      refetch();
    },
    onError: () => {
      setModalTitle('Submission Failed');
      setModalMessage('We couldn\'t submit your feedback. Please try again or contact our support team.');
      setModalState('error');
    }
  });

  // Handle Approve & Pay - creates Stripe session and redirects
  const handleApproveAndPay = async () => {
    if (!data?.quoteRequestId) {
      setModalTitle('Something Went Wrong');
      setModalMessage('We couldn\'t find your quote information. Please contact our support team at orders@printsyou.com for assistance.');
      setModalState('error');
      return;
    }

    // Validate size breakdown for apparel products
    if (showSizeBreakdown && !isSizeBreakdownValid) {
      setModalTitle('Size Breakdown Required');
      setModalMessage(`Please complete the size breakdown. Total must equal ${data.quantity} units.`);
      setModalState('info');
      return;
    }

    // Check if shipping address is required (admin-whatsapp flow)
    if (data.requiresShippingAddress) {
      setShowShippingModal(true);
      return;
    }

    // Proceed directly to payment
    await proceedToPayment();
  };

  // Proceed to Stripe payment
  const proceedToPayment = async () => {
    if (!data?.quoteRequestId) return;

    setIsProcessingPayment(true);

    try {
      const response = await axios.post(`${API_BASE_URL}${CheckoutRoutes.createSession}`, {
        quoteRequestId: data.quoteRequestId,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/proof/${proofId}?cancelled=true`,
        // Include size breakdown for apparel
        sizeBreakdown: showSizeBreakdown ? sizeBreakdown : null
      });

      if (response.data?.payload?.checkoutUrl) {
        // Redirect to Stripe
        window.location.href = response.data.payload.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setModalTitle('Payment Setup Failed');
      setModalMessage(
        error.response?.data?.message || 'We couldn\'t set up your payment. Please try again or contact our support team.'
      );
      setModalState('error');
      setIsProcessingPayment(false);
    }
  };

  // Handle shipping address submission success
  const handleShippingSuccess = () => {
    setShowShippingModal(false);
    // After shipping is saved, proceed to payment
    proceedToPayment();
  };

  // Handle simple approve (no payment)
  const handleApprove = () => {
    approveMutation.mutate();
  };

  const handleRequestChanges = () => {
    if (!feedback.trim()) {
      setModalTitle('Feedback Required');
      setModalMessage('Please describe the changes you need so our design team can make the perfect adjustments for you.');
      setModalState('info');
      return;
    }
    requestChangesMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, {bg: string; text: string; label: string}> = {
      DRAFT: {bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft'},
      SENT: {bg: 'bg-blue-100', text: 'text-blue-700', label: 'Awaiting Review'},
      CHANGES_REQUESTED: {bg: 'bg-orange-100', text: 'text-orange-700', label: 'Changes Requested'},
      APPROVED: {bg: 'bg-green-100', text: 'text-green-700', label: 'Approved'},
      EXPIRED: {bg: 'bg-red-100', text: 'text-red-700', label: 'Expired'}
    };
    const config = statusConfig[status] || statusConfig.DRAFT;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>{config.label}</span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return <LoaderWithBackdrop loading={true} />;
  }

  if (isError || !data) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Proof Not Found</h1>
            <p className="text-gray-600">
              This proof link may have expired or is invalid. Please contact us if you need assistance.
            </p>
          </div>
        </div>
      </Container>
    );
  }

  const isExpired = data.status === 'EXPIRED';
  const isApproved = data.status === 'APPROVED';
  const canTakeAction = data.status === 'SENT';
  const isDirectOrder = data.source === 'order-now';
  const hasQuotedAmount = data.quotedAmount && data.quotedAmount > 0;
  const isPaid = data.paymentStatus === 'PAID';

  // Determine if payment is required:
  // - Direct Orders: Already paid via Stripe checkout, no payment needed
  // - Quote Requests: Need to pay if quotedAmount exists and not yet paid
  const needsPayment = !isDirectOrder && hasQuotedAmount && !isPaid;

  // Check if this is an apparel product that needs size breakdown
  const isApparel = data.productName || data.productCategory
    ? isApparelProduct(data.productName || data.productCategory || '', [{name: data.productCategory || ''}])
    : false;

  // Standard apparel sizes
  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  const availableSizes = data.availableSizes?.length ? data.availableSizes : (isApparel ? standardSizes : []);
  const showSizeBreakdown = needsPayment && isApparel && availableSizes.length > 0 && data.quantity && data.quantity > 0;

  // Validate size breakdown
  const sizeBreakdownTotal = sizeBreakdown.reduce((sum, item) => sum + item.quantity, 0);
  const isSizeBreakdownValid = !showSizeBreakdown || sizeBreakdownTotal === (data.quantity || 0);

  return (
    <>
      <Container>
        <div className="max-w-5xl mx-auto py-8">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Proof Review</h1>
                <p className="text-gray-600 mt-1">Quote #{data.referenceNumber}</p>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(data.status)}
                <span className="text-sm text-gray-500">Version {data.version}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Customer:</span>
                  <span className="ml-2 text-gray-900 font-medium">{data.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Product:</span>
                  <span className="ml-2 text-gray-900">{data.productCategory || 'Custom Product'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sent:</span>
                  <span className="ml-2 text-gray-900">
                    {data.sentAt ? new Date(data.sentAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes - Shown prominently at top so customer sees it immediately */}
          {data.adminNotes && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5 mb-6 shadow-sm">
              <h3 className="font-bold text-blue-900 mb-2 text-lg flex items-center gap-2">
                <span className="text-xl">📝</span> Notes from Our Team
              </h3>
              <p className="text-blue-800 whitespace-pre-wrap">{data.adminNotes}</p>
            </div>
          )}

          {/* Proof Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Proof Image */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Your Proof</h2>
                  {data.proofPdfUrl && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${data.proofPdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-500 hover:text-primary-600 text-sm"
                    >
                      <FaFileAlt />
                      View PDF
                    </a>
                  )}
                </div>
                <div className="bg-gray-50 flex items-center justify-center p-2">
                  {data.proofImageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${data.proofImageUrl}`}
                      alt="Proof Preview"
                      className="max-w-full h-auto"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <FaFileAlt className="w-16 h-16 mx-auto mb-2" />
                      <p>No preview available</p>
                      {data.proofPdfUrl && <p className="text-sm mt-2">Please view the PDF for your proof.</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions from Customer */}
              {data.specialInstructions && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Your Special Instructions</h3>
                  <p className="text-yellow-800 text-sm whitespace-pre-wrap">{data.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
                <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>

                {/* Quote Pricing Breakdown - for Quote Requests that need payment */}
                {needsPayment && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h3 className="text-green-800 font-semibold mb-3 text-sm">Quote Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      {/* Product line item - show if we have quantity and unit price */}
                      {data.quantity && data.quantity > 0 && data.unitPrice && data.unitPrice > 0 ? (
                        <>
                          <div className="flex justify-between text-gray-700">
                            <span className="flex-1 pr-2">{data.productName || data.productCategory || 'Product'}</span>
                            <span className="text-right">{formatCurrency(data.quantity * data.unitPrice)}</span>
                          </div>
                          <div className="text-gray-500 text-xs">
                            {data.quantity} units × {formatCurrency(data.unitPrice)} each
                          </div>
                        </>
                      ) : data.quantity && data.quantity > 0 ? (
                        /* Show just quantity if unit price not available */
                        <div className="flex justify-between text-gray-700">
                          <span>{data.productName || data.productCategory || 'Product'}</span>
                          <span>{data.quantity} units</span>
                        </div>
                      ) : null}
                      {/* Setup Fee */}
                      {data.setupFee != null && data.setupFee > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Setup Fee</span>
                          <span>{formatCurrency(data.setupFee)}</span>
                        </div>
                      )}
                      {/* Shipping */}
                      {data.shippingFee != null && data.shippingFee > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Shipping</span>
                          <span>{formatCurrency(data.shippingFee)}</span>
                        </div>
                      )}
                      {/* Adjustment */}
                      {data.priceAdjustment != null && data.priceAdjustment !== 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Adjustment</span>
                          <span>{data.priceAdjustment > 0 ? '+' : ''}{formatCurrency(data.priceAdjustment)}</span>
                        </div>
                      )}
                      {/* Total */}
                      <div className="border-t border-green-300 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-green-800 font-semibold">Total</span>
                          <span className="text-green-900 font-bold text-lg">
                            {formatCurrency(data.quotedAmount!)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment received - for Direct Orders or paid Quote Requests */}
                {(isDirectOrder || isPaid) && hasQuotedAmount && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <FaCheck className="text-green-600" />
                      Payment received - {formatCurrency(data.quotedAmount!)}
                    </p>
                  </div>
                )}

                {isExpired && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm">
                      This proof has expired. Please contact us for a new proof link.
                    </p>
                  </div>
                )}

                {isApproved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-700 text-sm">
                      <FaCheck className="inline mr-2" />
                      This proof has been approved on {new Date(data.approvedAt).toLocaleDateString()}.
                    </p>
                  </div>
                )}

                {/* Size Breakdown for Apparel Products */}
                {showSizeBreakdown && canTakeAction && (
                  <div className={`mb-4 rounded-lg p-4 border-2 transition-all ${
                    isSizeBreakdownValid
                      ? 'bg-green-50 border-green-300'
                      : 'bg-amber-50 border-amber-400 shadow-lg shadow-amber-200'
                  }`}>
                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        isSizeBreakdownValid ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {isSizeBreakdownValid ? '✓' : '1'}
                      </div>
                      <div>
                        <span className={`text-sm font-bold ${isSizeBreakdownValid ? 'text-green-800' : 'text-amber-800'}`}>
                          {isSizeBreakdownValid ? 'Sizes Selected ✓' : 'Step 1: Select Your Sizes'}
                        </span>
                        {!isSizeBreakdownValid && (
                          <p className="text-xs text-amber-700">
                            Choose how many of each size you need, then proceed to payment
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <SizeBreakdown
                        availableSizes={availableSizes}
                        totalQuantity={data.quantity || 0}
                        onChange={setSizeBreakdown}
                        disabled={isProcessingPayment}
                      />
                    </div>

                    {!isSizeBreakdownValid && (
                      <div className="mt-3 flex items-center gap-2 text-amber-800">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">
                          After selecting sizes, click the green button below to complete your order
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Desktop CTAs - hidden on mobile */}
                {canTakeAction && !showRequestChanges && (
                  <div className="hidden lg:block">
                    {/* Approve & Pay Button (Quote Requests that need payment) */}
                    {needsPayment ? (
                      <>
                        {/* Show message when sizes need to be completed */}
                        {showSizeBreakdown && !isSizeBreakdownValid && (
                          <div className="mb-2 p-2 bg-amber-100 border border-amber-300 rounded-lg text-center">
                            <span className="text-sm text-amber-800 font-medium">
                              ↑ Please complete the size selection above first
                            </span>
                          </div>
                        )}
                        <button
                          onClick={handleApproveAndPay}
                          disabled={isProcessingPayment || !!(showSizeBreakdown && !isSizeBreakdownValid)}
                          className={`w-full py-3 px-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mb-3 ${
                            showSizeBreakdown && !isSizeBreakdownValid
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {isProcessingPayment ? (
                            <>
                              <CircularLoader />
                              Processing...
                            </>
                          ) : showSizeBreakdown && !isSizeBreakdownValid ? (
                            <>
                              <FaLock className="w-4 h-4" />
                              Complete Sizes to Continue
                            </>
                          ) : (
                            <>
                              <FaLock className="w-4 h-4" />
                              Approve & Pay - {formatCurrency(data.quotedAmount!)}
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      /* Approve Proof Button (Direct Orders or already paid Quote Requests) */
                      <button
                        onClick={handleApprove}
                        disabled={approveMutation.isPending}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
                      >
                        <FaCheck />
                        {approveMutation.isPending ? 'Approving...' : 'Approve Proof'}
                      </button>
                    )}

                    <button
                      onClick={() => setShowRequestChanges(true)}
                      disabled={isProcessingPayment}
                      className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaEdit />
                      Request Changes
                    </button>

                    {needsPayment && (
                      <p className="text-xs text-center text-gray-500 mt-3">
                        <FaLock className="inline w-3 h-3 mr-1" />
                        Secure payment powered by Stripe
                      </p>
                    )}
                  </div>
                )}

                {showRequestChanges && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Request Changes</h3>
                      <button onClick={() => setShowRequestChanges(false)} className="text-gray-400 hover:text-gray-600">
                        <IoClose className="w-5 h-5" />
                      </button>
                    </div>
                    <textarea
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Please describe what changes you need..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    />
                    <button
                      onClick={handleRequestChanges}
                      disabled={requestChangesMutation.isPending || !feedback.trim()}
                      className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {requestChangesMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                )}

                {/* Revision History */}
                {data.revisions && data.revisions.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm w-full"
                    >
                      <FaHistory />
                      {showHistory ? 'Hide' : 'Show'} Version History ({data.revisions.length})
                    </button>

                    {showHistory && (
                      <div className="mt-4 space-y-3">
                        {data.revisions.map(revision => (
                          <div key={revision.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">Version {revision.version}</span>
                              <span className="text-gray-500">{new Date(revision.createdAt).toLocaleDateString()}</span>
                            </div>
                            {revision.customerFeedback && (
                              <p className="text-gray-600 text-xs mt-1">
                                <span className="font-medium">Feedback:</span> {revision.customerFeedback}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Help Text */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-500 text-xs">
                    Need help? Contact us at{' '}
                    <a href="mailto:info@printsyou.com" className="text-primary-500 hover:underline">
                      info@printsyou.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Sticky CTA Bar */}
      {canTakeAction && !showRequestChanges && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-lg mx-auto space-y-2">
            {/* Approve & Pay Button (Quote Requests that need payment) */}
            {needsPayment ? (
              <>
                {/* Show message when sizes need to be completed */}
                {showSizeBreakdown && !isSizeBreakdownValid && (
                  <div className="mb-2 p-2 bg-amber-100 border border-amber-300 rounded-lg text-center">
                    <span className="text-sm text-amber-800 font-medium">
                      ↑ Scroll up to select your sizes first
                    </span>
                  </div>
                )}
                <button
                  onClick={handleApproveAndPay}
                  disabled={isProcessingPayment || !!(showSizeBreakdown && !isSizeBreakdownValid)}
                  className={`w-full py-3 px-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    showSizeBreakdown && !isSizeBreakdownValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <CircularLoader />
                      Processing...
                    </>
                  ) : showSizeBreakdown && !isSizeBreakdownValid ? (
                    <>
                      <FaLock className="w-4 h-4" />
                      Complete Sizes to Continue
                    </>
                  ) : (
                    <>
                      <FaLock className="w-4 h-4" />
                      Approve & Pay - {formatCurrency(data.quotedAmount!)}
                    </>
                  )}
                </button>
              </>
            ) : (
              /* Approve Proof Button (Direct Orders or already paid Quote Requests) */
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FaCheck />
                {approveMutation.isPending ? 'Approving...' : 'Approve Proof'}
              </button>
            )}

            <button
              onClick={() => setShowRequestChanges(true)}
              disabled={isProcessingPayment}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              <FaEdit className="w-3 h-3" />
              Request Changes
            </button>

            {needsPayment && (
              <p className="text-xs text-center text-gray-500">
                <FaLock className="inline w-3 h-3 mr-1" />
                Secure payment via Stripe
              </p>
            )}
          </div>
        </div>
      )}

      {/* Spacer for mobile sticky CTA */}
      {canTakeAction && !showRequestChanges && (
        <div className="lg:hidden h-40" />
      )}

      <SuccessModal
        open={modalState}
        onClose={setModalState as any}
        title={modalTitle}
        note={modalMessage}
        buttonText={modalState === 'success' ? 'Got it!' : modalState === 'warning' ? 'Okay' : 'Close'}
      />

      {/* Shipping Address Modal for Admin-Initiated Quotes */}
      <ShippingAddressModal
        open={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        onSuccess={handleShippingSuccess}
        proofId={proofId}
        customerName={data?.customerName}
        totalAmount={data?.quotedAmount}
      />
    </>
  );
};
