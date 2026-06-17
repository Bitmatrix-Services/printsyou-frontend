/**
 * Shared Preview Renderer Utility
 * Generates design preview images for checkout upload
 * Uses CORS-safe image loading to avoid canvas taint issues
 */

// =============================================================================
// FONT STACKS (must match ProductCustomizer)
// =============================================================================

export const FONT_STACKS: Record<string, string> = {
  'product-default': '"Impact", "Haettenschweiler", "Arial Narrow Bold", sans-serif',
  varsity: '"Impact", "Haettenschweiler", "Arial Narrow Bold", sans-serif',
  modern: '"Bebas Neue", "Oswald", "Arial Black", sans-serif',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get font family based on font style
 */
export function getFontFamily(fontStyle?: string): string {
  if (!fontStyle || fontStyle === 'product-default') {
    return FONT_STACKS.varsity;
  }
  return FONT_STACKS[fontStyle] || FONT_STACKS.varsity;
}

/**
 * Draw text with optional outline
 */
export function drawTextWithOutline(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillColor: string,
  outlineColor: string | null,
  outlineWidth: number = 3
): void {
  if (outlineColor) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
}

// =============================================================================
// PREVIEW RENDERER INTERFACE
// =============================================================================

export interface ZoneConfig {
  enabled?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface CustomizationData {
  playerName?: string;
  playerNumber?: string;
  customText?: string;
  logoDataUrl?: string;
  fontStyle?: 'product-default' | 'varsity' | 'modern';
  userFontColor?: string;
}

export interface PreviewRenderOptions {
  canvasSize: number;
  productImageUrl?: string;
  customization: CustomizationData;
  zoneConfig?: {
    name?: ZoneConfig | null;
    number?: ZoneConfig | null;
    logo?: ZoneConfig | null;
  } | null;
  viewType?: 'FRONT' | 'BACK' | 'SIDE';
}

/**
 * Load image with CORS support and cache-busting
 */
export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;

    // For data URLs, use as-is; for external URLs, add cache-busting
    if (src.startsWith('data:')) {
      img.src = src;
    } else {
      const cacheBuster = `_cb=${Date.now()}`;
      const urlWithCacheBuster = src.includes('?') ? `${src}&${cacheBuster}` : `${src}?${cacheBuster}`;
      img.src = urlWithCacheBuster;
    }
  });
}

/**
 * Render customization preview on canvas
 */
