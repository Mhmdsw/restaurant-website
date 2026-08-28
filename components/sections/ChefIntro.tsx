'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ChefIntro() {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Executive Chef</h2>
            <p className="text-muted-foreground text-lg mt-4">
              Chef Marco Rossi brings over 20 years of culinary excellence from Michelin-starred kitchens across Europe. His philosophy: simple ingredients, bold flavors, and artistic presentation.
            </p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              <li>✦ 2 Michelin Stars</li>
              <li>✦ James Beard Award Winner</li>
              <li>✦ Featured on Netflix's "Chef's Table"</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-xl">
              <Image
               src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600&h=800&fit=crop&crop=center"
                alt="Chef Marco Rossi"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}