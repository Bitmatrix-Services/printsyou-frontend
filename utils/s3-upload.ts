import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Convert a base64 data URL to a Blob
 */
function dataURLtoBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}

/**
 * Upload a base64 data URL to S3 and return the S3 URL
 * @param dataUrl - The base64 data URL (e.g., "data:image/png;base64,...")
 * @param uploadId - Unique ID for the upload (e.g., product ID or quote ID)
 * @param fileName - Name for the file
 * @param uploadType - Type of upload (CART, QUOTE, ORDER)
 * @returns The S3 URL of the uploaded file, or null if upload failed
 */
export async function uploadBase64ToS3(
  dataUrl: string,
  uploadId: string,
  fileName: string,
  uploadType: 'CART' | 'QUOTE' | 'ORDER' = 'QUOTE'
): Promise<string | null> {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    console.warn('Invalid data URL provided to uploadBase64ToS3');
    return null;
  }

  try {
    // Convert data URL to blob
    const blob = dataURLtoBlob(dataUrl);
    const file = new File([blob], fileName, {type: blob.type});

    // Get presigned URL from backend
    const params = {
      type: uploadType,
      fileName: fileName,
      id: uploadId
    };

    const res = await axios.get(`${API_BASE_URL}/s3/signedUrl`, {params});
    const {url, objectKey} = res.data.payload;

    // Upload to S3
    await axios.put(url, file, {
      headers: {
        'Content-Type': blob.type
      }
    });

    // Return the S3 URL (assets server URL + object key)
    const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';
    return `${ASSETS_SERVER_URL}${objectKey}`;
  } catch (error) {
    console.error('Failed to upload base64 to S3:', error);
    return null;
  }
}

/**
 * Upload multiple base64 images to S3
 * @param images - Array of {dataUrl, fileName} objects
 * @param uploadId - Unique ID for the upload
 * @param uploadType - Type of upload
 * @returns Object mapping original data URLs to S3 URLs
 */
export async function uploadMultipleBase64ToS3(
  images: Array<{dataUrl: string; fileName: string}>,
  uploadId: string,
  uploadType: 'CART' | 'QUOTE' | 'ORDER' = 'QUOTE'
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const {dataUrl, fileName} of images) {
    const s3Url = await uploadBase64ToS3(dataUrl, uploadId, fileName, uploadType);
    if (s3Url) {
      results.set(dataUrl, s3Url);
    }
  }

  return results;
}
