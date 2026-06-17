'use client';

/**
 * =============================================================================
 * PRODUCT CUSTOMIZER COMPONENT - PrintsYou Version
 * =============================================================================
 * Product customization engine with canvas-based preview rendering.
 *
 * Features:
 * - Real product image backgrounds
 * - Locked text/logo placement zones from backend configuration
 * - Dynamic contrast detection for automatic text color
 * - Auto-scaling text to prevent overflow
 * - View selector tabs (Front/Back/Side) based on available views
 * =============================================================================
 */

import React, {useState, useRef, useEffect, useCallback, useMemo, FC} from 'react';
import {
  PositionConfig,
  ImageViewType,
  ProductImageWithZones,
  ViewCustomization,
  CustomizationData,
} from './product.types';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ProductType = 'jersey' | 'polo' | 'hoodie' | 'cap' | 'tshirt' | 'default';
export type FontStyle = 'product-default' | 'varsity' | 'modern';

export interface ColorOption {
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface FontConfig {
  fontFamily?: string;
  fontColor?: string;
}

export interface ProductCustomizerProps {
  productType?: ProductType;
  baseImageUrl: string;
  productImages?: ProductImageWithZones[];
  productColor?: string;
  productColorName?: string;
  onCustomizationChange?: (data: CustomizationData) => void;
  initialData?: Partial<CustomizationData>;
  canvasWidth?: number;
  canvasHeight?: number;
  onAddToCart?: (customizationData?: CustomizationData) => void;
  isAddingToCart?: boolean;
  enableColorChange?: boolean;
  selectedSize?: string | null;
  numberFontConfig?: FontConfig;
  nameFontConfig?: FontConfig;
  defaultLogoPosition?: PositionConfig;
  defaultNumberPosition?: PositionConfig;
  defaultNamePosition?: PositionConfig;
  onClose?: () => void;
}

interface PrintZone {
  x: number;
  y: number;
  width?: number;
  height?: number;
  maxWidth: number;
  fontSize: number;
  align: CanvasTextAlign;
  charge?: number;
  chargeDesc?: string;
}

interface LogoZone {
  x: number;
  y: number;
  width?: number;
  height?: number;
  maxSize: number;
  label: string;
  charge?: number;
  chargeDesc?: string;
}

interface ProductPrintConfig {
  name: PrintZone | null;
  number: PrintZone | null;
  logo: LogoZone | null;
}

// =============================================================================
// DEFAULT PRINT ZONE CONFIGURATION (FALLBACK)
// =============================================================================

const DEFAULT_PRINT_ZONES: Record<ProductType, ProductPrintConfig> = {
  jersey: {
    name: {x: 0.5, y: 0.26, maxWidth: 0.65, fontSize: 36, align: 'center'},
    number: {x: 0.5, y: 0.48, maxWidth: 0.45, fontSize: 80, align: 'center'},
    logo: {x: 0.5, y: 0.72, maxSize: 0.15, label: 'Center Chest'},
  },
  polo: {
    name: {x: 0.5, y: 0.28, maxWidth: 0.6, fontSize: 32, align: 'center'},
    number: {x: 0.5, y: 0.48, maxWidth: 0.4, fontSize: 72, align: 'center'},
    logo: {x: 0.28, y: 0.32, maxSize: 0.1, label: 'Left Chest'},
  },
  tshirt: {
    name: {x: 0.5, y: 0.26, maxWidth: 0.65, fontSize: 34, align: 'center'},
    number: {x: 0.5, y: 0.46, maxWidth: 0.45, fontSize: 76, align: 'center'},
    logo: {x: 0.5, y: 0.7, maxSize: 0.14, label: 'Center Chest'},
  },
  hoodie: {
    name: {x: 0.5, y: 0.3, maxWidth: 0.55, fontSize: 30, align: 'center'},
    number: {x: 0.5, y: 0.48, maxWidth: 0.4, fontSize: 64, align: 'center'},
    logo: {x: 0.5, y: 0.68, maxSize: 0.12, label: 'Center Chest'},
  },
  cap: {
    name: {x: 0.5, y: 0.82, maxWidth: 0.7, fontSize: 16, align: 'center'},
    number: {x: 0.5, y: 0.42, maxWidth: 0.3, fontSize: 52, align: 'center'},
    logo: {x: 0.5, y: 0.28, maxSize: 0.22, label: 'Front Center'},
  },
  default: {
    name: {x: 0.5, y: 0.26, maxWidth: 0.65, fontSize: 34, align: 'center'},
    number: {x: 0.5, y: 0.46, maxWidth: 0.45, fontSize: 76, align: 'center'},
    logo: {x: 0.5, y: 0.7, maxSize: 0.14, label: 'Center'},
  },
};

const FONT_STACKS: Record<FontStyle, string> = {
  'product-default': '"Impact", "Haettenschweiler", "Arial Narrow Bold", sans-serif',
  varsity: '"Impact", "Haettenschweiler", "Arial Narrow Bold", sans-serif',
  modern: '"Bebas Neue", "Oswald", "Arial Black", sans-serif',
};

const CONTRAST_PALETTES = {
  dark: {
    primary: '#FFFFFF',
    secondary: '#FFC107',
    outline: 'rgba(0, 0, 0, 0.4)',
  },
  light: {
    primary: '#0D1B3D',
    secondary: '#1A1A1A',
    outline: 'rgba(255, 255, 255, 0.4)',
  },
};

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

const MAX_NAME_LENGTH = 12;
const MAX_NUMBER_LENGTH = 2;
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_LOGO_SIZE_MB = 5;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getContrastPalette(hexColor: string | null | undefined): typeof CONTRAST_PALETTES.dark {
  if (!hexColor) return CONTRAST_PALETTES.dark; // Default to dark palette for null/undefined
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) || 0;
  const g = parseInt(hex.substr(2, 2), 16) || 0;
  const b = parseInt(hex.substr(4, 2), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? CONTRAST_PALETTES.dark : CONTRAST_PALETTES.light;
}

function getFontStack(fontFamily: string | undefined, defaultStyle: FontStyle = 'varsity'): string {
  if (!fontFamily) return FONT_STACKS[defaultStyle];
  return `"${fontFamily}", ${FONT_STACKS.varsity}`;
}

function calculateFittedFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  baseFontSize: number,
  maxWidth: number,
  fontFamily: string
): number {
  let fontSize = baseFontSize;
  ctx.font = `900 ${fontSize}px ${fontFamily}`;

  while (ctx.measureText(text).width > maxWidth && fontSize > 12) {
    fontSize -= 2;
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
  }

  return fontSize;
}

