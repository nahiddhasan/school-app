"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 border-t">
      <div className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 ">
            <Image
              src="/img/logo.png"
              alt="logo"
              height={40}
              width={180}
              className="object-cover"
              priority
            />
          </Link>
          <p className="text-sm mt-2">
            A powerful school management platform for admins, teachers, students
            & parents.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/features" className="hover:text-blue-600">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-blue-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/faq" className="hover:text-blue-600">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-600">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-gray-600">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="hover:text-blue-600" size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <Twitter className="hover:text-blue-600" size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="hover:text-blue-600" size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="hover:text-blue-600" size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 border-t py-4">
        &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
