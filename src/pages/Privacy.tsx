import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const lastUpdated = '2025-09-04';

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-4 gradient-text">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

          <div className="space-y-8">
            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Overview</h2>
              <p className="text-muted-foreground">
                This tool converts your images into a searchable PDF using on-device processing. Your
                images never leave your browser; no files are uploaded to any server controlled by us.
              </p>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Data Processing</h2>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>All OCR and PDF generation happens locally in your browser.</li>
                <li>We do not collect, store, or transmit your images or extracted text.</li>
                <li>Temporary browser memory may be used while the page is open. Closing the tab clears it.</li>
              </ul>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Cookies and Analytics</h2>
              <p className="text-muted-foreground">
                By default, this site does not set tracking cookies. If you enable analytics or advertising
                (e.g., Google AdSense), those services may set cookies subject to their policies. We will
                update this page when such services are enabled.
              </p>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Advertising</h2>
              <p className="text-muted-foreground">
                If ads are displayed, they may be provided by third parties (e.g., Google). These providers
                may use cookies or local storage to personalize or measure ads. You can manage personalization
                options through the ad provider settings.
              </p>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Contact</h2>
              <p className="text-muted-foreground">
                For privacy questions, contact us at <span className="font-medium">your-email@example.com</span>.
                Replace this with your actual contact email.
              </p>
            </section>

            <div className="text-sm text-muted-foreground">
              <Link to="/" className="underline hover:text-foreground">Back to Home</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;