function drawTextWithOutline(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillColor: string,
  outlineColor: string | null,
  outlineWidth: number = 2
) {
  if (outlineColor) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
}

function calculateFontSizeFromZoneHeight(
  zoneHeight: number | undefined,
  type: 'name' | 'number',
  canvasHeight: number = 480
): number {
  if (!zoneHeight || zoneHeight <= 0) {
    return type === 'number' ? 80 : 36;
  }
  const zoneHeightPx = zoneHeight * canvasHeight;
  const scaleFactor = type === 'number' ? 0.75 : 0.6;
  const fontSize = Math.round(zoneHeightPx * scaleFactor);
  const minSize = type === 'number' ? 24 : 16;
  const maxSize = type === 'number' ? 200 : 100;
  return Math.max(minSize, Math.min(maxSize, fontSize));
}

function positionConfigToZone(
  config: PositionConfig | undefined | null,
  type: 'name' | 'number' | 'logo',
  defaultConfig: PrintZone | LogoZone | null,
  useDefaultIfNotConfigured: boolean = false,
  canvasHeight: number = 480
): PrintZone | LogoZone | null {
  const isConfigured =
    config != null &&
    config.enabled === true &&
    typeof config.x === 'number' &&
    typeof config.y === 'number';

  if (!isConfigured) {
    return useDefaultIfNotConfigured && defaultConfig ? defaultConfig : null;
  }

  const x = config.x as number;
  const y = config.y as number;

  if (type === 'logo') {
    return {
      x: x + (config.width || 0) / 2,
      y: y + (config.height || 0) / 2,
      width: config.width,
      height: config.height,
      maxSize: Math.max(config.width || 0.15, config.height || 0.15),
      label: config.chargeDescription || 'Logo',
      charge: config.chargeAmount,
      chargeDesc: config.chargeDescription,
    };
  }

  const baseConfig = defaultConfig as PrintZone | null;
  const calculatedFontSize = config.height
    ? calculateFontSizeFromZoneHeight(config.height, type, canvasHeight)
    : baseConfig?.fontSize || (type === 'number' ? 80 : 36);

  return {
    x: x + (config.width || 0) / 2,
    y: y + (config.height || 0) / 2,
    width: config.width,
    height: config.height,
    maxWidth: config.width || baseConfig?.maxWidth || 0.5,
    fontSize: calculatedFontSize,
    align: 'center',
    charge: config.chargeAmount,
    chargeDesc: config.chargeDescription,
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';

export const ProductCustomizer: FC<ProductCustomizerProps> = ({
  productType = 'default',
  baseImageUrl,
  productImages = [],
  productColor = '#0D1B3D',
  productColorName,
  onCustomizationChange,
  initialData = {},
  canvasWidth = 600,
  canvasHeight = 700,
  onAddToCart,
  isAddingToCart = false,
  enableColorChange = false,
  selectedSize,
  numberFontConfig,
  nameFontConfig,
  defaultLogoPosition,
  defaultNumberPosition,
  defaultNamePosition,
  onClose,
}) => {
  // Mobile detection for responsive canvas
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // View selection state
  const [currentView, setCurrentView] = useState<ImageViewType>('FRONT');

  // Per-view customization state
  const [viewCustomizations, setViewCustomizations] = useState<Record<ImageViewType, ViewCustomization>>(() => {
    const initial: Record<ImageViewType, ViewCustomization> = {
      FRONT: {},
      BACK: {},
      SIDE: {},
    };
    if (initialData.viewCustomizations) {
      if (initialData.viewCustomizations.FRONT) initial.FRONT = {...initialData.viewCustomizations.FRONT};
      if (initialData.viewCustomizations.BACK) initial.BACK = {...initialData.viewCustomizations.BACK};
      if (initialData.viewCustomizations.SIDE) initial.SIDE = {...initialData.viewCustomizations.SIDE};
    } else {
      if (initialData.playerName) initial.FRONT.playerName = initialData.playerName;
      if (initialData.playerNumber) initial.FRONT.playerNumber = initialData.playerNumber;
      if (initialData.customText) initial.FRONT.customText = initialData.customText;
      if (initialData.logoDataUrl) initial.FRONT.logoDataUrl = initialData.logoDataUrl;
    }
    return initial;
  });

  const updateCurrentViewCustomization = useCallback(
    (updates: Partial<ViewCustomization>) => {
      setViewCustomizations(prev => ({
        ...prev,
        [currentView]: {
          ...prev[currentView],
          ...updates,
        },
      }));
    },
    [currentView]
  );

  const playerName = viewCustomizations[currentView]?.playerName || '';
  const playerNumber = viewCustomizations[currentView]?.playerNumber || '';
  const customText = viewCustomizations[currentView]?.customText || '';

  const [fontStyle] = useState<FontStyle>(initialData.fontStyle || 'product-default');
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dpr, setDpr] = useState(1);

  // Primary logo (shared across all views by default)
  const [primaryLogoDataUrl, setPrimaryLogoDataUrl] = useState<string | null>(
    initialData.logoDataUrl || null
  );

  // Different logos for front/back
  const [useDifferentLogos, setUseDifferentLogos] = useState(initialData.useDifferentLogos || false);
  const [backLogoDataUrl, setBackLogoDataUrl] = useState<string | null>(
    initialData.backLogoDataUrl || null
  );
  const [backLogoImage, setBackLogoImage] = useState<HTMLImageElement | null>(null);

  // Use primary logo for all views; back logo only used when useDifferentLogos is true
  const logoDataUrl = primaryLogoDataUrl;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, 2));
  }, []);

  // View and position configuration
  const viewImages = useMemo(() => {
    const result: Record<ImageViewType, ProductImageWithZones | undefined> = {
      FRONT: undefined,
      BACK: undefined,
      SIDE: undefined,
    };

    productImages?.forEach(img => {
      if (img.viewType) {
        result[img.viewType] = img;
      }
    });

    return result;
  }, [productImages]);

  const availableViews = useMemo(() => {
    return (['FRONT', 'BACK', 'SIDE'] as ImageViewType[]).filter(view => viewImages[view]);
  }, [viewImages]);

  useEffect(() => {
    if (availableViews.length > 0 && !availableViews.includes(currentView)) {
      setCurrentView(availableViews[0]);
    }
  }, [availableViews, currentView]);

  const currentImage = viewImages[currentView];

  const currentImageUrl = useMemo(() => {
    if (currentImage?.imageUrl) {
      const imgUrl = currentImage.imageUrl;
      if (imgUrl.startsWith('http')) return imgUrl;
      return `${ASSETS_SERVER_URL}${imgUrl}`;
    }
    if (baseImageUrl.startsWith('http')) return baseImageUrl;
    return `${ASSETS_SERVER_URL}${baseImageUrl}`;
  }, [currentImage, baseImageUrl]);

  // Print configuration - only show zones that are explicitly configured
  const printConfig = useMemo((): ProductPrintConfig => {
    const frontendDefaults = DEFAULT_PRINT_ZONES[productType];

    // Product default positions
    const productDefaultName = defaultNamePosition?.enabled
      ? (positionConfigToZone(defaultNamePosition, 'name', frontendDefaults.name, false, canvasHeight) as PrintZone | null)
      : null;
    const productDefaultNumber = defaultNumberPosition?.enabled
      ? (positionConfigToZone(defaultNumberPosition, 'number', frontendDefaults.number, false, canvasHeight) as PrintZone | null)
      : null;
    const productDefaultLogo = defaultLogoPosition?.enabled
      ? (positionConfigToZone(defaultLogoPosition, 'logo', frontendDefaults.logo!) as LogoZone | null)
      : null;

    if (!currentImage) {
      return {
        name: productDefaultName,
        number: productDefaultNumber,
        logo: productDefaultLogo,
      };
    }

    // Image-specific zones
    const imageNameZone = currentImage.namePosition?.enabled
      ? (positionConfigToZone(currentImage.namePosition, 'name', frontendDefaults.name, false, canvasHeight) as PrintZone | null)
      : null;
    const imageNumberZone = currentImage.numberPosition?.enabled
      ? (positionConfigToZone(currentImage.numberPosition, 'number', frontendDefaults.number, false, canvasHeight) as PrintZone | null)
      : null;
    const imageLogoZone = currentImage.logoPosition?.enabled
      ? (positionConfigToZone(currentImage.logoPosition, 'logo', frontendDefaults.logo!) as LogoZone | null)
      : null;

    return {
      name: imageNameZone || productDefaultName,
      number: imageNumberZone || productDefaultNumber,
      logo: imageLogoZone || productDefaultLogo,
    };
  }, [currentImage, productType, canvasHeight, defaultLogoPosition, defaultNumberPosition, defaultNamePosition]);

  // Check if any zones are configured (show customizer only if at least one zone is configured)
  const hasConfiguredZones = printConfig.name || printConfig.number || printConfig.logo;

  // Debug logging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🎨 ProductCustomizer Debug:');
      console.log('  - baseImageUrl:', baseImageUrl);
      console.log('  - productImages:', productImages?.length || 0);
      console.log('  - printConfig:', printConfig);
      console.log('  - hasConfiguredZones:', hasConfiguredZones);
      console.log('  - defaultLogoPosition:', defaultLogoPosition);
      console.log('  - defaultNumberPosition:', defaultNumberPosition);
      console.log('  - defaultNamePosition:', defaultNamePosition);
    }
  }, [baseImageUrl, productImages, printConfig, hasConfiguredZones, defaultLogoPosition, defaultNumberPosition, defaultNamePosition]);

  // Font settings
  const effectiveNumberFontFamily = useMemo(() => {
    const zoneFontFamily = currentImage?.numberPosition?.fontFamily;
    if (zoneFontFamily) return getFontStack(zoneFontFamily, fontStyle);
    if (numberFontConfig?.fontFamily) return getFontStack(numberFontConfig.fontFamily, fontStyle);
    return getFontStack(undefined, fontStyle);
  }, [currentImage?.numberPosition?.fontFamily, numberFontConfig?.fontFamily, fontStyle]);

  const effectiveNameFontFamily = useMemo(() => {
    const zoneFontFamily = currentImage?.namePosition?.fontFamily;
    if (zoneFontFamily) return getFontStack(zoneFontFamily, fontStyle);
    if (nameFontConfig?.fontFamily) return getFontStack(nameFontConfig.fontFamily, fontStyle);
    return getFontStack(undefined, fontStyle);
  }, [currentImage?.namePosition?.fontFamily, nameFontConfig?.fontFamily, fontStyle]);

  const effectiveNumberFontColor = useMemo(() => {
    const zoneColor = currentImage?.numberPosition?.fontColor;
    if (zoneColor) return zoneColor;
    return numberFontConfig?.fontColor || null;
  }, [currentImage?.numberPosition?.fontColor, numberFontConfig?.fontColor]);

  const effectiveNameFontColor = useMemo(() => {
    const zoneColor = currentImage?.namePosition?.fontColor;
    if (zoneColor) return zoneColor;
    return nameFontConfig?.fontColor || null;
  }, [currentImage?.namePosition?.fontColor, nameFontConfig?.fontColor]);

  // Calculate charges
  const totalCharges = useMemo(() => {
    let nameCharge = 0;
    let numberCharge = 0;
    let logoCharge = 0;

    (['FRONT', 'BACK', 'SIDE'] as ImageViewType[]).forEach(viewType => {
      const viewImage = viewImages[viewType];
      if (!viewImage) return;

      if (viewImage.namePosition?.enabled && viewImage.namePosition?.chargeAmount) {
        nameCharge = Math.max(nameCharge, viewImage.namePosition.chargeAmount);
      }
      if (viewImage.numberPosition?.enabled && viewImage.numberPosition?.chargeAmount) {
        numberCharge = Math.max(numberCharge, viewImage.numberPosition.chargeAmount);
      }
      if (viewImage.logoPosition?.enabled && viewImage.logoPosition?.chargeAmount) {
        logoCharge = Math.max(logoCharge, viewImage.logoPosition.chargeAmount);
      }
    });

    let total = 0;
    if (playerName && nameCharge > 0) total += nameCharge;
    if (playerNumber && numberCharge > 0) total += numberCharge;
    if (logoImage && logoCharge > 0) total += logoCharge;

    return total;
  }, [playerName, playerNumber, logoImage, viewImages]);

  // Contrast colors
  const contrastPalette = useMemo(() => getContrastPalette(productColor), [productColor]);
  const textColor = contrastPalette.primary;
  const textOutlineColor = contrastPalette.outline;

  // Load base image
  useEffect(() => {
    if (!currentImageUrl) {
      setIsLoading(false);
      setImageLoadError(true);
      return;
    }

    setIsLoading(true);
    setImageLoadError(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setBaseImage(img);
      setIsLoading(false);
      setImageLoadError(false);
    };

    img.onerror = () => {
      // Try without CORS
      const imgNoCors = new Image();
      imgNoCors.onload = () => {
        setBaseImage(imgNoCors);
        setIsLoading(false);
        setImageLoadError(false);
      };
      imgNoCors.onerror = () => {
        setIsLoading(false);
        setImageLoadError(true);
        setBaseImage(null);
      };
      imgNoCors.src = currentImageUrl;
    };

    img.src = currentImageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentImageUrl]);

  // Load primary logo image
  useEffect(() => {
    if (!primaryLogoDataUrl) {
      setLogoImage(null);
      return;
    }

    const img = new Image();
    img.onload = () => setLogoImage(img);
    img.onerror = () => {
      setUploadError('Failed to load logo image');
      setPrimaryLogoDataUrl(null);
    };
    img.src = primaryLogoDataUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [primaryLogoDataUrl]);

  // Load back logo image (when using different logos)
  useEffect(() => {
    if (!backLogoDataUrl) {
      setBackLogoImage(null);
      return;
    }

    const img = new Image();
    img.onload = () => setBackLogoImage(img);
    img.onerror = () => {
      setUploadError('Failed to load back logo image');
      setBackLogoDataUrl(null);
    };
    img.src = backLogoDataUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [backLogoDataUrl]);

  // Canvas render
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const logicalWidth = canvasWidth;
    const logicalHeight = canvasHeight;

    // Set internal canvas resolution (for drawing)
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;

    // Set display size - smaller on mobile to fit in modal
    const displayWidth = isMobile ? Math.min(200, window.innerWidth - 60) : logicalWidth;
    const displayHeight = displayWidth * (logicalHeight / logicalWidth);
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    let drawWidth = logicalWidth;
    let drawHeight = logicalHeight;
    let drawX = 0;
    let drawY = 0;

    if (baseImage) {
      const imgAspect = baseImage.width / baseImage.height;
      const canvasAspect = logicalWidth / logicalHeight;

      if (imgAspect > canvasAspect) {
        drawWidth = logicalWidth;
        drawHeight = logicalWidth / imgAspect;
        drawX = 0;
        drawY = (logicalHeight - drawHeight) / 2;
      } else {
        drawHeight = logicalHeight;
        drawWidth = logicalHeight * imgAspect;
        drawX = (logicalWidth - drawWidth) / 2;
        drawY = 0;
      }

      ctx.drawImage(baseImage, drawX, drawY, drawWidth, drawHeight);
    }

    // Draw player name
    if (playerName && printConfig.name) {
      const nameZone = printConfig.name;
      const nameX = drawX + nameZone.x * drawWidth;
      const nameY = drawY + nameZone.y * drawHeight;
      const maxNameWidth = nameZone.maxWidth * drawWidth;

      const nameFontFamily = effectiveNameFontFamily;
      const nameFontSize = calculateFittedFontSize(ctx, playerName.toUpperCase(), nameZone.fontSize, maxNameWidth, nameFontFamily);

      ctx.font = `900 ${nameFontSize}px ${nameFontFamily}`;
      ctx.textAlign = nameZone.align;
      ctx.textBaseline = 'middle';

      const nameTextColor = effectiveNameFontColor || textColor;
      const nameOutlineColor = effectiveNameFontColor ? null : textOutlineColor;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      drawTextWithOutline(ctx, playerName.toUpperCase(), nameX, nameY, nameTextColor, nameOutlineColor, 3);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw player number
    if (playerNumber && printConfig.number) {
      const numZone = printConfig.number;
      const numX = drawX + numZone.x * drawWidth;
      const numY = drawY + numZone.y * drawHeight;
      const maxNumWidth = numZone.maxWidth * drawWidth;

      const numberFontFamily = effectiveNumberFontFamily;
      const numFontSize = calculateFittedFontSize(ctx, playerNumber, numZone.fontSize, maxNumWidth, numberFontFamily);

      ctx.font = `900 ${numFontSize}px ${numberFontFamily}`;
      ctx.textAlign = numZone.align;
      ctx.textBaseline = 'middle';

      const numberTextColor = effectiveNumberFontColor || textColor;
      const numberOutlineColor = effectiveNumberFontColor ? null : textOutlineColor;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      drawTextWithOutline(ctx, playerNumber, numX, numY, numberTextColor, numberOutlineColor, 4);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw logo - use back logo for BACK view if different logos enabled
    const currentLogoImage = (useDifferentLogos && currentView === 'BACK' && backLogoImage)
      ? backLogoImage
      : logoImage;

    if (printConfig.logo && currentLogoImage) {
      const logoZone = printConfig.logo;
      const logoX = drawX + logoZone.x * drawWidth;
      const logoY = drawY + logoZone.y * drawHeight;
      const maxLogoSize = logoZone.maxSize * drawWidth;

      const logoScale = Math.min(maxLogoSize / currentLogoImage.width, maxLogoSize / currentLogoImage.height);
      const logoWidth = currentLogoImage.width * logoScale;
      const logoHeight = currentLogoImage.height * logoScale;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.drawImage(currentLogoImage, logoX - logoWidth / 2, logoY - logoHeight / 2, logoWidth, logoHeight);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }, [
    baseImage,
    logoImage,
    backLogoImage,
    useDifferentLogos,
    currentView,
    playerName,
    playerNumber,
    printConfig,
    textColor,
    textOutlineColor,
    canvasWidth,
    canvasHeight,
    dpr,
    effectiveNameFontColor,
    effectiveNumberFontColor,
    effectiveNameFontFamily,
    effectiveNumberFontFamily,
    isMobile,
  ]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      renderCanvas();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderCanvas]);

  // Event handlers
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
        .toUpperCase()
        .replace(/[^A-Z\s]/g, '')
        .slice(0, MAX_NAME_LENGTH);
      updateCurrentViewCustomization({playerName: value});
    },
    [updateCurrentViewCustomization]
  );

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, MAX_NUMBER_LENGTH);
      updateCurrentViewCustomization({playerNumber: value});
    },
    [updateCurrentViewCustomization]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setUploadError(null);

      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setUploadError('Please upload a PNG or JPEG image');
        return;
      }

      if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
        setUploadError(`Logo must be under ${MAX_LOGO_SIZE_MB}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        const dataUrl = event.target?.result as string;
        // Set primary logo (shared across all views by default)
        setPrimaryLogoDataUrl(dataUrl);
      };
      reader.onerror = () => {
        setUploadError('Failed to read image file');
      };
      reader.readAsDataURL(file);

      e.target.value = '';
    },
    []
  );

  const handleRemoveLogo = useCallback(() => {
    setPrimaryLogoDataUrl(null);
    setLogoImage(null);
  }, []);

  // Handle back logo upload (when using different logos)
  const handleBackLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setUploadError(null);

      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setUploadError('Please upload a PNG or JPEG image');
        return;
      }

      if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
        setUploadError(`Logo must be under ${MAX_LOGO_SIZE_MB}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        const dataUrl = event.target?.result as string;
        setBackLogoDataUrl(dataUrl);
      };
      reader.onerror = () => {
        setUploadError('Failed to read image file');
      };
      reader.readAsDataURL(file);

      e.target.value = '';
    },
    []
  );

  const handleRemoveBackLogo = useCallback(() => {
    setBackLogoDataUrl(null);
    setBackLogoImage(null);
  }, []);

  // Handle Add to Cart - generate previews for all views
  const handleAddToCart = useCallback(() => {
    if (onAddToCart) {
      const canvas = canvasRef.current;
      let previewDataUrl: string | undefined;
      let frontPreviewDataUrl: string | undefined;
      let backPreviewDataUrl: string | undefined;
      let sidePreviewDataUrl: string | undefined;

      // Try to export current view's canvas
      try {
        previewDataUrl = canvas?.toDataURL('image/png');
        console.log('Canvas export successful, preview length:', previewDataUrl?.length);

        // Assign to correct view-specific preview
        if (currentView === 'FRONT') {
          frontPreviewDataUrl = previewDataUrl;
        } else if (currentView === 'BACK') {
          backPreviewDataUrl = previewDataUrl;
        } else if (currentView === 'SIDE') {
          sidePreviewDataUrl = previewDataUrl;
        }
      } catch (e) {
        console.warn('Canvas export failed (CORS):', e);
        previewDataUrl = undefined;
      }

      // Store logo position for CSS-based fallback preview
      const logoZone = printConfig.logo;
      const logoPosition = logoZone ? {
        x: logoZone.x,
        y: logoZone.y,
        maxSize: logoZone.maxSize
      } : undefined;

      // Store view-specific product images and zone configs for fallback rendering
      const viewProductImages: Record<string, string | undefined> = {};
      const viewZoneConfigs: Record<string, { name: any; number: any; logo: any } | null> = {};

      availableViews.forEach(view => {
        const viewImage = viewImages[view];
        if (viewImage?.imageUrl) {
          viewProductImages[view] = viewImage.imageUrl.startsWith('http')
            ? viewImage.imageUrl
            : `${ASSETS_SERVER_URL}${viewImage.imageUrl}`;
        }
        // Store zone config for each view
        if (viewImage) {
          viewZoneConfigs[view] = {
            name: viewImage.namePosition?.enabled ? viewImage.namePosition : null,
            number: viewImage.numberPosition?.enabled ? viewImage.numberPosition : null,
            logo: viewImage.logoPosition?.enabled ? viewImage.logoPosition : null,
          };
        }
      });

      const customizationData: CustomizationData = {
        playerName: playerName || undefined,
        playerNumber: playerNumber || undefined,
        customText: customText || undefined,
        fontStyle,
        logoDataUrl: primaryLogoDataUrl || undefined,
        backLogoDataUrl: useDifferentLogos ? (backLogoDataUrl || undefined) : undefined,
        useDifferentLogos,
        logoPosition,
        viewCustomizations: {
          FRONT: viewCustomizations.FRONT,
          BACK: viewCustomizations.BACK,
          SIDE: viewCustomizations.SIDE,
        },
        previewDataUrl,
        frontPreviewDataUrl,
        backPreviewDataUrl,
        sidePreviewDataUrl,
        currentView,
        availableViews,
        viewProductImages,
        viewZoneConfigs,
        additionalCharges: totalCharges,
      };

      onAddToCart(customizationData);
    }
  }, [
    onAddToCart,
    playerName,
    playerNumber,
    customText,
    fontStyle,
    primaryLogoDataUrl,
    backLogoDataUrl,
    useDifferentLogos,
    viewCustomizations,
    currentView,
    availableViews,
    totalCharges,
    printConfig.logo,
    viewImages,
  ]);

  // Notify parent of changes
  useEffect(() => {
    if (onCustomizationChange) {
      const canvas = canvasRef.current;
      let previewDataUrl: string | undefined;
      try {
        previewDataUrl = canvas?.toDataURL('image/png');
      } catch {
        previewDataUrl = undefined;
      }

      onCustomizationChange({
        playerName: playerName || undefined,
        playerNumber: playerNumber || undefined,
        customText: customText || undefined,
        fontStyle,
        logoDataUrl: primaryLogoDataUrl || undefined,
        viewCustomizations: {
          FRONT: viewCustomizations.FRONT,
          BACK: viewCustomizations.BACK,
          SIDE: viewCustomizations.SIDE,
        },
        previewDataUrl,
        currentView,
        availableViews,
        additionalCharges: totalCharges,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName, playerNumber, customText, fontStyle, primaryLogoDataUrl, onCustomizationChange, currentView, totalCharges]);

  // If no zones configured, show a message
  if (!hasConfiguredZones) {
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Customize Your Product</h2>
            <p className="text-green-100 text-sm">Add your logo</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Customization Not Available</h3>
          <p className="text-gray-600 mb-4">
            This product does not have customization zones configured yet.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Debug: printConfig = {JSON.stringify({name: !!printConfig.name, number: !!printConfig.number, logo: !!printConfig.logo})}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-h-[95vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white">Customize Your Product</h2>
          <p className="text-green-100 text-xs md:text-sm">Add your logo</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Canvas Preview - Very compact on mobile, 60% on desktop */}
        <div className="lg:w-3/5 p-2 md:p-6 bg-gray-50 flex flex-col items-center">
          {/* View Selector Tabs */}
          {availableViews.length > 1 && (
            <div className="flex gap-1 mb-1 md:mb-4">
              {availableViews.map(view => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-2.5 py-0.5 md:px-4 md:py-2 rounded-md md:rounded-lg font-medium text-xs md:text-sm transition-all ${
                    currentView === view
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          )}

          {/* Canvas - Much smaller on mobile, full size on desktop */}
          <div className="relative bg-white rounded-lg shadow overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-6 w-6 md:h-12 md:w-12 border-4 border-green-500 border-t-transparent" />
              </div>
            )}
            <canvas ref={canvasRef} />
          </div>

          {/* Additional Charges */}
          {totalCharges > 0 && (
            <div className="mt-1 md:mt-4 px-2 py-0.5 md:px-4 md:py-2 bg-amber-50 border border-amber-200 rounded">
              <p className="text-amber-800 text-[10px] md:text-xs font-medium">+${totalCharges.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Customization Form - Full width on mobile, 40% on desktop */}
        <div className="lg:w-2/5 p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Player Name */}
          {printConfig.name && (
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                Player Name
                {printConfig.name.charge && printConfig.name.charge > 0 && (
                  <span className="ml-2 text-xs text-green-600 font-normal">(+${printConfig.name.charge.toFixed(2)})</span>
                )}
              </label>
              <input
                type="text"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Enter name (max 12 characters)"
                maxLength={MAX_NAME_LENGTH}
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base md:text-lg font-medium uppercase"
              />
              <p className="mt-1 text-xs text-gray-500">{playerName.length}/{MAX_NAME_LENGTH} characters</p>
            </div>
          )}

          {/* Player Number */}
          {printConfig.number && (
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                Player Number
                {printConfig.number.charge && printConfig.number.charge > 0 && (
                  <span className="ml-2 text-xs text-green-600 font-normal">(+${printConfig.number.charge.toFixed(2)})</span>
                )}
              </label>
              <input
                type="text"
                value={playerNumber}
                onChange={handleNumberChange}
                placeholder="00"
                maxLength={MAX_NUMBER_LENGTH}
                inputMode="numeric"
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-2xl md:text-4xl font-bold text-center"
              />
            </div>
          )}

          {/* Logo Upload */}
          {printConfig.logo && (
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                {useDifferentLogos ? 'Front Logo' : 'Your Logo'}
                {printConfig.logo.charge && printConfig.logo.charge > 0 && (
                  <span className="ml-2 text-xs text-green-600 font-normal">(+${printConfig.logo.charge.toFixed(2)})</span>
                )}
              </label>

              {logoDataUrl ? (
                <div className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <img src={logoDataUrl} alt="Logo preview" className="w-10 h-10 md:w-14 md:h-14 object-contain rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900">Logo uploaded</p>
                    <p className="text-xs text-gray-500">Click to replace</p>
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <svg className="mx-auto h-8 w-8 md:h-10 md:w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-1 text-xs md:text-sm font-medium text-gray-900">Click to upload logo</p>
                  <p className="mt-1 text-xs text-gray-500">PNG or JPEG, max {MAX_LOGO_SIZE_MB}MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Different logos checkbox - only show if multiple views available */}
              {availableViews.length > 1 && (
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDifferentLogos}
                    onChange={(e) => setUseDifferentLogos(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Use different logo for front and back</span>
                </label>
              )}

              {/* Back Logo Upload - only when using different logos */}
              {useDifferentLogos && availableViews.includes('BACK') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Back Logo
                  </label>

                  {backLogoDataUrl ? (
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <img src={backLogoDataUrl} alt="Back logo preview" className="w-14 h-14 object-contain rounded" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Back logo uploaded</p>
                        <p className="text-xs text-gray-500">Click to replace</p>
                      </div>
                      <button
                        onClick={handleRemoveBackLogo}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => backFileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                    >
                      <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-1 text-sm font-medium text-gray-900">Click to upload back logo</p>
                      <p className="mt-1 text-xs text-gray-500">PNG or JPEG, max {MAX_LOGO_SIZE_MB}MB</p>
                    </div>
                  )}

                  <input
                    ref={backFileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    onChange={handleBackLogoUpload}
                    className="hidden"
                  />
                </div>
              )}

              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
            </div>
          )}

          {/* Preview Note */}
          <div className="p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 leading-snug md:leading-relaxed">
              <span className="font-semibold">Note:</span> Preview color only. Select your preferred color in the next step.
            </p>
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-xl text-white font-bold text-base md:text-lg transition-all ${
                isAddingToCart
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                <>
                  Confirm Customization
                  {totalCharges > 0 && <span className="ml-2">(+${totalCharges.toFixed(2)})</span>}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
