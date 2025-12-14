"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Instagram, Linkedin, Github, Send } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" border-t border-card pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 font-display font-bold text-xl text-blue-600">
              <Image src="/text.png" alt="Logo" width={140} height={140} />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The exclusive student marketplace. Swap skills, save money, and
              build your future.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="#"
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-pink-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-blue-600 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-600 transition-colors"
                >
                  Pricing (Free)
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/study"
                  className="hover:text-blue-600 transition-colors"
                >
                  Study Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/market"
                  className="hover:text-blue-600 transition-colors"
                >
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-blue-600 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Get the latest updates on new features and campus launches.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Enter your email"
                className="bg-white border-slate-200 focus:border-blue-500"
                type="email"
              />
              <Button
                type="submit"
                size="icon"
                className=""
                variant={"secondary"}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} Orbit Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-slate-900 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
