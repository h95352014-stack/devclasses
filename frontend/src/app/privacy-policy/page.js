'use client';

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Title */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Legal Document
          </div>
          <h1 className="text-4xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            DEV CLASSES SIKAR &nbsp;|&nbsp; Effective Date: 1st January 2025 &nbsp;|&nbsp; Last Updated: 1st July 2026
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-10 text-left text-slate-700 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">1. Introduction</h2>
            <p className="text-sm">
              DEV CLASSES ("we", "us", "our"), located at Sikar, Rajasthan, India, operates the website <strong>devclasses.vercel.app</strong> and the associated student portal. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p className="text-sm">
              By accessing or using our services, you agree to the terms described in this Privacy Policy. If you do not agree, please discontinue using our services immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">2. Information We Collect</h2>
            <p className="text-sm font-semibold text-slate-700">We collect the following categories of personal information:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">a) Registration & Enquiry Data</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                  <li>Full name and father's name</li>
                  <li>Mobile number and WhatsApp number</li>
                  <li>Email address</li>
                  <li>Residential address</li>
                  <li>Current class/grade and course of interest</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">b) Student Portal Data</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                  <li>Login credentials (email and hashed password)</li>
                  <li>Test performance scores, ranks and subject-wise analysis</li>
                  <li>Attendance logs</li>
                  <li>Uploaded doubt images and queries</li>
                  <li>Course enrollment details</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">c) Automatically Collected Data</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Device information</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">3. How We Use Your Information</h2>
            <p className="text-sm">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>To process your admission registration and create your student account</li>
              <li>To provide you access to study materials, test series, and the doubt-solving portal</li>
              <li>To track and share your academic progress, attendance, and test results</li>
              <li>To send important notices, exam schedules, and course updates via SMS or email</li>
              <li>To respond to your enquiries and provide academic counseling</li>
              <li>To improve our website, services, and academic programs</li>
              <li>To comply with legal and regulatory obligations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">4. Data Sharing and Disclosure</h2>
            <p className="text-sm">
              We do <strong>not sell, rent, or trade</strong> your personal information to any third parties. We may share your data only in the following limited circumstances:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li><strong>Faculty & Academic Staff:</strong> To resolve doubts, manage attendance, and track student performance</li>
              <li><strong>Service Providers:</strong> Trusted third-party services (e.g., cloud hosting, email delivery) who process data on our behalf under confidentiality agreements</li>
              <li><strong>Legal Compliance:</strong> When required by law, court order, or government authority</li>
              <li><strong>Parent/Guardian:</strong> Academic progress and attendance information may be shared with parents</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">5. Data Security</h2>
            <p className="text-sm">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>All passwords are hashed using bcrypt encryption and never stored in plain text</li>
              <li>Access to student data is role-restricted (admin, faculty, counselor, student)</li>
              <li>All data transmissions occur over HTTPS encrypted connections</li>
              <li>Regular security reviews and access audits</li>
            </ul>
            <p className="text-sm text-slate-500 italic">
              While we take reasonable precautions, no method of internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">6. Data Retention</h2>
            <p className="text-sm">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy. Specifically:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>Student academic records are retained for a minimum of 3 years after course completion</li>
              <li>Enquiry data is retained for 1 year after the initial contact</li>
              <li>You may request deletion of your account data at any time (subject to legal obligations)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">7. Your Rights</h2>
            <p className="text-sm">You have the following rights with respect to your personal data:</p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal data (where legally permissible)</li>
              <li><strong>Right to Object:</strong> Object to processing of your data for marketing purposes</li>
            </ul>
            <p className="text-sm">To exercise your rights, contact us at <a href="mailto:mukeshgurjar9821@gmail.com" className="text-blue-600 hover:underline">mukeshgurjar9821@gmail.com</a>.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">8. Cookies</h2>
            <p className="text-sm">
              Our website uses minimal cookies for session management and login authentication. We do not use advertising or tracking cookies. You may disable cookies through your browser settings, though this may affect website functionality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">9. Third-Party Links</h2>
            <p className="text-sm">
              Our website may contain links to YouTube and other third-party platforms. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies when visiting them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">10. Children's Privacy</h2>
            <p className="text-sm">
              Our services are directed at students preparing for JEE and NEET, many of whom may be under 18. We collect data from minors only with verified parental/guardian consent obtained at the time of registration. Parents may contact us to review or delete their child's data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">11. Changes to This Policy</h2>
            <p className="text-sm">
              We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Continued use of our services after changes constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">12. Contact Us</h2>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-sm space-y-1">
              <p className="font-bold text-slate-800">DEV CLASSES SIKAR</p>
              <p className="text-slate-600">Sikar, Rajasthan, India</p>
              <p className="text-slate-600">Phone: <a href="tel:+918003953284" className="text-blue-600 hover:underline">+91 8003953284</a></p>
              <p className="text-slate-600">Email: <a href="mailto:mukeshgurjar9821@gmail.com" className="text-blue-600 hover:underline">mukeshgurjar9821@gmail.com</a></p>
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-10 text-center space-x-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-slate-700 transition-colors">← Back to Home</Link>
          <Link href="/terms-and-conditions" className="hover:text-slate-700 transition-colors">Terms &amp; Conditions →</Link>
        </div>
      </main>
    </div>
  );
}
