'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
       style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
            Welcome to <br />
            <span className="text-primary">La Maison</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto text-gray-200">
            Experience culinary artistry in an atmosphere of elegance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/reservations">Reserve a Table</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}