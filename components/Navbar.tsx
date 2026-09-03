'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Utensils, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/order-tracking', label: 'Track Order' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold"
        >
          <Utensils className="h-6 w-6" />
          <span>La Maison</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary relative',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}

              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Cart */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}

              <span className="sr-only">
                Shopping cart
              </span>
            </Link>
          </Button>

          <Button
            asChild
            className="hidden md:inline-flex"
          >
            <Link href="/reservations">
              Reserve a Table
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet
            open={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">
                  Toggle menu
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[250px] sm:w-[300px]"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold"
                    onClick={() =>
                      setIsMobileMenuOpen(false)
                    }
                  >
                    <Utensils className="h-5 w-5" />
                    <span>La Maison</span>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setIsMobileMenuOpen(false)
                    }
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="mt-8 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                        pathname === link.href
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                      onClick={() =>
                        setIsMobileMenuOpen(false)
                      }
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Mobile cart */}
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() =>
                      setIsMobileMenuOpen(false)
                    }
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                    {cartCount > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Button
                    asChild
                    className="mt-4"
                  >
                    <Link
                      href="/reservations"
                      onClick={() =>
                        setIsMobileMenuOpen(false)
                      }
                    >
                      Reserve a Table
                    </Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}