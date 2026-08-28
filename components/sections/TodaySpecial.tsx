'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { todaySpecial } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TodaySpecial() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src={todaySpecial.image}
                alt={todaySpecial.name}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 text-sm font-semibold rounded-full">
              Today's Special
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">{todaySpecial.name}</h2>
            <p className="text-muted-foreground text-lg">{todaySpecial.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">${todaySpecial.price}</span>
              <span className="text-sm text-muted-foreground">
                {todaySpecial.calories} cal
              </span>
            </div>
            <Button asChild size="lg">
              <Link href="/reservations">Order Now</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}