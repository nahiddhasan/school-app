"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const featureTags = [
  "Multi-Role Access",
  "Realtime Attendance",
  "Smart Notifications",
  "Centralized Results",
  "Student Portal",
];

const HeroSection = () => {
  return (
    <section className=" py-16 sm:py-24">
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Manage Schools <br />
            <span className="text-blue-600">Smarter, Faster, Easier</span>
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            All-in-one school management platform for administrators, teachers,
            students, and parents. Built for multi-school systems with powerful
            role-based access.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Link href="/demo">
              <Button size="lg">Request a Demo</Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 max-w-md">
            {featureTags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full max-w-md mx-auto"
        >
          <Image
            src="/img/schoolDashboard1.png" // Replace with your real image path
            alt="School Dashboard"
            width={800}
            height={600}
            className="rounded-2xl shadow-2xl border"
            priority
          />
        </motion.div>
      </div>

      {/* Trust badges / Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 text-center px-4"
      >
        <p className="text-gray-500 text-sm mb-4">
          Trusted by 50+ schools and 10,000+ students
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
