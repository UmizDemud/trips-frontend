import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        <nav className="h-20 mt-2 py-2 absolute top-0 left-0 right-0 flex justify-between items-end border-b">
          <div className="w-24 mr-16 ml-8">
            <Link className="block w-fit h-fit rounded-xl p-2 hover:bg-slate-200/40 transition duration-500" href="/">
              <Image src="/logo.png" width={60} height={60} alt="Logo" />
            </Link>
          </div>
          <div className="flex-1 flex gap-8">
            <Link href="/trip" className="block w-32 px-4 py-2 bg-neutral-100/10 hover:bg-neutral-100 border-b-2 border-neutral-400 rounded-t-3xl rounded-b text-lg text-center transition">
              Trips
            </Link>
          </div>
          <div className="self-center w-48 mr-8 flex justify-end items-center">
            <Link href="/trip/new" className="rounded-full hover:scale-105 border-neutral-800 border-2 transition">
                <PlusIcon className="hover:stroke-3 stroke-2 transition" stroke="#262626" size={36} />
              </Link>
          </div>
        </nav>
        <div className="w-full flex mt-24">
          <div className="hidden md:block max-w-[3rem] w-64 hover:max-w-[16rem] transition-[max-width]"> </div>
          <div className="min-h[calc(100vh - 5rem)] min-w-[100%] pl-4 pt-2 border-l">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
