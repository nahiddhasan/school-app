"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Page {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  parentId?: string | null;
  children?: Page[];
}

interface NavbarProps {
  pages: Page[];
  school: string;
}

const Navbar = ({ pages, school }: NavbarProps) => {
  const topLevelPages = pages.filter((page) => !page.parentId);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 140);
    };

    window.addEventListener("scroll", handleScroll);
    setMounted(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <button onClick={() => setIsDrawerOpen(true)}>
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Desktop Navbar (non-sticky) */}
      {!active && (
        <nav className="hidden lg:block px-6 py-3 mx-auto relative">
          <ul className="flex gap-6 justify-center">
            {topLevelPages.map((page) => (
              <NavItem key={page.id} page={page} school={school} />
            ))}
          </ul>
        </nav>
      )}

      {/* Sticky Navbar (desktop) */}
      <AnimatePresence>
        {mounted && active && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full z-50 gradient shadow px-6 py-3 hidden lg:flex items-center justify-center bg-white"
          >
            <ul className="flex gap-6">
              {topLevelPages.map((page) => (
                <NavItem key={page.id} page={page} school={school} />
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-lg px-4 py-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Navigation</span>
                <button onClick={() => setIsDrawerOpen(false)}>
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>
              <ul className="space-y-2">
                {topLevelPages.map((page) => (
                  <MobileNavItem
                    key={page.id}
                    page={page}
                    school={school}
                    closeDrawer={() => setIsDrawerOpen(false)}
                  />
                ))}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

// ---------- Desktop Nav Item ----------
function NavItem({ page, school }: { page: Page; school: string }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {page.slug ? (
        <Link
          href={`/${school}${page.slug}`}
          className="text-white hover:text-blue-400 font-medium transition"
        >
          {page.title}
        </Link>
      ) : (
        <span className="text-white font-medium cursor-default">
          {page.title} ›
        </span>
      )}

      {page.children && page.children.length > 0 && (
        <AnimatePresence>
          {isHovering && (
            <motion.ul
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-max bg-white border border-gray-200 shadow-lg rounded-md z-50"
            >
              {page.children.map((child) => (
                <NavSubItem key={child.id} page={child} school={school} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

function NavSubItem({ page, school }: { page: Page; school: string }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center group">
        {page.slug ? (
          <Link
            href={`/${school}${page.slug}`}
            className="text-gray-700 group-hover:text-blue-600"
          >
            {page.title}
          </Link>
        ) : (
          <span className="text-gray-700">{page.title}</span>
        )}
        {page.children && page.children.length > 0 && (
          <span className="ml-2">›</span>
        )}
      </div>

      {page.children && page.children.length > 0 && (
        <AnimatePresence>
          {isHovering && (
            <motion.ul
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-full top-0 mt-0 w-max bg-white border border-gray-200 shadow-lg rounded-md z-50"
            >
              {page.children.map((child) => (
                <NavSubItem key={child.id} page={child} school={school} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

// ---------- Mobile Nav Item ----------
function MobileNavItem({
  page,
  school,
  closeDrawer,
}: {
  page: Page;
  school: string;
  closeDrawer: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <div
        className="flex justify-between items-center cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
        onClick={() => {
          if (page.children && page.children.length > 0) {
            setOpen(!open);
          } else if (page.slug) {
            closeDrawer();
          }
        }}
      >
        {page.slug ? (
          <Link
            href={`/${school}${page.slug}`}
            onClick={closeDrawer}
            className="text-gray-700 font-medium"
          >
            {page.title}
          </Link>
        ) : (
          <span className="text-gray-700 font-medium">{page.title}</span>
        )}
        {page.children && page.children.length > 0 && (
          <span className="text-sm">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </div>

      {open && page.children && (
        <ul className="pl-4 mt-1 space-y-1">
          {page.children.map((child) => (
            <MobileNavItem
              key={child.id}
              page={child}
              school={school}
              closeDrawer={closeDrawer}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
