import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "DEV CLASSES | Premier JEE & NEET Coaching Institute",
  description: "Transforming aspirants into IITians & future doctors with top-tier courses, mock tests, and real-time student tracking ERP.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  }
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      <body className="min-h-full bg-slate-50 flex flex-col text-slate-800">
        {children}
      </body>
    </html>
  );
}
