import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const email = 'contact@image2pdf.ink';

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-4 gradient-text">Contact</h1>
          <p className="text-muted-foreground mb-8">
            Questions, feedback, or partnership ideas? We’d love to hear from you.
          </p>

          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-3 text-foreground">Email</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a className="underline" href={`mailto:${email}`}>{email}</a>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Tip: Set up free email forwarding in Cloudflare (Email Routing) to receive emails sent to this
              address in your personal inbox.
            </p>
          </div>

          <div className="text-sm text-muted-foreground mt-8">
            <Link to="/" className="underline hover:text-foreground">Back to Home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

