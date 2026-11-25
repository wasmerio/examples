import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="from-primary/5 via-background to-secondary/5 min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <a href="/">
            <button
              data-testid="button-back-privacy"
              className="hover:bg-secondary/20 mb-4 rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div>
            <h1 className="font-heading text-foreground mb-4 text-4xl font-bold md:text-5xl">
              Privacy Policy
            </h1>
          </div>

          <div className="bg-card rounded-[2rem] border-none shadow-lg">
            <div className="space-y-6 p-8 md:p-12">
              <div className="space-y-3">
                <h2 className="font-heading text-foreground text-xl font-bold">
                  Data We Collect
                </h2>
                <p className="text-muted-foreground">
                  We collect email addresses from users who choose to join our
                  community. No payment information or sensitive data is
                  required. Everything is stored locally in your browser using
                  localStorage.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-heading text-foreground text-xl font-bold">
                  How We Use Your Data
                </h2>
                <p className="text-muted-foreground">
                  Your email is used only for newsletter communications and
                  community updates. We never sell or share your data with third
                  parties. You can unsubscribe anytime.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-heading text-foreground text-xl font-bold">
                  Session Data
                </h2>
                <p className="text-muted-foreground">
                  Your meditation sessions and progress are stored locally on
                  your device. We do not track or collect information about your
                  usage patterns. You have full control over your data.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-heading text-foreground text-xl font-bold">
                  Security
                </h2>
                <p className="text-muted-foreground">
                  We take your privacy seriously. All data transmissions are
                  encrypted. We follow best practices for web security and
                  regularly update our systems.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-heading text-foreground text-xl font-bold">
                  Contact Us
                </h2>
                <p className="text-muted-foreground">
                  If you have concerns about your privacy, please reach out
                  through our contact page. We're here to help.
                </p>
              </div>

              <div className="border-border/40 text-muted-foreground border-t pt-4 text-sm">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="/">
              <button
                data-testid="button-back-home-privacy"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-2 font-bold"
              >
                Back to Home
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
