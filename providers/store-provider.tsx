'use client';

import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {StoreConfig, StoreType, B2B_STORE_CONFIG, getStoreConfigFromHostname} from '@/config/stores';

// Store context value type
interface StoreContextValue {
  store: StoreConfig;
  isB2B: boolean;
  isRetail: boolean;
  hasFeature: (feature: keyof StoreConfig['features']) => boolean;
  storeId: string;
  storeType: StoreType;
}

// Create context with default B2B config
const StoreContext = createContext<StoreContextValue>({
  store: B2B_STORE_CONFIG,
  isB2B: true,
  isRetail: false,
  hasFeature: () => true,
  storeId: B2B_STORE_CONFIG.id,
  storeType: 'B2B'
});

interface StoreProviderProps {
  children: ReactNode;
  initialStoreId?: string;
}

/**
 * Store provider for multi-tenant frontend.
 * Detects store from hostname and provides store configuration to children.
 */
export function StoreProvider({children, initialStoreId}: StoreProviderProps) {
  const [store, setStore] = useState<StoreConfig>(B2B_STORE_CONFIG);

  useEffect(() => {
    // Detect store from hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const detectedStore = getStoreConfigFromHostname(hostname);
      setStore(detectedStore);
    }
  }, []);

  // Memoized context value
  const contextValue: StoreContextValue = {
    store,
    isB2B: store.storeType === 'B2B',
    isRetail: store.storeType === 'RETAIL',
    hasFeature: (feature) => store.features[feature],
    storeId: store.id,
    storeType: store.storeType
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

/**
 * Hook to access current store configuration.
 */
export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

/**
 * Hook to check if current store is B2B.
 */
export function useIsB2B(): boolean {
  const {isB2B} = useStore();
  return isB2B;
}

/**
 * Hook to check if current store is Retail.
 */
export function useIsRetail(): boolean {
  const {isRetail} = useStore();
  return isRetail;
}

/**
 * Hook to check if a feature is enabled for current store.
 */
export function useHasFeature(feature: keyof StoreConfig['features']): boolean {
  const {hasFeature} = useStore();
  return hasFeature(feature);
}

/**
 * Hook to get store-specific checkout config.
 */
export function useCheckoutConfig() {
  const {store} = useStore();
  return store.checkout;
}

/**
 * Higher-order component for store-aware components.
 */
export function withStore<P extends object>(
  Component: React.ComponentType<P & {store: StoreConfig}>
) {
  return function WithStoreComponent(props: P) {
    const {store} = useStore();
    return <Component {...props} store={store} />;
  };
}

export default StoreProvider;
