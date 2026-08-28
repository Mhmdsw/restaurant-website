'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '@/data/testimonialsData';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const handlePrev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const handleNext = () => setCurrent((prev) => (prev + 1) % total);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">What Our Guests Say</h2>
          <p className="text-muted-foreground mt-2">Real reviews from real food lovers</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonials[current].rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-lg italic">"{testimonials[current].content}"</p>
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonials[current].avatar || 'https://i.pravatar.cc/150?img=1'}
                        alt={testimonials[current].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{testimonials[current].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-6">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}