import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Explore Creators', href: '/explore' },
        { label: 'Categories', href: '/explore?tab=categories' },
        { label: 'Become a Creator', href: '/register?role=creator' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Safety', href: '/safety' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Creator Support', href: '/creator-support' },
        { label: 'Report an Issue', href: '/report' },
        { label: 'Status', href: '/status' },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-black-deep">
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-royal to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                Island<span className="gradient-text-purple">+</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              The Caribbean Premium Creator Network. Where exclusive communities thrive.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-gray-600">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              All systems operational
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-purple-neon transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Island+. All rights reserved. 18+ only platform.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>🔒 Secure Platform</span>
            <span>🌍 Available Worldwide</span>
            <span>18+</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
