"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to apply sticky style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`transition-all duration-300 ${
        scrolled
          ? "sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-gray-200"
          : "relative"
      }`}
    >
      <div className="mx-auto px-4 flex items-center justify-between ">
        {/* Logo */}
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

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/features" className="hover:text-blue-600 transition">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-blue-600 transition">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/demo">
            <Button>Get Demo</Button>
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/90 backdrop-blur-sm shadow-inner px-4 py-4"
          >
            <div className="space-y-3 max-w-[1400px] mx-auto">
              <Link
                href="/features"
                className="block text-gray-700 hover:text-blue-600"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block text-gray-700 hover:text-blue-600"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-blue-600"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-blue-600"
              >
                Contact
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/demo">
                <Button className="w-full">Get Demo</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
