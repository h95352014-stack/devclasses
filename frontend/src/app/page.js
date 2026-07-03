'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, BookOpen, Phone, Mail, MapPin, Menu, X, ChevronRight, 
  FileText, CheckCircle, GraduationCap, Clock, ArrowRight, 
  Play, MessageSquare, HelpCircle, Lock, Download, Star, ExternalLink
} from 'lucide-react';
import { api, getFileUrl } from '@/utils/api';

export default function Homepage() {
  // Website data states
  const [settings, setSettings] = useState({});
  const [courses, setCourses] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [videos, setVideos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [plans, setPlans] = useState([]);

  // UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedPyqExam, setSelectedPyqExam] = useState('JEE');
  const [selectedGalleryCat, setSelectedGalleryCat] = useState('ALL');
  const [activeFaq, setActiveFaq] = useState(null);

  // Form States
  const [enquiryForm, setEnquiryForm] = useState({
    studentName: '', className: 'Class 11', mobile: '', email: '', courseInterested: '', message: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState('');
  
  const [regForm, setRegForm] = useState({
    studentName: '', fatherName: '', mobile: '', whatsapp: '', email: '', address: '', courseName: ''
  });
  const [regSuccess, setRegSuccess] = useState('');

  // Fetch dynamic content on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [
          siteSettings, courseList, topperList, 
          materialList, pyqList, annList, 
          videoList, galleryList, planList, tickerList
        ] = await Promise.all([
          api.getSettings(),
          api.getCourses(),
          api.getToppers(),
          api.getMaterials(),
          api.getPyqs(),
          api.getAnnouncements(),
          api.getYoutubeVideos(),
          api.getGallery(),
          api.getSubscriptions(),
          api.getTickerNotifications()
        ]);

        setSettings(siteSettings);
        setCourses(courseList);
        setToppers(topperList);
        setMaterials(materialList);
        setPyqs(pyqList);
        setAnnouncements(annList);
        setVideos(videoList);
        setGallery(galleryList);
        setPlans(planList);
        setTicker(tickerList);

        // Pre-select first course in forms
        if (courseList.length > 0) {
          setEnquiryForm(prev => ({ ...prev, courseInterested: courseList[0].title }));
          setRegForm(prev => ({ ...prev, courseName: courseList[0].title }));
        }
      } catch (err) {
        console.error('Error loading homepage data, using fallbacks:', err);
      }
    }
    loadData();
  }, []);

  // Handle Enquiry Submit
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.submitEnquiry(enquiryForm);
      setEnquirySuccess(res.message || 'Enquiry submitted successfully!');
      setEnquiryForm({ studentName: '', className: 'Class 11', mobile: '', email: '', courseInterested: courses[0]?.title || '', message: '' });
      setTimeout(() => setEnquirySuccess(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to submit enquiry');
    }
  };

  // Handle Registration Submit
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.registerStudent(regForm);
      setRegSuccess(res.message || 'Online Registration submitted successfully! Awaiting approval.');
      setRegForm({ studentName: '', fatherName: '', mobile: '', whatsapp: '', email: '', address: '', courseName: courses[0]?.title || '' });
      setTimeout(() => setRegSuccess(''), 6000);
    } catch (err) {
      alert(err.message || 'Failed to register');
    }
  };

  // Filter notes
  const filteredMaterials = selectedSubject === 'ALL' 
    ? materials 
    : materials.filter(m => m.subject.toUpperCase() === selectedSubject);

  // Filter PYQs
  const filteredPyqs = pyqs.filter(p => p.exam.toUpperCase() === selectedPyqExam);

  // Filter Gallery
  const filteredGallery = selectedGalleryCat === 'ALL'
    ? gallery
    : gallery.filter(g => g.category.toUpperCase() === selectedGalleryCat);

  // FAQs Array
  const faqs = [
    { q: "What is the admission procedure at DEV CLASSES?", a: "Admissions can be taken directly through our online registration portal or by visiting our physical coaching center. Some premium batches require passing a basic screening test." },
    { q: "Do you offer scholarships for meritorious students?", a: "Yes! We offer up to 50% scholarships based on standard 10th Board percentages, NTSE/Olympiad ranks, or performance in our periodic Scholarship Assessment Tests." },
    { q: "How are student performance analytics shared with parents?", a: "Every assessment test result, detailed subject scorecards, class attendance logs, and rank tracking details are pushed automatically to the Student and Parent portal, and sent via SMS notifications." },
    { q: "How does the doubt clearing facility work?", a: "We have dedicated doubt clearing hours daily at the center. Additionally, students can use the 24/7 doubt-solving module in their online portal to upload photo queries and get detailed video/text answers from our experts." }
  ];

  return (
    <div className="flex-1 flex flex-col font-sans">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="DEV CLASSES" className="h-12 w-auto object-contain rounded" />
              ) : (
                <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-outfit)' }}>
                  DEV CLASSES
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
              <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">Director</a>
              <a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a>
              <a href="#notes" className="hover:text-blue-400 transition-colors">Study Material</a>
              <a href="#tests" className="hover:text-blue-400 transition-colors">Test Series</a>
              <a href="#results" className="hover:text-blue-400 transition-colors">Results</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            </nav>

            {/* CTAs */}
            <div className="hidden md:flex items-center space-x-3">
              <a href="/portal/login" className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Student Portal
              </a>
              <a href="/admin/login" className="px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                Admin
              </a>
              <a href="#register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-500/25 transition-all">
                Register Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Director</a>
            <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Courses</a>
            <a href="#notes" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Study Material</a>
            <a href="#tests" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Test Series</a>
            <a href="#results" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Results</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Contact</a>
            
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <a href="/portal/login" className="w-full py-2.5 text-center border border-slate-700 hover:border-slate-500 rounded-lg text-sm font-medium hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Student Portal
              </a>
              <a href="#register" onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all">
                Register Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ================= NOTIFICATION TICKER ================= */}
      {ticker.length > 0 && (
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white py-2 overflow-hidden relative z-40">
          <div className="flex items-center">
            <span className="shrink-0 px-4 py-0.5 bg-white/20 text-xs font-extrabold uppercase tracking-widest border-r border-white/30 mr-4 whitespace-nowrap">
              🔔 NOTICE
            </span>
            <div className="overflow-hidden flex-1">
              <div 
                className="flex gap-16 whitespace-nowrap"
                style={{ animation: 'ticker-scroll 30s linear infinite' }}
              >
                {[...ticker, ...ticker].map((item, idx) => (
                  <span key={idx} className="text-xs font-semibold shrink-0">
                    {item.content && item.content.startsWith('http') ? (
                      <a href={item.content} target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-200">
                        ▶ {item.title}
                      </a>
                    ) : (
                      <span>📢 {item.title}{item.content ? ` — ${item.content}` : ''}</span>
                    )}
                    <span className="mx-8 opacity-40">|</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative bg-slate-900 text-white pt-24 pb-20 md:py-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Call to Action Left */}
            <div className="md:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-xs font-semibold tracking-wide text-blue-400">
                <Award className="w-3.5 h-3.5" /> Best JEE & NEET Academy — Sikar, Rajasthan
              </div>

              {/* Institute name in large font */}
              <div style={{ fontFamily: 'var(--font-outfit)' }}>
                <p className="text-orange-400 font-extrabold text-lg tracking-widest uppercase mb-1">Welcome to</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
                  DEV CLASSES
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-wider mt-1">SIKAR</p>
                <p className="text-base text-slate-300 mt-4 max-w-2xl">
                  {settings.hero_subtitle || 'Expert Coaching for JEE Main, JEE Advanced & NEET. Highly qualified faculties, structured test schedules, and personal academic mentorship.'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <a href="#register" className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 hover:scale-105 duration-300">
                  Apply Online <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#tests" className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-base font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 hover:scale-105 duration-300">
                  <Play className="w-4 h-4 fill-white" /> Free Test Series
                </a>
                <a 
                  href={settings.youtube_link || 'https://youtube.com/@devclassessikar'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-base font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2 hover:scale-105 duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube Channel
                </a>
                <a href="#courses" className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-base font-semibold rounded-xl border border-slate-700 hover:border-slate-600 active:scale-95 transition-all hover:scale-105 duration-300">
                  Explore Batches
                </a>
                <a href="#notes" className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 hover:scale-105 duration-300">
                  <BookOpen className="w-4 h-4 text-blue-400" /> Study Material
                </a>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-400" style={{ fontFamily: 'var(--font-outfit)' }}>10k+</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Trained</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400" style={{ fontFamily: 'var(--font-outfit)' }}>500+</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">IIT/AIIMS</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-orange-400" style={{ fontFamily: 'var(--font-outfit)' }}>15+</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Years Exp</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-yellow-400" style={{ fontFamily: 'var(--font-outfit)' }}>94.2%</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Institute Highlights Right */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
                <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 text-left space-y-4 hover:-translate-y-2 transition-transform duration-500">
                  <div className="overflow-hidden rounded-xl shadow-md">
                    <img 
                      src="/images/institute.jpg" 
                      alt="DEV CLASSES SIKAR Institute" 
                      className="w-full h-56 object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                      DEV CLASSES <span className="text-orange-400">SIKAR</span>
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold">Rajasthan's Premier Coaching Institute</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "Providing state-of-the-art facilities and a highly competitive environment to foster top ranks in JEE and NEET."
                  </p>
                  <div className="pt-2 flex justify-between items-center text-xs text-slate-300 border-t border-slate-700/60">
                    <span>Our Campus</span>
                    <a href="#contact" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors">
                      Visit Us <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT DIRECTOR ================= */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Director Photo Left */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-tl-3xl z-0"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-50 rounded-br-3xl z-0"></div>
                <img 
                  src={settings.director_photo || "/images/img2.jpg"} 
                  alt="Er. Mukesh Gurjar Bio" 
                  className="relative z-10 w-80 h-96 object-cover rounded-2xl shadow-xl object-top"
                />
              </div>
            </div>

            {/* Director Details Right */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold tracking-wide">
                <GraduationCap className="w-3.5 h-3.5" /> Academic Leadership
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                About the Director
              </h2>
              <p className="text-lg font-medium text-slate-700">
                {settings.director_qual || 'Expert Faculty'}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                {settings.director_bio || 'Er. Mukesh Gurjar is a visionary academician who has devoted the last 15 years of his life to preparing students for competitive examinations like IIT-JEE and NEET. Under his direction, DEV CLASSES has built an unmatched reputation for producing top academic selections with integrity and care.'}
              </p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-2">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Teaching Philosophy</h4>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  {settings.director_philosophy || 'We believe in building conceptual depth over superficial formulas. The education we provide teaches kids how to analyze and solve problems from first principles.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Expert Faculty
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Top Mentorship
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> 15+ Years Pedagogy
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> 500+ IIT & AIIMS Selections
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COURSES SECTION ================= */}
      <section id="courses" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Course Batches
            </h2>
            <p className="text-slate-600 text-sm">
              We offer structured classroom coaching programs designed to unlock every student's highest potential for JEE & NEET.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div className="p-6 text-left space-y-4">
                  {/* Subject badge */}
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                    course.targetExam === 'JEE' ? 'bg-blue-50 text-blue-700' : 
                    course.targetExam === 'NEET' ? 'bg-emerald-50 text-emerald-700' : 
                    'bg-purple-50 text-purple-700'
                  }`}>
                    {course.targetExam} Preparation
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[64px]">
                    {course.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span><strong>Duration:</strong> {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span><strong>Timings:</strong> {course.timings}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Batch Highlights</p>
                    {course.features.split(',').map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-50 text-left bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Course Fee</p>
                    <p className="text-xl font-extrabold text-slate-900">{course.fee === 0 ? 'FREE' : '₹' + course.fee.toLocaleString()}</p>
                  </div>
                  <a href="#register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95">
                    Enroll Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STUDY MATERIAL SECTION ================= */}
      <section id="notes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Study Materials
            </h2>
            <p className="text-slate-600 text-sm">
              Download chapter-wise revision notes, assignments, and Daily Practice Problems (DPP) created by senior faculty members.
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
            {['ALL', 'PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'BIOLOGY'].map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                  selectedSubject === sub 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Grid of Materials */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(mat => (
              <div key={mat.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200/60 text-left space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      {mat.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {mat.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-2">
                    {mat.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Chapter: {mat.chapter}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  {mat.isPremium ? (
                    <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Premium Note
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Free Resource
                    </span>
                  )}

                  <a 
                    href={getFileUrl(mat.fileUrl)} 
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PREVIOUS YEARS QUESTIONS (PYQ) ================= */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-4 text-left space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                JEE & NEET PYQ
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Analyze patterns, question depth, and subject weightage by practicing official previous years' papers. Complete with step-by-step faculty solutions.
              </p>

              {/* Toggle filters */}
              <div className="flex gap-2">
                {['JEE', 'NEET'].map(exam => (
                  <button
                    key={exam}
                    onClick={() => setSelectedPyqExam(exam)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      selectedPyqExam === exam 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {exam} Previous Papers
                  </button>
                ))}
              </div>
            </div>

            {/* Right List Column */}
            <div className="lg:col-span-8">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden divide-y divide-slate-700">
                {filteredPyqs.map(pyq => (
                  <div key={pyq.id} className="p-5 flex flex-wrap items-center justify-between gap-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 bg-slate-700 text-blue-400 rounded-md">
                        {pyq.subject}
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {pyq.exam} {pyq.year} - {pyq.chapter}
                      </h4>
                      <p className="text-xs text-slate-400">Chapter Wise PDF Solution Download</p>
                    </div>

                    <div className="flex gap-2">
                      <a href={getFileUrl(pyq.fileUrl)} className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all">
                        <Download className="w-3.5 h-3.5 text-slate-400" /> Question Paper
                      </a>
                      {pyq.solutionUrl && (
                        <a href={getFileUrl(pyq.solutionUrl)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all">
                          <Download className="w-3.5 h-3.5" /> Solutions
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TEST SERIES SECTION ================= */}
      <section id="tests" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Online CBT Test Series
            </h2>
            <p className="text-slate-600 text-sm">
              Practice online in the actual computer-based test (CBT) interface. Predict your national rank and get precise subject-wise analysis dashboards.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-16">
            {plans.map(plan => {
              const features = JSON.parse(plan.featuresJson);
              return (
                <div key={plan.id} className={`bg-white rounded-2xl border shadow-sm p-8 text-left flex flex-col justify-between ${
                  plan.price > 2500 ? 'border-blue-500 ring-2 ring-blue-500/20 relative' : 'border-slate-200'
                }`}>
                  {plan.price > 2500 && (
                    <span className="absolute -top-3 right-8 bg-blue-600 text-white px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                      RECOMMENDED
                    </span>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>{plan.name}</h4>
                      <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold text-slate-900">{plan.price === 0 ? 'FREE' : '₹' + plan.price}</span>
                        <span className="ml-1 text-slate-500 text-xs font-semibold">/ lifetime access</span>
                      </div>
                    </div>

                    <ul className="space-y-3.5 text-xs text-slate-600">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8 mt-6 border-t border-slate-100">
                    <a href="#register" className={`w-full block py-3 text-center text-xs font-bold rounded-xl transition-all active:scale-95 ${
                      plan.price > 2500 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}>
                      Get Started Now
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= RESULTS & TOPPERS ================= */}
      <section id="results" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Toppers & Results
            </h2>
            <p className="text-slate-600 text-sm">
              We take pride in the academic achievements of our students. Read about their success stories and experiences with DEV CLASSES.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {toppers.map(topper => (
              <div key={topper.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 text-left flex flex-col md:flex-row gap-6 items-start">
                <img 
                  src={topper.photoUrl} 
                  alt={topper.name} 
                  className="w-24 h-24 object-cover rounded-xl shrink-0 shadow-md border border-white"
                />
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>{topper.name}</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md uppercase">
                      {topper.exam} {topper.year}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
                      AIR {topper.air}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">Marks: {topper.marks}</p>
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    "{topper.testimonial}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VIDEO LECTURES SECTION ================= */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Video Lectures
            </h2>
            <p className="text-slate-600 text-sm">
              Watch featured demo classes and subject playlists on our YouTube channel. Study from the comfort of your home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* YouTube Thumbnail */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`; }}
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {video.featured && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <div className="p-5 text-left space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {video.category} Lecture
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  {video.playlist && (
                    <p className="text-[11px] text-slate-400">Playlist: {video.playlist}</p>
                  )}
                  <div className="flex items-center gap-1 text-red-600 text-xs font-semibold pt-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Watch on YouTube
                  </div>
                </div>
              </a>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No video lectures added yet.</div>
          )}

          <div className="text-center mt-12">
            <a
              href={settings.youtube_link || 'https://youtube.com/@devclassessikar'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              View All Videos on YouTube Channel
            </a>
          </div>
        </div>
      </section>

      {/* ================= DOUBT SOLVING SECTION ================= */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Info Left */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold">
                <MessageSquare className="w-3.5 h-3.5" /> 24/7 Doubt Portal
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                No Doubts Unresolved
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                JEE & NEET prep requires quick resolution of conceptual hurdles. Our digital portal allows you to take photo snaps of complex questions, upload them, and receive step-by-step guidance from senior faculties in under 4 hours.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Photo Upload Facility
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Detailed Video/Text Answers
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Verified Faculty Responses
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Track Resolution History
                </div>
              </div>

              <div className="pt-2">
                <a href="/portal/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl inline-flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/25">
                  Submit a Doubt <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* UI Mockup Right */}
            <div className="lg:col-span-5 bg-slate-800 rounded-2xl border border-slate-700/80 p-6 space-y-4 text-left">
              <span className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 bg-slate-700 text-emerald-400 rounded-md">
                RESOLVED TICKET #2819
              </span>
              <div className="space-y-1 pt-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Student Query (Physics)</p>
                <p className="text-xs text-white bg-slate-900/60 p-3 rounded-lg border border-slate-700">
                  "Sir, in finding field due to charged ring, why does the horizontal components add up and vertical cancel?"
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Faculty Response</p>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">HC</div>
                    <span className="text-xs font-bold text-slate-200">Dr. H. C. Verma</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "Due to axial symmetry of the ring, for every charge element dq on one side, there is an identical dq diametrically opposite. Their components perpendicular to the axis cancel out, while axial components sum up."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWS & ANNOUNCEMENTS ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              News & Updates
            </h2>
            <p className="text-slate-600 text-sm">
              Keep track of important exam alerts, batch announcements, scheduling changes, and results release lists.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map(ann => (
              <div key={ann.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                    ann.category === 'EXAM' ? 'bg-orange-50 text-orange-600' :
                    ann.category === 'HOLIDAY' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {ann.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200 text-[10px] text-slate-400 font-medium">
                  Posted: {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FORM SECTIONS: CRM ENQUIRY & ONLINE REGISTRATION ================= */}
      <section id="register" className="py-20 bg-slate-50 border-t border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Interactive Registration Form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-left space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Online Admission Registration
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Fill in the registration form below to secure your seat. Default logins will be generated after approval.
                </p>
              </div>

              {regSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  {regSuccess}
                </div>
              )}

              <form onSubmit={handleRegSubmit} className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Student's Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter Student Name" 
                    value={regForm.studentName} 
                    onChange={e => setRegForm({ ...regForm, studentName: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Father's Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter Father's Name" 
                    value={regForm.fatherName} 
                    onChange={e => setRegForm({ ...regForm, fatherName: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter Email" 
                    value={regForm.email} 
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Mobile Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Enter Mobile" 
                    value={regForm.mobile} 
                    onChange={e => setRegForm({ ...regForm, mobile: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    placeholder="WhatsApp Mobile" 
                    value={regForm.whatsapp} 
                    onChange={e => setRegForm({ ...regForm, whatsapp: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Course Interested In</label>
                  <select 
                    value={regForm.courseName} 
                    onChange={e => setRegForm({ ...regForm, courseName: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Permanent Address</label>
                  <textarea 
                    rows="3" 
                    required 
                    placeholder="Enter Full Address" 
                    value={regForm.address} 
                    onChange={e => setRegForm({ ...regForm, address: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="sm:col-span-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/15 active:scale-95 transition-all mt-2 text-center"
                >
                  Submit Registration
                </button>
              </form>
            </div>

            {/* Right: Quick Enquiry Lead Capture */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 text-left space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div>
                <h3 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Quick Enquiry
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Have doubts about courses, timings, or scholarships? Drop your contact details and a counselor will call you within 2 hours.
                </p>
              </div>

              {enquirySuccess && (
                <div className="p-4 bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-blue-400" />
                  {enquirySuccess}
                </div>
              )}

              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Student Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter Name" 
                    value={enquiryForm.studentName} 
                    onChange={e => setEnquiryForm({ ...enquiryForm, studentName: e.target.value })}
                    className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:bg-slate-900 rounded-lg text-sm text-white transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Class</label>
                    <select 
                      value={enquiryForm.className} 
                      onChange={e => setEnquiryForm({ ...enquiryForm, className: e.target.value })}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:bg-slate-900 rounded-lg text-sm text-white transition-all outline-none"
                    >
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>Class 12 Pass</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="Enter Mobile" 
                      value={enquiryForm.mobile} 
                      onChange={e => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:bg-slate-900 rounded-lg text-sm text-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter Email" 
                    value={enquiryForm.email} 
                    onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:bg-slate-900 rounded-lg text-sm text-white transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Interested Batch</label>
                  <select 
                    value={enquiryForm.courseInterested} 
                    onChange={e => setEnquiryForm({ ...enquiryForm, courseInterested: e.target.value })}
                    className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:bg-slate-900 rounded-lg text-sm text-white transition-all outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Message (Optional)</label>
                  <textarea 
                    rows="2" 
                    placeholder="Enter Query Message" 
                    value={enquiryForm.message} 
                    onChange={e => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:bg-slate-900 rounded-lg text-sm text-white transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/10 text-center"
                >
                  Send Call Request
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Got questions about batch change, fee structures, or digital portals? Check our answers.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-slate-800 font-bold text-sm hover:bg-slate-100/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180 text-blue-500' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/50 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 text-left">
            
            {/* Info panel */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                Reach Out to Us
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Connect with our academic counselors for batch timelines, personal schedules, or physical classroom tours.
              </p>

              <div className="space-y-4 pt-4 text-sm text-slate-700">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-950">Campus Address</h5>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      <a href={settings.map_link || "https://maps.app.goo.gl/SEgkUGnxibE5i7VD7?g_st=aw"} target="_blank" rel="noreferrer" className="hover:text-blue-600 underline">
                        {settings.address || 'DEV CLASSES Campus, Sikar'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-950">Academic Helplines</h5>
                    <div className="text-xs text-slate-600 space-y-0.5 mt-0.5">
                      <p>Call: <a href={`tel:${settings.phone}`} className="hover:text-blue-600">{settings.phone || '+91 8003953284'}</a></p>
                      <p>WhatsApp: <a href={`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}`} className="hover:text-blue-600">{settings.whatsapp || '+91 8003953284'}</a></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-950">Email Communication</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <a href={`mailto:${settings.email}`} className="hover:text-blue-600">{settings.email || 'mukeshgurjar9821@gmail.com'}</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-6 flex gap-3 text-xs text-slate-500 font-semibold border-t border-slate-200">
                <a href={settings.youtube_link || "https://youtube.com"} target="_blank" className="flex items-center gap-1 hover:text-red-600 transition-colors">
                  <Play className="w-4 h-4" /> YouTube
                </a>
                <a href={settings.instagram_link || "https://instagram.com"} target="_blank" className="flex items-center gap-1 hover:text-pink-600 transition-colors">
                  <Star className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>

            {/* Google Maps Embed - DEV CLASSES Sikar */}
            <div className="lg:col-span-7 h-96 w-full rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-slate-200">
              <iframe 
                src="https://maps.google.com/maps?q=DEV+CLASSES+Sikar+Rajasthan&output=embed&z=15"
                className="w-full h-full border-0" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="DEV CLASSES Sikar Location"
              ></iframe>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-left text-sm">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="DEV CLASSES" className="h-10 w-auto object-contain rounded brightness-0 invert" />
              ) : (
                <h4 className="text-lg font-bold text-white tracking-wider" style={{ fontFamily: 'var(--font-outfit)' }}>
                  DEV CLASSES
                </h4>
              )}
              <p className="text-xs text-slate-400 leading-relaxed">
                A premier academy dedicated to mentoring JEE Main, Advanced & NEET aspirants. Creating IITians and Doctors with deep concepts.
              </p>
            </div>

            {/* Column 2: Links */}
            <div className="space-y-3">
              <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Quick Links</h5>
              <div className="flex flex-col space-y-2 text-xs">
                <a href="#home" className="hover:text-white transition-colors">Home</a>
                <a href="#courses" className="hover:text-white transition-colors">Courses & Fees</a>
                <a href="#notes" className="hover:text-white transition-colors">Free Study Material</a>
                <a href="#tests" className="hover:text-white transition-colors">CBT Test Series</a>
              </div>
            </div>

            {/* Column 3: Portals */}
            <div className="space-y-3">
              <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Student & Admin</h5>
              <div className="flex flex-col space-y-2 text-xs">
                <a href="/portal/login" className="hover:text-white transition-colors">Student Login</a>
                <a href="/admin/login" className="hover:text-white transition-colors">Admin Dashboard</a>
                <a href="#register" className="hover:text-white transition-colors">Online Registration</a>
              </div>
            </div>

            {/* Column 4: Contact info */}
            <div className="space-y-3">
              <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Head Office</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                {settings.address || 'DEV CLASSES Campus, Sikar'}
              </p>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
            <p>&copy; {new Date().getFullYear()} DEV CLASSES. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
