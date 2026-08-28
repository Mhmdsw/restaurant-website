'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { stats } from '@/data/statsData';
import { motion } from 'framer-motion';

const Counter = ({ value, label }: { value: number; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-4xl md:text-5xl font-bold text-primary">
          {isInView ? value : 0}
          {label === 'Happy Guests' || label === '5-Star Reviews' ? '+' : ''}
        </span>
        <p className="text-muted-foreground mt-1">{label}</p>
      </motion.div>
    </div>
  );
};

export default function Stats() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Counter key={stat.id} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}