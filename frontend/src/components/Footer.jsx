import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Share2 } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant flat no shadows mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-10 max-w-7xl mx-auto font-body text-sm">
        <div className="col-span-1 md:col-span-1">
          <span className="flex items-center gap-2 text-lg font-headline font-bold text-on-surface mb-4">
            <Logo className="w-6 h-6 text-primary" />
            NeighborShare
          </span>
          <p className="text-on-surface-variant leading-relaxed">
            Building stronger, more resilient communities through sharing resources and knowledge.
          </p>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-4 uppercase tracking-widest text-xs">Platform</h4>
          <ul className="space-y-3">
            <li><Link className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" to="#">About Us</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" to="#">Guidelines</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" to="#">Help Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-4 uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-3">
            <li><Link className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" to="#">Privacy Policy</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" to="#">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-4 uppercase tracking-widest text-xs">Connect</h4>
          <div className="flex gap-4">
            <a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all focus:ring-2 focus:ring-primary" href="#">
              <Globe className="w-4 h-4" />
            </a>
            <a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all focus:ring-2 focus:ring-primary" href="#">
              <Mail className="w-4 h-4" />
            </a>
            <a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all focus:ring-2 focus:ring-primary" href="#">
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-outline-variant text-center md:text-left">
        <p className="text-on-surface-variant text-xs">© {new Date().getFullYear()} NeighborShare Community. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
