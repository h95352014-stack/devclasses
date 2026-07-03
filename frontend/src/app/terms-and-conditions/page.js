'use client';

import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditions() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Legal Document
          </div>
          <h1 className="text-4xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-500 text-sm">
            DEV CLASSES SIKAR &nbsp;|&nbsp; Effective Date: 1st January 2025 &nbsp;|&nbsp; Last Updated: 1st July 2026
          </p>
        </div>

        {/* Terms Body */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-10 text-left text-slate-700 leading-relaxed">

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-800">
            <strong>Please read these Terms &amp; Conditions carefully</strong> before registering for or using any services offered by DEV CLASSES. By registering, enrolling, or accessing our website and portal, you agree to be legally bound by these terms.
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">1. About DEV CLASSES</h2>
            <p className="text-sm">
              DEV CLASSES is a private coaching institute headquartered in Sikar, Rajasthan, India, specializing in competitive examination preparation for JEE Main, JEE Advanced, and NEET. We provide classroom coaching, online study materials, test series, and an integrated student management portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">2. Eligibility</h2>
            <p className="text-sm">Our services are available to:</p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>Students currently enrolled in Class 10, 11, or 12 preparing for JEE or NEET</li>
              <li>Class 12 pass students appearing for repeater batches</li>
              <li>Students whose parent or legal guardian has provided consent for minors under 18</li>
            </ul>
            <p className="text-sm">We reserve the right to refuse admission or access to any individual without providing a reason.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">3. Admission & Registration</h2>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>All online registrations are subject to review and approval by our admissions team</li>
              <li>Submitting a registration form does not guarantee admission until an approval confirmation is issued</li>
              <li>Student credentials (email/password) are generated upon admission approval</li>
              <li>Students are responsible for maintaining the confidentiality of their login credentials</li>
              <li>Any misuse or sharing of login credentials may result in immediate account suspension</li>
              <li>DEV CLASSES reserves the right to update batch allocations, timings, and faculty assignments at any time</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">4. Fee & Payment Policy</h2>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>Course fees must be paid as per the schedule communicated at the time of admission</li>
              <li>All fees are payable in advance as per the batch payment structure</li>
              <li><strong>Fees once paid are non-refundable</strong> except in cases where DEV CLASSES is unable to provide the enrolled service</li>
              <li>In case of batch discontinuation by the institute, a pro-rated refund may be issued at management's discretion</li>
              <li>Scholarships are subject to annual renewal based on academic performance criteria</li>
              <li>Late payment may result in temporary suspension of portal access</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">5. Student Conduct & Discipline</h2>
            <p className="text-sm">All students enrolled at DEV CLASSES are expected to:</p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>Attend classes regularly and punctually. Minimum 75% attendance is mandatory for test series participation</li>
              <li>Maintain respectful behavior towards faculty, staff, and fellow students</li>
              <li>Complete all assigned practice problems, tests, and homework on time</li>
              <li>Not engage in any form of cheating, plagiarism, or academic dishonesty during assessments</li>
              <li>Not copy, share, or reproduce any copyrighted study material provided by the institute</li>
              <li>Refrain from using mobile phones or electronic devices during class hours</li>
            </ul>
            <p className="text-sm">Violation of conduct rules may result in suspension or permanent expulsion from the institute, without refund of fees.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">6. Student Portal & Digital Services</h2>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>The student portal provides access to test series, study materials, attendance records, and doubt resolution</li>
              <li>Portal access is strictly for enrolled students and is non-transferable</li>
              <li>Digital study materials are provided for personal educational use only and must not be shared, resold, or distributed</li>
              <li>DEV CLASSES reserves the right to modify, restrict, or discontinue any digital service at any time</li>
              <li>We are not liable for downtime, data loss, or technical issues beyond our reasonable control</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">7. Intellectual Property</h2>
            <p className="text-sm">
              All content on this website and in our student portal — including but not limited to study notes, question papers, video lectures, test series, course material, and branding — is the exclusive intellectual property of DEV CLASSES. Unauthorized reproduction, distribution, or commercial use of any content is strictly prohibited and may lead to legal action.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">8. Test Series & Academic Performance</h2>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>Test results, ranks, and performance analytics are for internal academic tracking purposes only</li>
              <li>Rankings shown in our portal are relative to DEV CLASSES students only and do not represent national or competitive ranks</li>
              <li>DEV CLASSES does not guarantee specific ranks, selections, or academic results in any competitive examination</li>
              <li>Malpractice during online tests will result in immediate disqualification and disciplinary action</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">9. Disclaimer of Warranties</h2>
            <p className="text-sm">
              DEV CLASSES provides its services on an "as-is" basis. While we strive to provide the highest quality of academic preparation, we make no guarantees or warranties, express or implied, regarding:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>Selection or qualification in JEE, NEET, or any other competitive examination</li>
              <li>Accuracy or completeness of study materials at all times</li>
              <li>Uninterrupted availability of the website or student portal</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">10. Limitation of Liability</h2>
            <p className="text-sm">
              To the fullest extent permitted by applicable law, DEV CLASSES shall not be liable for any indirect, incidental, special, or consequential damages arising out of or relating to your use of our services, including but not limited to loss of data, academic setbacks, or technical failures. Our total liability to you shall not exceed the fees paid by you in the preceding 3 months.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">11. Photography & Media Consent</h2>
            <p className="text-sm">
              By enrolling at DEV CLASSES, students and parents grant permission to the institute to use photographs, videos, or testimonials featuring the student for educational and promotional purposes (website, social media, brochures), unless a written opt-out is submitted to the administration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">12. Termination of Services</h2>
            <p className="text-sm">DEV CLASSES reserves the right to terminate or suspend access to services at any time, with or without notice, for any of the following reasons:</p>
            <ul className="list-disc list-inside text-sm space-y-1.5 text-slate-600 pl-2">
              <li>Violation of these Terms &amp; Conditions</li>
              <li>Non-payment of fees</li>
              <li>Misconduct or disciplinary violations</li>
              <li>Fraudulent or unauthorized use of the portal</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">13. Governing Law & Dispute Resolution</h2>
            <p className="text-sm">
              These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts located in Sikar, Rajasthan, India. In the event of a dispute, parties agree to first attempt resolution through good-faith negotiation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">14. Amendments</h2>
            <p className="text-sm">
              DEV CLASSES reserves the right to modify these Terms &amp; Conditions at any time. Updated terms will be posted on this page. Continued use of services after any modification constitutes your acceptance of the updated terms. It is your responsibility to review these terms periodically.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2">15. Contact Information</h2>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-sm space-y-1">
              <p className="font-bold text-slate-800">DEV CLASSES SIKAR</p>
              <p className="text-slate-600">Sikar, Rajasthan, India</p>
              <p className="text-slate-600">Phone: <a href="tel:+918003953284" className="text-blue-600 hover:underline">+91 8003953284</a></p>
              <p className="text-slate-600">Email: <a href="mailto:mukeshgurjar9821@gmail.com" className="text-blue-600 hover:underline">mukeshgurjar9821@gmail.com</a></p>
              <p className="text-slate-600">Director: Er. Mukesh Gurjar</p>
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-10 text-center space-x-6 text-sm text-slate-400">
          <Link href="/privacy-policy" className="hover:text-slate-700 transition-colors">← Privacy Policy</Link>
          <Link href="/" className="hover:text-slate-700 transition-colors">Back to Home →</Link>
        </div>
      </main>
    </div>
  );
}
