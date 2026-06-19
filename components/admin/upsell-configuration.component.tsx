'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaGift, FaSave, FaTrash, FaPlus, FaSearch, FaClock, FaPercent, FaDollarSign, FaToggleOn, FaToggleOff, FaInfoCircle } from 'react-icons/fa';
import { UpsellConfiguration, UpsellConfigurationRequest, DiscountType, DEFAULT_UPSELL_CONFIG } from '@/types/upsell.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || '';

interface ProductSearchResult {
  id: string;
  productName: string;
  sku: string;
  productImages?: Array<{ imageUrl: string }>;
  minPrice?: number;
}

interface SelectedProduct {
  id: string;
  productName: string;
  sku: string;
  imageUrl: string;
  minPrice: number;
}

interface UpsellConfigurationPanelProps {
  storeSlug: string;
  onSave?: (config: UpsellConfiguration) => void;
}

export const UpsellConfigurationPanel: React.FC<UpsellConfigurationPanelProps> = ({
  storeSlug,
  onSave
}) => {
  // Form state
  const [enabled, setEnabled] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(10);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timerMinutes, setTimerMinutes] = useState(20);
  const [headline, setHeadline] = useState(DEFAULT_UPSELL_CONFIG.headline || '');
  const [subheadline, setSubheadline] = useState(DEFAULT_UPSELL_CONFIG.subheadline || '');
  const [badgeText, setBadgeText] = useState(DEFAULT_UPSELL_CONFIG.badgeText || '');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Product search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Load existing configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stores/${storeSlug}/upsell-config`);
        if (response.ok) {
          const config: UpsellConfiguration = await response.json();
          setEnabled(config.enabled);
          setDiscountType(config.discountType);
          setDiscountValue(config.discountValue);
          setTimerEnabled(config.timerEnabled);
          setTimerMinutes(config.timerMinutes);
          setHeadline(config.headline);
          setSubheadline(config.subheadline);
          setBadgeText(config.badgeText);

          // Fetch product details for selected products
          if (config.productIds.length > 0) {
            const productsResponse = await fetch(
              `${API_BASE_URL}/products/by-ids?ids=${config.productIds.join(',')}`
            );
            if (productsResponse.ok) {
              const products = await productsResponse.json();
              setSelectedProducts(products.map((p: any) => ({
                id: p.id,
                productName: p.productName,
                sku: p.sku,
                imageUrl: p.productImages?.[0]?.imageUrl || '',
                minPrice: p.minPrice || p.priceGrids?.[0]?.price || 0
              })));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load upsell config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [storeSlug]);

  // Search products
  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const results = await response.json();
        // Filter out already selected products
        const filtered = results.filter(
          (p: ProductSearchResult) => !selectedProducts.some(sp => sp.id === p.id)
        );
        setSearchResults(filtered);
      }
    } catch (err) {
      console.error('Product search failed:', err);
    } finally {
      setSearching(false);
    }
  }, [selectedProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // Add product to selection
  const addProduct = (product: ProductSearchResult) => {
    if (selectedProducts.length >= 4) {
      setError('Maximum 4 products allowed');
      return;
    }

    setSelectedProducts(prev => [...prev, {
      id: product.id,
      productName: product.productName,
      sku: product.sku,
      imageUrl: product.productImages?.[0]?.imageUrl || '',
      minPrice: product.minPrice || 0
    }]);

    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  // Remove product from selection
  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Save configuration
  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (enabled && selectedProducts.length === 0) {
      setError('Please select at least one product when upsell is enabled');
      return;
    }

    if (discountValue <= 0) {
      setError('Discount value must be greater than 0');
      return;
    }

    if (discountType === 'PERCENTAGE' && discountValue > 100) {
      setError('Percentage discount cannot exceed 100%');
      return;
    }

    setSaving(true);

    try {
      const payload: UpsellConfigurationRequest = {
        enabled,
        productIds: selectedProducts.map(p => p.id),
        discountType,
        discountValue,
        timerEnabled,
        timerMinutes,
        headline,
        subheadline,
        badgeText
      };

      const response = await fetch(`${API_BASE_URL}/stores/${storeSlug}/upsell-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      const savedConfig = await response.json();
      setSuccess('Upsell configuration saved successfully!');
      onSave?.(savedConfig);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Calculate preview price
  const getPreviewPrice = (originalPrice: number) => {
    if (discountType === 'PERCENTAGE') {
      return originalPrice * (1 - discountValue / 100);
    }
    return Math.max(0, originalPrice - discountValue);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <FaGift className="w-6 h-6 text-white" />
          <div>
            <h2 className="text-xl font-bold text-white">Post-Purchase Upsell</h2>
            <p className="text-white/80 text-sm">Configure upsell offers shown on the payment success page</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaInfoCircle />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Enable Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Enable Upsell Offers</h3>
            <p className="text-sm text-gray-500">Show upsell products on the checkout success page</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              enabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {enabled ? <FaToggleOn className="w-5 h-5" /> : <FaToggleOff className="w-5 h-5" />}
            {enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Product Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Selected Products</h3>
              <p className="text-sm text-gray-500">Choose 1-4 products to display as upsell offers</p>
            </div>
            {selectedProducts.length < 4 && (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>

          {/* Product Search */}
          {showSearch && (
            <div className="relative">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <FaSearch className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or SKU..."
                  className="flex-1 outline-none"
                  autoFocus
                />
                {searching && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addProduct(product)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      {product.productImages?.[0]?.imageUrl ? (
                        <img
                          src={`${ASSETS_SERVER_URL}${product.productImages[0].imageUrl}`}
                          alt={product.productName}
                          className="w-12 h-12 object-contain rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.productName}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <FaPlus className="w-4 h-4 text-green-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="relative border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <button
                  onClick={() => removeProduct(product.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
                {product.imageUrl ? (
                  <img
                    src={`${ASSETS_SERVER_URL}${product.imageUrl}`}
                    alt={product.productName}
                    className="w-full h-24 object-contain mb-2"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900 truncate">{product.productName}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{product.sku}</span>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 line-through">${product.minPrice.toFixed(2)}</span>
                    <span className="text-sm font-bold text-green-600 ml-1">
                      ${getPreviewPrice(product.minPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {selectedProducts.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                No products selected. Click &quot;Add Product&quot; to get started.
              </div>
            )}
          </div>
        </div>

        {/* Discount Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Discount Type */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900">Discount Type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setDiscountType('PERCENTAGE')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  discountType === 'PERCENTAGE'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <FaPercent className="w-4 h-4" />
                Percentage
              </button>
              <button
                onClick={() => setDiscountType('FIXED_AMOUNT')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  discountType === 'FIXED_AMOUNT'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <FaDollarSign className="w-4 h-4" />
                Fixed Amount
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900">
              Discount Value {discountType === 'PERCENTAGE' ? '(%)' : '($)'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {discountType === 'PERCENTAGE' ? '%' : '$'}
              </span>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                min={1}
                max={discountType === 'PERCENTAGE' ? 100 : 1000}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Timer Settings */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaClock className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Urgency Timer</h3>
                <p className="text-sm text-gray-500">Add countdown timer to create urgency</p>
              </div>
            </div>
            <button
              onClick={() => setTimerEnabled(!timerEnabled)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timerEnabled
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {timerEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {timerEnabled && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Timer Duration (minutes)</label>
              <input
                type="number"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value))}
                min={5}
                max={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500">Recommended: 15-30 minutes for best conversion</p>
            </div>
          )}
        </div>

        {/* Display Text Customization */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Display Customization</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="🎁 Exclusive One-Time Offer!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Subheadline</label>
            <textarea
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="Add any of these items and get {discount} off!"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500">Use {'{discount}'} to insert the discount amount dynamically</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Badge Text</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="One-Time Offer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-5 h-5" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpsellConfigurationPanel;
