'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa6';

const images = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop&crop=center',
];

export default function InstagramGallery() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Follow Us on Instagram</h2>
          <p className="text-muted-foreground mt-2">@lamaison_restaurant</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <Image src={src} alt={`Instagram ${i}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FaInstagram className="text-white h-8 w-8" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}