export async function renderPreview(
  ctx: CanvasRenderingContext2D,
  options: PreviewRenderOptions
): Promise<void> {
  const { canvasSize, productImageUrl, customization, zoneConfig, viewType } = options;

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Default dimensions
  const padding = 40;
  const availableSize = canvasSize - padding * 2;
  let drawWidth = availableSize;
  let drawHeight = availableSize;
  let drawX = padding;
  let drawY = padding;

  // Try to load and draw product image
  let productImageLoaded = false;
  if (productImageUrl) {
    try {
      const img = await loadImage(productImageUrl);
      const imgAspect = img.width / img.height;

      if (imgAspect > 1) {
        drawWidth = availableSize;
        drawHeight = availableSize / imgAspect;
      } else {
        drawHeight = availableSize;
        drawWidth = availableSize * imgAspect;
      }

      drawX = (canvasSize - drawWidth) / 2;
      drawY = (canvasSize - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      productImageLoaded = true;
    } catch (e) {
      console.error('[renderPreview] Failed to load product image:', e);
    }
  }

  // Draw placeholder if image didn't load
  if (!productImageLoaded) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);

    if (viewType) {
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${viewType} VIEW`, canvasSize / 2, 25);
    }
  }

  // Font settings
  const fontFamily = getFontFamily(customization.fontStyle);
  const userColor = customization.userFontColor;
  const hasCustomColor = !!userColor;
  const textColor = userColor || '#FFFFFF';
  const outlineColor = hasCustomColor ? null : 'rgba(0, 0, 0, 0.6)';

  // Check zone enablement
  const hasNameZone = zoneConfig?.name?.enabled && zoneConfig?.name?.x !== undefined;
  const hasNumberZone = zoneConfig?.number?.enabled && zoneConfig?.number?.x !== undefined;
  const hasLogoZone = zoneConfig?.logo?.enabled && zoneConfig?.logo?.x !== undefined;

  // Draw logo if zone is enabled
  if (hasLogoZone && customization.logoDataUrl && zoneConfig?.logo) {
    try {
      const logoImg = await loadImage(customization.logoDataUrl);
      const zone = zoneConfig.logo;
      const zoneX = drawX + (zone.x || 0) * drawWidth;
      const zoneY = drawY + (zone.y || 0) * drawHeight;
      const zoneW = (zone.width || 0.15) * drawWidth;
      const zoneH = (zone.height || 0.15) * drawHeight;

      const logoAspect = logoImg.width / logoImg.height;
      let logoW: number;
      let logoH: number;

      if (logoAspect > zoneW / zoneH) {
        logoW = zoneW;
        logoH = zoneW / logoAspect;
      } else {
        logoH = zoneH;
        logoW = zoneH * logoAspect;
      }

      const logoX = zoneX + (zoneW - logoW) / 2;
      const logoY = zoneY + (zoneH - logoH) / 2;
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    } catch (e) {
      console.error('[renderPreview] Failed to load logo:', e);
    }
  }

  // Draw player name if zone is enabled
  if (hasNameZone && customization.playerName && zoneConfig?.name) {
    const zone = zoneConfig.name;
    const zoneX = drawX + (zone.x || 0) * drawWidth;
    const zoneY = drawY + (zone.y || 0) * drawHeight;
    const zoneW = (zone.width || 0.3) * drawWidth;
    const zoneH = (zone.height || 0.08) * drawHeight;

    const referenceCanvasHeight = 480;
    const scaleFactor = canvasSize / referenceCanvasHeight;
    const zoneHeightNormalized = zone.height || 0.08;
    const baseZoneHeightPx = zoneHeightNormalized * referenceCanvasHeight;
    const baseFontSize = Math.round(baseZoneHeightPx * 0.60);
    const clampedFontSize = Math.max(16, Math.min(100, baseFontSize));
    const fontSize = Math.round(clampedFontSize * scaleFactor);

    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textX = zoneX + zoneW / 2;
    const textY = zoneY + zoneH / 2;
    const text = customization.playerName.toUpperCase();

    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    drawTextWithOutline(ctx, text, textX, textY, textColor, outlineColor, 3);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Draw player number if zone is enabled
  if (hasNumberZone && customization.playerNumber && zoneConfig?.number) {
    const zone = zoneConfig.number;
    const zoneX = drawX + (zone.x || 0) * drawWidth;
    const zoneY = drawY + (zone.y || 0) * drawHeight;
    const zoneW = (zone.width || 0.25) * drawWidth;
    const zoneH = (zone.height || 0.2) * drawHeight;

    const referenceCanvasHeight = 480;
    const scaleFactor = canvasSize / referenceCanvasHeight;
    const zoneHeightNormalized = zone.height || 0.2;
    const baseZoneHeightPx = zoneHeightNormalized * referenceCanvasHeight;
    const baseFontSize = Math.round(baseZoneHeightPx * 0.75);
    const clampedFontSize = Math.max(24, Math.min(200, baseFontSize));
    const fontSize = Math.round(clampedFontSize * scaleFactor);

    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textX = zoneX + zoneW / 2;
    const textY = zoneY + zoneH / 2;
    const text = customization.playerNumber;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    drawTextWithOutline(ctx, text, textX, textY, textColor, outlineColor, 4);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}

/**
 * Create a design preview as a data URL
 */
export async function createPreviewDataUrl(
  options: PreviewRenderOptions
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = options.canvasSize;
  canvas.height = options.canvasSize;
  const ctx = canvas.getContext('2d')!;

  await renderPreview(ctx, options);

  return canvas.toDataURL('image/png');
}
