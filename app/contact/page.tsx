'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([data]);
      if (error) throw error;

      toast.success('Message sent! We\'ll get back to you soon.');
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">We’d love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-sm text-muted-foreground">+961 71 673 177</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-muted-foreground">sweidann2002@gmail.com</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="text-sm text-muted-foreground">Beirut, Lebanon</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <Clock className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Business Hours</h4>
                <p className="text-sm text-muted-foreground">Mon–Sun: 12:00 PM – 11:00 PM</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaYoutube className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What’s this about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Google Map */}
      <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.127102687356!2d35.4946824!3d33.8937892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f172e4e1f0f8f%3A0x3b8e5b0e7c4b9d4e!2sBeirut%2C%20Lebanon!5e0!3m2!1sen!2sus!4v1700000000000"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}