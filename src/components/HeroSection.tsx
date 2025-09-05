import { motion } from 'framer-motion';
import { FileImage, Search, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdUnit } from '@/components/AdSense';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const features = [
    {
      icon: FileImage,
      title: 'Multiple Images',
      description: 'Upload and convert multiple images in one go'
    },
    {
      icon: Search,
      title: 'Searchable OCR',
      description: 'Extract text and make your PDFs fully searchable'
    },
    {
      icon: Download,
      title: 'Client-Side',
      description: 'No server upload, complete privacy protection'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Lightning-fast conversion with progress tracking'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-20" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-secondary/20 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            Images to OCR PDF
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform multiple images into one searchable PDF with powerful OCR technology. 
            Fast, secure, and completely client-side.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-primary hover:opacity-90 transition-all duration-300 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started Free
            </Button>
            <p className="text-sm text-muted-foreground">
              No signup required • Complete privacy • Open source
            </p>
          </motion.div>
          {/* Ad below hero CTA (optional; rendered only if env slots set) */}
          <div className="mt-8">
            <AdUnit
              slot={import.meta.env.VITE_ADSENSE_SLOT_HERO as string | undefined}
              className="mx-auto max-w-[728px]"
              style={{ display: 'block', minHeight: '90px' }}
            />
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 rounded-xl"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold gradient-text">50+</div>
              <p className="text-sm text-muted-foreground mt-1">Images Supported</p>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">100%</div>
              <p className="text-sm text-muted-foreground mt-1">Client-Side</p>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">0$</div>
              <p className="text-sm text-muted-foreground mt-1">Forever Free</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
