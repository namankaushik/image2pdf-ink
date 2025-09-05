import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { PDFDocument, rgb } from 'pdf-lib';
import { toast } from 'react-hot-toast';

export interface ImageFile {
  file: File;
  id: string;
  preview: string;
  name: string;
  size: number;
}

export interface OcrProgress {
  imageIndex: number;
  imageName: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface UseOcrToPdfReturn {
  isProcessing: boolean;
  progress: OcrProgress[];
  overallProgress: number;
  estimatedTime: string;
  processImages: (images: ImageFile[], language: string) => Promise<Blob | null>;
  cancelProcessing: () => void;
  pdfBlob: Blob | null;
}

export function useOcrToPdf(): UseOcrToPdfReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OcrProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [shouldCancel, setShouldCancel] = useState(false);

  const cancelProcessing = useCallback(() => {
    setShouldCancel(true);
    toast.success('Processing cancelled');
  }, []);

  const processImages = useCallback(async (images: ImageFile[], language: string = 'eng'): Promise<Blob | null> => {
    if (images.length === 0) return null;

    setIsProcessing(true);
    setShouldCancel(false);
    setPdfBlob(null);
    
    // Initialize progress tracking
    const initialProgress = images.map((img, index) => ({
      imageIndex: index,
      imageName: img.name,
      progress: 0,
      status: 'pending' as const
    }));
    setProgress(initialProgress);
    setOverallProgress(0);

    const startTime = Date.now();

    try {
      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Process each image
      for (let i = 0; i < images.length; i++) {
        if (shouldCancel) {
          toast.error('Processing cancelled');
          return null;
        }

        const image = images[i];
        
        // Update progress - starting this image
        setProgress(prev => prev.map((p, idx) => 
          idx === i ? { ...p, status: 'processing' } : p
        ));

        try {
          // Create Tesseract worker
          const worker = await createWorker(language);
          
          // Process OCR with progress tracking
          const { data } = await worker.recognize(image.file);
          
          // Track progress manually since Tesseract v4+ handles this differently
          setProgress(prev => prev.map((p, idx) => 
            idx === i ? { ...p, progress: 100 } : p
          ));
          
          // Update overall progress
          const completed = i + 1;
          const totalProgress = (completed / images.length) * 100;
          setOverallProgress(Math.round(totalProgress));
          
          // Update estimated time
          const elapsed = (Date.now() - startTime) / 1000;
          const rate = totalProgress > 0 ? elapsed / (totalProgress / 100) : 0;
          const remaining = rate * (1 - totalProgress / 100);
          const minutes = Math.floor(remaining / 60);
          const seconds = Math.round(remaining % 60);
          setEstimatedTime(minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`);

          await worker.terminate();

          if (shouldCancel) return null;

          // Create image from file
          const imageBytes = await image.file.arrayBuffer();
          let pdfImage;
          
          const fileType = image.file.type.toLowerCase();
          if (fileType.includes('png')) {
            pdfImage = await pdfDoc.embedPng(imageBytes);
          } else {
            pdfImage = await pdfDoc.embedJpg(imageBytes);
          }

          // Add page with image dimensions
          const { width, height } = pdfImage.scale(1);
          const page = pdfDoc.addPage([width, height]);
          
          // Draw the image
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width,
            height,
          });

          // Add invisible text overlay for searchability
          if (data.text && data.text.trim()) {
            // For now, add the full text as a simple overlay
            // This makes the PDF searchable but not perfectly positioned
            page.drawText(data.text, {
              x: 10,
              y: height - 30,
              size: 12,
              color: rgb(0, 0, 0),
              opacity: 0, // Make text invisible but selectable
            });
          }

          // Update progress - completed this image
          setProgress(prev => prev.map((p, idx) => 
            idx === i ? { ...p, progress: 100, status: 'completed' } : p
          ));

        } catch (error) {
          console.error(`Error processing image ${i}:`, error);
          setProgress(prev => prev.map((p, idx) => 
            idx === i ? { ...p, status: 'error' } : p
          ));
          toast.error(`Failed to process ${image.name}`);
        }
      }

      if (shouldCancel) return null;

      // Generate PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setPdfBlob(blob);
      setOverallProgress(100);
      setEstimatedTime('');
      toast.success('PDF generated successfully!');
      
      return blob;

    } catch (error) {
      console.error('Error in OCR processing:', error);
      toast.error('Failed to process images');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [shouldCancel]);

  return {
    isProcessing,
    progress,
    overallProgress,
    estimatedTime,
    processImages,
    cancelProcessing,
    pdfBlob
  };
}
