import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLock } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-bold mb-4">Mhamad Sweidan</h3>
          <p className="text-muted-foreground text-sm">
            Fine dining & exquisite flavors in the heart of Beirut.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/reservations">Reservations</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            {/* Professional Admin link – protected by middleware */}
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <FaLock className="h-3 w-3" />
                <span>Admin</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Lebanon, Beirut</li>
            <li>+961 71 673 177</li>
            <li>sweidann2002@gmail.com</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook"><FaFacebook className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Instagram"><FaInstagram className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Twitter"><FaTwitter className="h-5 w-5" /></Link>
            <Link href="#" aria-label="YouTube"><FaYoutube className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>

      <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Mhamad Sweidan. All rights reserved.
      </div>
    </footer>
  );
}