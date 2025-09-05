/**
 * Utility functions for image processing
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export const MAX_IMAGE_SIZE = 2048; // Max width/height in pixels
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Downscale an image if it's too large to prevent memory issues
 */
export async function downscaleImageIfNeeded(file: File): Promise<File> {
  // Check if file size is already within limits
  if (file.size <= MAX_FILE_SIZE) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Calculate new dimensions
      const { width: newWidth, height: newHeight } = calculateScaledDimensions(
        img.width,
        img.height,
        MAX_IMAGE_SIZE
      );
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw scaled image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const scaledFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });
            resolve(scaledFile);
          } else {
            resolve(file); // Fallback to original if conversion fails
          }
        },
        file.type,
        0.8 // 80% quality for compression
      );
    };
    
    img.onerror = () => resolve(file); // Fallback to original if loading fails
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate scaled dimensions while maintaining aspect ratio
 */
export function calculateScaledDimensions(
  originalWidth: number,
  originalHeight: number,
  maxSize: number
): ImageDimensions {
  if (originalWidth <= maxSize && originalHeight <= maxSize) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  
  if (originalWidth > originalHeight) {
    return {
      width: maxSize,
      height: Math.round(maxSize / aspectRatio),
    };
  } else {
    return {
      width: Math.round(maxSize * aspectRatio),
      height: maxSize,
    };
  }
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert file to base64 data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
