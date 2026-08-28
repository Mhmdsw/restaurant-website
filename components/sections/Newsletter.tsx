'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: cleanEmail,
        });

      if (error) {
        // Duplicate email
        if (error.code === '23505') {
          toast.info('This email is already subscribed!');
          setEmail('');
          return;
        }

        console.error('Supabase newsletter error:', error);
        throw error;
      }

      toast.success('You have been subscribed! 🎉');
      setEmail('');
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Join Our Newsletter
          </h2>

          <p className="text-muted-foreground mt-2">
            Get exclusive offers and updates.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="flex-1"
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </section>
  );
}