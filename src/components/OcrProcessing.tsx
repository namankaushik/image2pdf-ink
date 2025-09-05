import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Eye,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { ImageFile, useOcrToPdf, OcrProgress } from '@/hooks/useOcrToPdf';
import { AdUnit } from '@/components/AdSense';

interface OcrProcessingProps {
  images: ImageFile[];
  onBack: () => void;
  onReset: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' }
];

export function OcrProcessing({ images, onBack, onReset }: OcrProcessingProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [hasStarted, setHasStarted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const { 
    isProcessing, 
    progress, 
    overallProgress, 
    estimatedTime, 
    processImages, 
    cancelProcessing,
    pdfBlob 
  } = useOcrToPdf();

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  const handleStartProcessing = async () => {
    setHasStarted(true);
    await processImages(images, selectedLanguage);
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ocr-document-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully!');
    }
  };

  const getProgressIcon = (progressItem: OcrProgress) => {
    switch (progressItem.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // Pre-processing state
  if (!hasStarted) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            OCR Configuration
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Configure your OCR settings and start processing your images into a searchable PDF.
          </p>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-xl max-w-2xl mx-auto"
        >
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 text-primary mr-3" />
            <h3 className="text-xl font-semibold text-foreground">Processing Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                OCR Language
              </label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Select the primary language of text in your images for better OCR accuracy.
              </p>
            </div>

            {/* Image Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Processing Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Images:</span>
                  <span className="ml-2 font-medium text-foreground">{images.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Language:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-4"
        >
          <Button
            variant="outline"
            onClick={onBack}
            className="glass border-border hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Preview
          </Button>
          <Button
            onClick={handleStartProcessing}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-300 text-lg px-8 py-6"
          >
            <FileText className="w-5 h-5 mr-2" />
            Start OCR Processing
          </Button>
        </motion.div>
      </div>
    );
  }

  // Processing or completed state
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          {isProcessing ? 'Processing Images' : 'Processing Complete'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isProcessing 
            ? 'Converting your images to searchable PDF with OCR technology...'
            : 'Your searchable PDF has been generated successfully!'
          }
        </p>
      </motion.div>

      {/* In-content Ad (shows if slot configured) */}
      <div className="flex justify-center">
        <AdUnit
          slot={import.meta.env.VITE_ADSENSE_SLOT_PROGRESS as string | undefined}
          className="mx-auto max-w-[728px]"
          style={{ display: 'block', minHeight: '90px' }}
        />
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Overall Progress</h3>
          {isProcessing && (
            <Button
              variant="outline"
              onClick={cancelProcessing}
              size="sm"
              className="text-destructive hover:bg-destructive/20"
            >
              Cancel
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{overallProgress}%</span>
          </div>
          
          <Progress value={overallProgress} className="h-3" />
          
          {estimatedTime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated time remaining</span>
              <span className="font-medium text-foreground">{estimatedTime}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Individual Image Progress */}
      {progress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-4 text-foreground">Image Progress</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {progress.map((item) => (
                <motion.div
                  key={`${item.imageIndex}-${item.imageName}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30"
                >
                  {getProgressIcon(item)}
                  
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-foreground truncate" title={item.imageName}>
                      {item.imageName}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Progress value={item.progress} className="flex-grow h-2" />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {item.progress}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* PDF Preview and Download */}
      {pdfBlob && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Ad near result actions */}
          <div className="flex justify-center">
            <AdUnit
              slot={import.meta.env.VITE_ADSENSE_SLOT_RESULT as string | undefined}
              className="mx-auto max-w-[728px]"
              style={{ display: 'block', minHeight: '90px' }}
            />
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={handleDownload}
              className="bg-gradient-primary hover:opacity-90 transition-all duration-300 text-lg px-8 py-6"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              className="glass border-border hover:bg-primary/10"
            >
              Process More Images
            </Button>
          </div>

          {/* PDF Preview */}
          {pdfUrl && (
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Eye className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold text-foreground">PDF Preview</h3>
              </div>
              
              <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="Generated PDF Preview"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
