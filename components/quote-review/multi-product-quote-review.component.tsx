'use client';

import React, {FC, useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {Container} from '@components/globals/container.component';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {LoaderWithBackdrop} from '@components/globals/loader-with-backdrop.component';
import {SuccessModal} from '@components/globals/success-modal.component';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {FaCheck, FaEdit, FaFileAlt, FaLock, FaBoxOpen, FaTruck, FaClipboardCheck} from 'react-icons/fa';
import {IoClose} from 'react-icons/io5';
import {CheckoutRoutes} from '@utils/routes/be-routes';
import {ShippingAddressModal} from '@components/proof/shipping-address-modal.component';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL;

type ProofStatus = 'DRAFT' | 'SENT' | 'CHANGES_REQUESTED' | 'APPROVED' | 'EXPIRED';

interface Proof {
  id: string;
  status: ProofStatus;
  version: number;
  proofImageUrl?: string;
  proofPdfUrl?: string;
  adminNotes?: string;
  customerFeedback?: string;
  sentAt?: string;
  approvedAt?: string;
}

interface SizeQuantity {
  size: string;
  quantity: number;
}

interface QuoteRequestItem {
  id: string;
  quoteRequestId: string;
  productId?: string;
  productSku?: string;
  productName?: string;
  productCategory?: string;
  quantity: number;
  unitPrice?: number;
  setupFee?: number;
  itemSubtotal?: number;
  proofId?: string;
  positionNumber: number;
  itemNotes?: string;
  sizeBreakdown?: SizeQuantity[];
  proof?: Proof;
}

interface ShippingAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface QuoteData {
  id: string;
  referenceNumber: number;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  companyName?: string;
  status: string;
  quotedAmount?: number;
  itemsSubtotal?: number;
  shippingFee?: number;
  priceAdjustment?: number;
  paymentStatus?: string;
  adminNotes?: string;
  shippingAddress?: ShippingAddress;
  isMultiProduct?: boolean;
  items?: QuoteRequestItem[];
  createdAt?: number;
  requiresShippingAddress?: boolean;
}

interface MultiProductQuoteReviewComponentProps {
  quoteRequestId: string;
}

export const MultiProductQuoteReviewComponent: FC<MultiProductQuoteReviewComponentProps> = ({quoteRequestId}) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const wasCancelled = searchParams.get('cancelled') === 'true';

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [modalState, setModalState] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);

  // Size quantities state (customer fills these in)
  const [itemSizes, setItemSizes] = useState<Record<string, SizeQuantity[]>>({});

  // Show cancelled payment message on load
  useEffect(() => {
    if (wasCancelled) {
      setModalTitle('Payment Cancelled');
      setModalMessage('No worries! Your payment was cancelled and no charges were made. When you\'re ready, approve all items and proceed to payment.');
      setModalState('warning');
    }
  }, [wasCancelled]);

  // Fetch quote data with items
  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['quoteReview', quoteRequestId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/quote-review/${quoteRequestId}`);
      return response.data.payload as QuoteData;
    },
    enabled: !!quoteRequestId
  });

  // Initialize sizes from loaded data
  useEffect(() => {
    if (data?.items) {
      const initialSizes: Record<string, SizeQuantity[]> = {};
      data.items.forEach(item => {
        if (item.sizeBreakdown && item.sizeBreakdown.length > 0) {
          initialSizes[item.id] = item.sizeBreakdown;
        }
      });
      setItemSizes(initialSizes);
    }
  }, [data]);

  // Size management helpers
  const updateSizeQuantity = (itemId: string, index: number, quantity: number) => {
    setItemSizes(prev => {
      const currentSizes = prev[itemId] || data?.items?.find(i => i.id === itemId)?.sizeBreakdown || [];
      const updatedSizes = currentSizes.map((s, i) =>
        i === index ? {...s, quantity} : s
      );
      return {...prev, [itemId]: updatedSizes};
    });
  };

  const getTotalSizeQuantity = (itemId: string) => {
    const item = data?.items?.find(i => i.id === itemId);
    const sizes = itemSizes[itemId] || item?.sizeBreakdown || [];
    return sizes.reduce((sum, s) => sum + (s.quantity || 0), 0);
  };

  // Approve single item mutation
  const approveItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await axios.post(`${API_BASE_URL}/quote-review/${quoteRequestId}/items/${itemId}/approve`);
      return response.data.payload;
    },
    onSuccess: () => {
      setModalTitle('Item Approved!');
      setModalMessage('This item has been approved. Please review and approve other items to proceed to payment.');
      setModalState('success');
      refetch();
    },
    onError: () => {
      setModalTitle('Approval Failed');
      setModalMessage('We couldn\'t approve this item. Please try again or contact our support team.');
      setModalState('error');
    }
  });

  // Request changes for item mutation
  const requestChangesMutation = useMutation({
    mutationFn: async ({itemId, feedback}: {itemId: string; feedback: string}) => {
      const response = await axios.post(`${API_BASE_URL}/quote-review/${quoteRequestId}/items/${itemId}/request-changes`, {
        feedback
      });
      return response.data.payload;
    },
    onSuccess: () => {
      setModalTitle('Feedback Submitted');
      setModalMessage('Thank you for your feedback! Our design team will review your comments and create an updated proof. You\'ll receive an email when the new version is ready.');
      setModalState('success');
      setActiveItemId(null);
      setFeedback('');
      refetch();
    },
    onError: () => {
      setModalTitle('Submission Failed');
      setModalMessage('We couldn\'t submit your feedback. Please try again or contact our support team.');
      setModalState('error');
    }
  });

  // Approve all items mutation
  const approveAllMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_BASE_URL}/quote-review/${quoteRequestId}/approve-all`);
      return response.data.payload;
    },
    onSuccess: () => {
      setModalTitle('All Items Approved!');
      setModalMessage('All items have been approved. You can now proceed to payment.');
      setModalState('success');
      refetch();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'We couldn\'t approve all items. Some items may have pending changes.';
      setModalTitle('Approval Failed');
      setModalMessage(message);
      setModalState('error');
    }
  });

  const handleApproveItem = async (itemId: string, item: QuoteRequestItem) => {
    // Check if item has sizes defined that need quantities
    const hasSizes = item.sizeBreakdown && item.sizeBreakdown.length > 0;

    if (hasSizes) {
      const sizes = itemSizes[itemId] || item.sizeBreakdown || [];
      const totalQty = sizes.reduce((sum, s) => sum + (s.quantity || 0), 0);

      // Validate total matches item quantity
      if (totalQty !== item.quantity) {
        setModalTitle('Size Quantities Required');
        setModalMessage(`Please enter quantities for each size. Total must equal ${item.quantity} units. You've entered ${totalQty} units.`);
        setModalState('info');
        return;
      }

      // Save sizes first, then approve
      try {
        await axios.put(
          `${API_BASE_URL}/quote-review/${quoteRequestId}/items/${itemId}/sizes`,
          {sizeBreakdown: sizes}
        );
      } catch (error) {
        setModalTitle('Failed to Save Sizes');
        setModalMessage('We couldn\'t save your size selections. Please try again.');
        setModalState('error');
        return;
      }
    }

    // Now approve the item
    approveItemMutation.mutate(itemId);
  };

  const handleRequestChanges = (itemId: string) => {
    if (!feedback.trim()) {
      setModalTitle('Feedback Required');
      setModalMessage('Please describe the changes you need so our design team can make the perfect adjustments for you.');
      setModalState('info');
      return;
    }
    requestChangesMutation.mutate({itemId, feedback});
  };

  const handleApproveAll = async () => {
    const items = data?.items || [];

    // Check all items with sizes have valid quantities
    for (const item of items) {
      if (item.sizeBreakdown && item.sizeBreakdown.length > 0) {
        const sizes = itemSizes[item.id] || item.sizeBreakdown;
        const totalQty = sizes.reduce((sum, s) => sum + (s.quantity || 0), 0);

        if (totalQty !== item.quantity) {
          setModalTitle('Size Quantities Required');
          setModalMessage(`Please enter quantities for "${item.productName}". Total must equal ${item.quantity} units.`);
          setModalState('info');
          return;
        }

        // Save sizes for this item
        try {
          await axios.put(
            `${API_BASE_URL}/quote-review/${quoteRequestId}/items/${item.id}/sizes`,
            {sizeBreakdown: sizes}
          );
        } catch (error) {
          setModalTitle('Failed to Save Sizes');
          setModalMessage(`We couldn't save sizes for "${item.productName}". Please try again.`);
          setModalState('error');
          return;
        }
      }
    }

    // All sizes saved, now approve all
    approveAllMutation.mutate();
  };

  // Handle Approve All & Pay
  const handleApproveAndPay = async () => {
    if (!data?.id) {
      setModalTitle('Something Went Wrong');
      setModalMessage('We couldn\'t find your quote information. Please contact our support team.');
      setModalState('error');
      return;
    }

    // Check if shipping address is required
    if (data.requiresShippingAddress) {
      setShowShippingModal(true);
      return;
    }

    await proceedToPayment();
  };

  // Proceed to Stripe payment
  const proceedToPayment = async () => {
    if (!data?.id) return;

    setIsProcessingPayment(true);

    try {
      const response = await axios.post(`${API_BASE_URL}${CheckoutRoutes.createSession}`, {
        quoteRequestId: data.id,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/quote-review/${quoteRequestId}?cancelled=true`
      });

      if (response.data?.payload?.checkoutUrl) {
        window.location.href = response.data.payload.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setModalTitle('Payment Setup Failed');
      setModalMessage(error.response?.data?.message || 'We couldn\'t set up your payment. Please try again or contact our support team.');
      setModalState('error');
      setIsProcessingPayment(false);
    }
  };

  const handleShippingSuccess = () => {
    setShowShippingModal(false);
    proceedToPayment();
  };

  const getStatusBadge = (status: ProofStatus) => {
    const statusConfig: Record<ProofStatus, {bg: string; text: string; label: string}> = {
      DRAFT: {bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft'},
      SENT: {bg: 'bg-blue-100', text: 'text-blue-700', label: 'Awaiting Review'},
      CHANGES_REQUESTED: {bg: 'bg-orange-100', text: 'text-orange-700', label: 'Changes Requested'},
      APPROVED: {bg: 'bg-green-100', text: 'text-green-700', label: 'Approved'},
      EXPIRED: {bg: 'bg-red-100', text: 'text-red-700', label: 'Expired'}
    };
    const config = statusConfig[status] || statusConfig.DRAFT;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quote Not Found</h1>
            <p className="text-gray-600">
              This quote link may have expired or is invalid. Please contact us if you need assistance.
            </p>
          </div>
        </div>
      </Container>
    );
  }

  const items = data.items || [];
  const approvedCount = items.filter(item => item.proof?.status === 'APPROVED').length;
  const totalItems = items.length;
  const allApproved = approvedCount === totalItems && totalItems > 0;
  const hasQuotedAmount = data.quotedAmount && data.quotedAmount > 0;
  const isPaid = data.paymentStatus === 'PAID';
  const needsPayment = hasQuotedAmount && !isPaid;
  const canProceedToPayment = allApproved && needsPayment;
  const hasChangesRequested = items.some(item => item.proof?.status === 'CHANGES_REQUESTED');

  return (
    <>
      <Container>
        <div className="max-w-6xl mx-auto py-8">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quote Review</h1>
                <p className="text-gray-600 mt-1">Quote #{data.referenceNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  allApproved ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {approvedCount}/{totalItems} Items Approved
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Customer:</span>
                  <span className="ml-2 text-gray-900 font-medium">{data.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-900">{data.emailAddress}</span>
                </div>
                <div>
                  <span className="text-gray-500">Items:</span>
                  <span className="ml-2 text-gray-900">{totalItems} products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes - Show prominently */}
          {data.adminNotes && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5 mb-6 shadow-sm">
              <h3 className="font-bold text-blue-900 mb-2 text-lg flex items-center gap-2">
                <span className="text-xl">📝</span> Notes from Our Team
              </h3>
              <p className="text-blue-800 whitespace-pre-wrap">{data.adminNotes}</p>
            </div>
          )}

          {/* Changes Requested Alert */}
          {hasChangesRequested && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-700 text-sm">
                <strong>Note:</strong> One or more items have changes requested. Our team is working on updated proofs. You'll receive an email when they're ready.
              </p>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {items.map((item, index) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Item Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900">{item.productName || 'Product'}</h3>
                  </div>
                  {item.proof && getStatusBadge(item.proof.status)}
                </div>

                {/* Proof Image */}
                <div className="bg-gray-50 p-4">
                  {item.proof?.proofImageUrl ? (
                    <img
                      src={`${ASSETS_URL}${item.proof.proofImageUrl}`}
                      alt={`Proof for ${item.productName}`}
                      className="max-w-full h-auto mx-auto max-h-64 object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-center py-12">
                      <FaFileAlt className="w-12 h-12 mx-auto mb-2" />
                      <p>No proof image available</p>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 text-gray-900 font-medium">{item.quantity} units</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="ml-2 text-gray-900 font-semibold">
                        {formatCurrency(item.itemSubtotal || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Size Breakdown - Customer fills in quantities */}
                  {item.sizeBreakdown && item.sizeBreakdown.length > 0 && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Enter Quantities by Size:
                        </span>
                        <span className="text-xs text-gray-500">
                          Total needed: {item.quantity} units
                        </span>
                      </div>

                      {item.proof?.status === 'APPROVED' ? (
                        // Already approved - show read-only sizes
                        <div className="flex flex-wrap gap-2">
                          {(itemSizes[item.id] || item.sizeBreakdown).map((sb, idx) => (
                            <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">
                              {sb.size}: {sb.quantity}
                            </span>
                          ))}
                        </div>
                      ) : (
                        // Not approved yet - editable size quantities
                        <>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                            {(itemSizes[item.id] || item.sizeBreakdown).map((sb, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white rounded px-2 py-1 border border-gray-200">
                                <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                                  {sb.size}:
                                </span>
                                <input
                                  type="number"
                                  value={itemSizes[item.id]?.[idx]?.quantity ?? sb.quantity}
                                  onChange={e => updateSizeQuantity(item.id, idx, parseInt(e.target.value) || 0)}
                                  min={0}
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            ))}
                          </div>

                          <div className={`text-sm ${getTotalSizeQuantity(item.id) === item.quantity ? 'text-green-600' : 'text-orange-600'}`}>
                            Total entered: {getTotalSizeQuantity(item.id)} / {item.quantity} units
                            {getTotalSizeQuantity(item.id) !== item.quantity && (
                              <span className="ml-1">
                                ({getTotalSizeQuantity(item.id) < item.quantity ? 'Need ' + (item.quantity - getTotalSizeQuantity(item.id)) + ' more' : (getTotalSizeQuantity(item.id) - item.quantity) + ' extra'})
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Item Notes */}
                  {item.itemNotes && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded">
                      <span className="text-sm text-yellow-800">{item.itemNotes}</span>
                    </div>
                  )}

                  {/* Admin Notes for this item's proof */}
                  {item.proof?.adminNotes && (
                    <div className="mb-3 p-2 bg-blue-50 rounded">
                      <span className="text-sm text-blue-800">
                        <strong>Notes:</strong> {item.proof.adminNotes}
                      </span>
                    </div>
                  )}

                  {/* PDF Link */}
                  {item.proof?.proofPdfUrl && (
                    <div className="mb-3">
                      <a
                        href={`${ASSETS_URL}${item.proof.proofPdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <FaFileAlt className="w-3 h-3" />
                        View PDF
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {item.proof?.status === 'SENT' && (
                    <>
                      {activeItemId === item.id ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Request Changes</span>
                            <button
                              onClick={() => {
                                setActiveItemId(null);
                                setFeedback('');
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <IoClose className="w-5 h-5" />
                            </button>
                          </div>
                          <textarea
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            placeholder="Please describe the changes you need..."
                            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                          />
                          <button
                            onClick={() => handleRequestChanges(item.id)}
                            disabled={requestChangesMutation.isPending || !feedback.trim()}
                            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 text-sm"
                          >
                            {requestChangesMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveItem(item.id, item)}
                            disabled={approveItemMutation.isPending}
                            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                          >
                            <FaCheck className="w-3 h-3" />
                            {approveItemMutation.isPending ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => setActiveItemId(item.id)}
                            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <FaEdit className="w-3 h-3" />
                            Changes
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {item.proof?.status === 'APPROVED' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-700 text-sm flex items-center justify-center gap-2">
                        <FaCheck />
                        Approved {item.proof.approvedAt && `on ${new Date(item.proof.approvedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  )}

                  {item.proof?.status === 'CHANGES_REQUESTED' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-orange-700 text-sm font-medium mb-1">Changes Requested</p>
                      {item.proof.customerFeedback && (
                        <p className="text-orange-600 text-xs">{item.proof.customerFeedback}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pricing Breakdown */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBoxOpen className="text-gray-600" />
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-3 mb-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">#{index + 1}</span>
                        <span className="text-gray-700">{item.productName}</span>
                        <span className="text-gray-500">({item.quantity} units)</span>
                      </div>
                      <span className="text-gray-900 font-medium">
                        {formatCurrency(item.itemSubtotal || 0)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(data.itemsSubtotal || 0)}</span>
                  </div>

                  {(data.shippingFee || 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">{formatCurrency(data.shippingFee || 0)}</span>
                    </div>
                  )}

                  {(data.priceAdjustment || 0) !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Adjustment</span>
                      <span className={data.priceAdjustment! < 0 ? 'text-green-600' : 'text-gray-900'}>
                        {data.priceAdjustment! > 0 ? '+' : ''}{formatCurrency(data.priceAdjustment || 0)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(data.quotedAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
                <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>

                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Approval Progress</span>
                    <span className="text-sm font-medium text-gray-900">{approvedCount}/{totalItems}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${allApproved ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{width: `${totalItems > 0 ? (approvedCount / totalItems) * 100 : 0}%`}}
                    />
                  </div>
                </div>

                {isPaid ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <FaCheck className="text-green-600" />
                      Payment received - {formatCurrency(data.quotedAmount || 0)}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Approve All Button - Show when not all approved */}
                    {!allApproved && items.some(item => item.proof?.status === 'SENT') && (
                      <button
                        onClick={handleApproveAll}
                        disabled={approveAllMutation.isPending || hasChangesRequested}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
                      >
                        <FaClipboardCheck />
                        {approveAllMutation.isPending ? 'Approving...' : 'Approve All Items'}
                      </button>
                    )}

                    {/* Payment Button - Show when all approved */}
                    {canProceedToPayment && (
                      <button
                        onClick={handleApproveAndPay}
                        disabled={isProcessingPayment}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
                      >
                        {isProcessingPayment ? (
                          <>
                            <CircularLoader />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaLock className="w-4 h-4" />
                            Pay {formatCurrency(data.quotedAmount || 0)}
                          </>
                        )}
                      </button>
                    )}

                    {canProceedToPayment && (
                      <p className="text-xs text-center text-gray-500 mb-4">
                        <FaLock className="inline w-3 h-3 mr-1" />
                        Secure payment powered by Stripe
                      </p>
                    )}

                    {!allApproved && !hasChangesRequested && (
                      <p className="text-sm text-gray-500 text-center">
                        Review and approve all items above to proceed to payment.
                      </p>
                    )}

                    {hasChangesRequested && (
                      <p className="text-sm text-orange-600 text-center">
                        Some items have changes requested. Please wait for updated proofs.
                      </p>
                    )}
                  </>
                )}

                {/* What Happens Next */}
                {(allApproved || isPaid) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FaTruck className="text-gray-500" />
                      What's Next?
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">1.</span>
                        {isPaid ? 'Payment received - thank you!' : 'Complete payment securely via Stripe'}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">2.</span>
                        We'll begin production of your items
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">3.</span>
                        You'll receive tracking when your order ships
                      </li>
                    </ul>
                  </div>
                )}

                {/* Help Text */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-500 text-xs">
                    Need help? Contact us at{' '}
                    <a href="mailto:info@printsyou.com" className="text-blue-600 hover:underline">
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
      {needsPayment && !isPaid && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-lg mx-auto">
            {canProceedToPayment ? (
              <>
                <button
                  onClick={handleApproveAndPay}
                  disabled={isProcessingPayment}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <CircularLoader />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="w-4 h-4" />
                      Pay {formatCurrency(data.quotedAmount || 0)}
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  <FaLock className="inline w-3 h-3 mr-1" />
                  Secure payment via Stripe
                </p>
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {approvedCount}/{totalItems} items approved
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{width: `${totalItems > 0 ? (approvedCount / totalItems) * 100 : 0}%`}}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Approve all items to proceed to payment
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer for mobile sticky CTA */}
      {needsPayment && !isPaid && <div className="lg:hidden h-32" />}

      <SuccessModal
        open={modalState}
        onClose={setModalState as any}
        title={modalTitle}
        note={modalMessage}
        buttonText={modalState === 'success' ? 'Got it!' : modalState === 'warning' ? 'Okay' : 'Close'}
      />

      {/* Shipping Address Modal */}
      <ShippingAddressModal
        open={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        onSuccess={handleShippingSuccess}
        proofId={quoteRequestId}
        customerName={data?.fullName}
        totalAmount={data?.quotedAmount}
      />
    </>
  );
};
