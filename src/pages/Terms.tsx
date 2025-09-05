import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Terms = () => {
  const lastUpdated = '2025-09-04';

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-4 gradient-text">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

          <div className="space-y-8">
            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using this site, you agree to be bound by these Terms. If you do not
                agree, do not use the site.
              </p>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Use of the Service</h2>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>You may use the tool to convert images you have rights to process.</li>
                <li>You are solely responsible for the content you process.</li>
                <li>Do not use the service for unlawful or harmful purposes.</li>
              </ul>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Privacy</h2>
              <p className="text-muted-foreground">
                Please review our <Link to="/privacy" className="underline">Privacy Policy</Link> to understand
                how data is handled. Processing occurs in your browser; we do not upload your files to our servers.
              </p>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                The service is provided “as is” without warranties of any kind, express or implied, including
                accuracy of OCR results or fitness for a particular purpose.
              </p>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, we shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of the service.
              </p>
            </section>

            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Changes</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. Continued use of the service constitutes
                acceptance of the updated Terms.
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

export default Terms;

