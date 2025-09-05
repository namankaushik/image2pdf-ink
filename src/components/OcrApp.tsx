import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { StepIndicator } from './StepIndicator';
import { ImageUpload } from './ImageUpload';
import { ImagePreview } from './ImagePreview';
import { OcrProcessing } from './OcrProcessing';
import { ImageFile } from '@/hooks/useOcrToPdf';

type Step = 'hero' | 'upload' | 'preview' | 'process';

const STEPS = ['Upload Images', 'Preview & Arrange', 'OCR Processing'];

export function OcrApp() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [images, setImages] = useState<ImageFile[]>([]);

  const handleGetStarted = () => {
    setCurrentStep('upload');
  };

  const handleImagesUploaded = () => {
    setCurrentStep('preview');
  };

  const handlePreviewBack = () => {
    setCurrentStep('upload');
  };

  const handlePreviewContinue = () => {
    setCurrentStep('process');
  };

  const handleProcessingBack = () => {
    setCurrentStep('preview');
  };

  const handleReset = () => {
    setImages([]);
    setCurrentStep('hero');
  };

  const getStepIndex = () => {
    switch (currentStep) {
      case 'upload': return 0;
      case 'preview': return 1;
      case 'process': return 2;
      default: return -1;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OCR</span>
              </div>
              <h1 className="text-xl font-bold gradient-text">PDF Converter</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
              </div>
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentStep === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onGetStarted={handleGetStarted} />
            </motion.div>
          )}

          {currentStep !== 'hero' && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto px-4 py-8"
            >
              {/* Step Indicator */}
              <StepIndicator currentStep={getStepIndex()} steps={STEPS} />

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {currentStep === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageUpload
                      images={images}
                      onImagesChange={setImages}
                      onContinue={handleImagesUploaded}
                    />
                  </motion.div>
                )}

                {currentStep === 'preview' && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImagePreview
                      images={images}
                      onImagesChange={setImages}
                      onBack={handlePreviewBack}
                      onContinue={handlePreviewContinue}
                    />
                  </motion.div>
                )}

                {currentStep === 'process' && (
                  <motion.div
                    key="process"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OcrProcessing
                      images={images}
                      onBack={handleProcessingBack}
                      onReset={handleReset}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 glass-card border-t border-glass-border py-4"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Built with ❤️ using React, Tesseract.js, and PDF-lib • 
              <span className="ml-1 font-medium">100% Client-Side Processing</span>
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}
