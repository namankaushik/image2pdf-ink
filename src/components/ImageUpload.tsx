import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import exifr from 'exifr';
import { ImageFile } from '@/hooks/useOcrToPdf';

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  onContinue: () => void;
}

export function ImageUpload({ images, onImagesChange, onContinue }: ImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImageFile = async (file: File): Promise<ImageFile | null> => {
    try {
      // Check EXIF orientation
      let orientation = 1;
      try {
        const exifData = await exifr.parse(file);
        orientation = exifData?.Orientation || 1;
      } catch {
        // No EXIF data or parsing failed, use default orientation
      }

      // Create preview with correct orientation
      const preview = await createImagePreview(file, orientation);
      
      return {
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        preview,
        name: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(`Failed to process ${file.name}`);
      return null;
    }
  };

  const createImagePreview = (file: File, orientation: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // Apply EXIF orientation
          let { width, height } = img;
          if (orientation >= 5 && orientation <= 8) {
            [width, height] = [height, width];
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.save();
          
          // Apply transformations based on EXIF orientation
          switch (orientation) {
            case 2:
              ctx.scale(-1, 1);
              ctx.translate(-width, 0);
              break;
            case 3:
              ctx.rotate(Math.PI);
              ctx.translate(-width, -height);
              break;
            case 4:
              ctx.scale(1, -1);
              ctx.translate(0, -height);
              break;
            case 5:
              ctx.rotate(-Math.PI / 2);
              ctx.scale(-1, 1);
              ctx.translate(-width, -height);
              break;
            case 6:
              ctx.rotate(Math.PI / 2);
              ctx.translate(0, -height);
              break;
            case 7:
              ctx.rotate(Math.PI / 2);
              ctx.scale(-1, 1);
              ctx.translate(-width, 0);
              break;
            case 8:
              ctx.rotate(-Math.PI / 2);
              ctx.translate(-width, 0);
              break;
          }
          
          ctx.drawImage(img, 0, 0);
          ctx.restore();
          
          resolve(canvas.toDataURL());
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: import('react-dropzone').FileRejection[]) => {
    // Handle rejected files
    rejectedFiles.forEach((rejection) => {
      const errors = rejection.errors.map((e) => e.message).join(', ');
      toast.error(`${rejection.file.name}: ${errors}`);
    });

    if (acceptedFiles.length === 0) return;

    setIsProcessing(true);
    
    try {
      // Process all accepted files
      const processedImages = await Promise.all(
        acceptedFiles.map(processImageFile)
      );
      
      // Filter out failed processing
      const validImages = processedImages.filter((img): img is ImageFile => img !== null);
      
      if (validImages.length > 0) {
        onImagesChange([...images, ...validImages]);
        toast.success(`Added ${validImages.length} image${validImages.length > 1 ? 's' : ''}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [images, onImagesChange, processImageFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.heic']
    },
    multiple: true,
    disabled: isProcessing
  });

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
    toast.success('Image removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          {...getRootProps()}
          className={`
            glass-card p-12 border-2 border-dashed rounded-xl cursor-pointer
            transition-all duration-300 text-center
            ${isDragActive 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={{ 
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="w-16 h-16 text-primary mx-auto mb-6" />
          </motion.div>
          
          <h3 className="text-2xl font-semibold mb-4 text-foreground">
            {isDragActive ? 'Drop images here!' : 'Upload Your Images'}
          </h3>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Drag and drop your images here, or click to select files. 
            Supports PNG, JPG, JPEG, WebP, BMP, TIFF, and HEIC formats.
          </p>
          
          <Button 
            size="lg"
            disabled={isProcessing}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
          >
            {isProcessing ? 'Processing...' : 'Select Images'}
          </Button>
        </div>
      </motion.div>

      {/* Image Count and Size */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileImage className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {images.length} image{images.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Total size: {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
                </p>
              </div>
            </div>
            
            <Button
              onClick={onContinue}
              disabled={images.length === 0}
              className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
            >
              Continue to Preview
            </Button>
          </div>
        </motion.div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-3 rounded-lg group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden rounded-md mb-3">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-foreground truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(image.size)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Error State */}
      {images.length === 0 && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No images selected. Upload some images to get started!
          </p>
        </motion.div>
      )}
    </div>
  );
}
