import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Heart } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      const messages = JSON.parse(
        localStorage.getItem('contactMessages') || '[]',
      );
      messages.push({ name, email, message, date: new Date().toISOString() });
      localStorage.setItem('contactMessages', JSON.stringify(messages));
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="from-primary/5 via-background to-secondary/5 min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <a href="/">
            <button
              data-testid="button-back-contact"
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
          <div className="space-y-4 text-center">
            <Mail className="text-primary mx-auto h-12 w-12" />
            <h1 className="font-heading text-foreground text-4xl font-bold md:text-5xl">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="bg-card rounded-[2rem] border-none shadow-lg">
            <div className="p-8 md:p-12">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-bold">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="input-contact-name"
                      className="border-border bg-background focus:border-primary w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-bold">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-contact-email"
                      className="border-border bg-background focus:border-primary w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-bold">
                      Message
                    </label>
                    <textarea
                      placeholder="Your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      data-testid="textarea-contact-message"
                      rows={5}
                      className="border-border bg-background focus:border-primary w-full resize-none rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      data-testid="button-contact-submit"
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 font-bold"
                    >
                      Send Message
                    </button>
                  </motion.div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Heart className="h-8 w-8 fill-current text-green-600" />
                  </div>
                  <h2 className="font-heading text-foreground text-2xl font-bold">
                    Thank you!
                  </h2>
                  <p className="text-muted-foreground">
                    We received your message and will get back to you soon. Stay
                    zen! 🐱
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => setSubmitted(false)}
                      className="border-primary text-primary hover:bg-primary/10 mt-4 rounded-lg border-2 px-6 py-2 font-bold transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="text-center">
            <a href="/">
              <button
                data-testid="button-back-home-contact"
                className="border-primary text-primary hover:bg-primary/10 rounded-full border-2 px-8 py-2 font-bold transition-colors"
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
