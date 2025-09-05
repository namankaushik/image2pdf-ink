import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, GripVertical, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { ImageFile } from '@/hooks/useOcrToPdf';

interface ImagePreviewProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ImagePreview({ images, onImagesChange, onBack, onContinue }: ImagePreviewProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          Preview & Arrange
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Review your images and drag to reorder them. The order here will determine 
          the page order in your final PDF document.
        </p>
      </motion.div>

      {/* Stats and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl flex items-center justify-between"
      >
        <div className="flex items-center space-x-6">
          <div>
            <p className="text-2xl font-bold text-foreground">{images.length}</p>
            <p className="text-sm text-muted-foreground">Images</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
            </p>
            <p className="text-sm text-muted-foreground">Total Size</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="glass border-border hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onContinue}
            disabled={images.length === 0}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
          >
            Start OCR Processing
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Reorderable Image Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Drag to Reorder Pages
        </h3>
        
        <Reorder.Group
          axis="y"
          values={images}
          onReorder={onImagesChange}
          className="space-y-4"
        >
          <AnimatePresence>
            {images.map((image, index) => (
              <Reorder.Item
                key={image.id}
                value={image}
                onDragStart={() => setDraggedItem(image.id)}
                onDragEnd={() => setDraggedItem(null)}
                className={`
                  glass-card p-4 rounded-lg cursor-grab active:cursor-grabbing
                  transition-all duration-200 hover:shadow-lg
                  ${draggedItem === image.id ? 'scale-105 shadow-xl' : ''}
                `}
                whileDrag={{ scale: 1.05, rotate: 2 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-4">
                  {/* Page Number */}
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-muted-foreground">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  {/* Image Preview */}
                  <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                  
                  {/* Image Info */}
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-foreground truncate" title={image.name}>
                      {image.name}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(image.size)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Page {index + 1}
                      </p>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeImage(image.id)}
                    className="flex-shrink-0 hover:bg-destructive/20 hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <h4 className="font-semibold mb-3 text-foreground">💡 Tips</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Drag images up or down to change their order in the final PDF</li>
          <li>• The page numbers shown will be the final order in your PDF</li>
          <li>• Remove unwanted images by clicking the × button</li>
          <li>• OCR works best with clear, high-contrast text</li>
        </ul>
      </motion.div>
    </div>
  );
}
