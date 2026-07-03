'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, Users, Phone, DollarSign, Award, BookOpen, 
  MessageSquare, Settings, LogOut, CheckCircle, Trash2, Edit3, 
  Plus, Check, X, AlertCircle, RefreshCw, Send, Lock, Eye
} from 'lucide-react';
import { api, getFileUrl } from '@/utils/api';

export default function AdminDashboard() {
  const router = useRouter();

  // Loading & Admin user states
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, enquiries, admissions, courses, notes, doubts, settings

  // CRM & CMS data states
  const [analytics, setAnalytics] = useState({});
  const [enquiries, setEnquiries] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [pyqs, setPyqs] = useState([]); 
  
  // Settings CMS States
  const [settings, setSettings] = useState({});
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Course Edit/Create form state
  const [courseForm, setCourseForm] = useState({ title: '', description: '', duration: '', fee: '', timings: '', targetExam: 'JEE', features: '' });
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  // Material Form state
  const [materialForm, setMaterialForm] = useState({ title: '', subject: 'Physics', chapter: '', fileUrl: '', isPremium: false, category: 'NOTES' });
  const [materialUploading, setMaterialUploading] = useState(false);
  const [pyqUploading, setPyqUploading] = useState({ fileUrl: false, solutionUrl: false });
  const [doubtFileUploading, setDoubtFileUploading] = useState({});

  // Topper Form state
  const [topperForm, setTopperForm] = useState({ name: '', exam: 'JEE Advanced', year: 2026, air: '', marks: '', photoUrl: '', testimonial: '' });

  // PYQ Form state
  const [pyqForm, setPyqForm] = useState({ exam: 'JEE Main', subject: 'Physics', chapter: '', year: new Date().getFullYear(), fileUrl: '', solutionUrl: '' });

  // Doubt Reply state
  const [doubtReplies, setDoubtReplies] = useState({}); // { doubtId: responseText }
  const [doubtReplyFiles, setDoubtReplyFiles] = useState({}); // { doubtId: responseFileUrl }

  // Students tab state
  const [students, setStudents] = useState([]);
  const [credentialModal, setCredentialModal] = useState(null); // { id, name, email }
  const [credForm, setCredForm] = useState({ email: '', password: '' });

  // Test Series Builder state
  const [tests, setTests] = useState([]);
  const [testForm, setTestForm] = useState({ title: '', examType: 'JEE Main', durationMinutes: 180, totalMarks: 0 });
  const [testQuestions, setTestQuestions] = useState([]); // [{id, subject, question, options:['','','',''], correctAnswer:0, marks:4}]
  const [newQuestion, setNewQuestion] = useState({ subject: 'Physics', question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 4 });

  // Load everything
  useEffect(() => {
    async function loadAdminData() {
      try {
        const user = await api.getMe(true);
        if (user.role !== 'SUPER_ADMIN') {
          router.push('/admin/login');
          return;
        }
        setAdminUser(user);

        // Fetch core admin components
        await refreshAllData();
        setLoading(false);
      } catch (err) {
        console.error('Admin verification failed:', err);
        router.push('/admin/login');
      }
    }
    loadAdminData();
  }, [router]);

  const refreshAllData = async () => {
    try {
      const [
        stats, enquiriesList, registrationsList, 
        courseList, materialsList, doubtsList,
        toppersList, websiteSettings, pyqsList
      ] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getEnquiries(),
        api.getRegistrations(),
        api.getCourses(),
        api.getMaterials(),
        api.getDoubts(true),
        api.getToppers(),
        api.getSettings(),
        api.getPyqs()
      ]);

      setAnalytics(stats);
      setEnquiries(enquiriesList);
      setRegistrations(registrationsList);
      setCourses(courseList);
      setMaterials(materialsList);
      setDoubts(doubtsList);
      setToppers(toppersList);
      setSettings(websiteSettings);
      setPyqs(pyqsList);
      // Also load students and tests
      try { const sl = await api.getStudents(); setStudents(sl); } catch(e) {}
      try { const tl = await api.getTests(); setTests(tl); } catch(e) {}
    } catch (e) {
      console.error('Error fetching admin workspace data:', e);
    }
  };

  const handleLogout = () => {
    api.logout(true);
    router.push('/admin/login');
  };

  // Enquiries (CRM) Update status
  const updateEnquiryStatus = async (id, status, counselorName = '') => {
    try {
      await api.updateEnquiryStatus(id, { status, counselorName });
      await refreshAllData();
    } catch (e) {
      alert('Failed to update lead');
    }
  };

  // Admissions Manager Approve
  const handleApproveRegistration = async (id) => {
    if (!confirm('Approve admission registration? This generates a student account ID.')) return;
    try {
      const res = await api.approveRegistration(id);
      alert(`Registration approved! ID card generated: ${res.studentCardId}`);
      await refreshAllData();
    } catch (e) {
      alert('Failed to approve registration');
    }
  };

  // Admissions Manager Reject
  const handleRejectRegistration = async (id) => {
    if (!confirm('Reject this registration request?')) return;
    try {
      await api.rejectRegistration(id);
      await refreshAllData();
    } catch (e) {
      alert('Failed to reject registration');
    }
  };

  // Courses Create/Update
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const feeNum = parseFloat(courseForm.fee);
      if (isEditingCourse) {
        await api.updateCourse(editCourseId, { ...courseForm, fee: feeNum });
        alert('Course batch updated!');
      } else {
        await api.createCourse({ ...courseForm, fee: feeNum });
        alert('New course batch launched!');
      }
      setCourseForm({ title: '', description: '', duration: '', fee: '', timings: '', targetExam: 'JEE', features: '' });
      setIsEditingCourse(false);
      setEditCourseId(null);
      await refreshAllData();
    } catch (e) {
      alert('Failed to save course: ' + e.message);
    }
  };

  // Edit Course Trigger
  const startEditCourse = (course) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      duration: course.duration,
      fee: course.fee.toString(),
      timings: course.timings,
      targetExam: course.targetExam,
      features: course.features
    });
    setIsEditingCourse(true);
    setEditCourseId(course.id);
  };

  // Delete Course
  const deleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course batch?')) return;
    try {
      await api.deleteCourse(id);
      await refreshAllData();
    } catch (e) {
      alert('Failed to delete course');
    }
  };

  // Notes Create
  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    if (!materialForm.fileUrl) {
      alert('Please upload a PDF file first before submitting.');
      return;
    }
    try {
      await api.createMaterial(materialForm);
      setMaterialForm({ title: '', subject: 'Physics', chapter: '', fileUrl: '', isPremium: false, category: 'NOTES' });
      alert('Study material uploaded successfully!');
      await refreshAllData();
    } catch (e) {
      alert('Failed to upload material: ' + (e.message || ''));
    }
  };

  // Delete Material
  const deleteMaterial = async (id) => {
    if (!confirm('Delete this study note/assignment?')) return;
    try {
      await api.deleteMaterial(id);
      await refreshAllData();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  // Toppers Create
  const handleTopperSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createTopper({
        ...topperForm,
        air: parseInt(topperForm.air),
        year: parseInt(topperForm.year)
      });
      setTopperForm({ name: '', exam: 'JEE Advanced', year: 2026, air: '', marks: '', photoUrl: '', testimonial: '' });
      alert('Topper result added successfully!');
      await refreshAllData();
    } catch (e) {
      alert('Failed to save topper result');
    }
  };

  // Delete Topper
  const deleteTopper = async (id) => {
    if (!confirm('Delete this topper record?')) return;
    try {
      await api.deleteTopper(id);
      await refreshAllData();
    } catch (e) {
      alert('Failed to delete topper');
    }
  };

  // Submit Doubt Response
  const handleDoubtResponse = async (doubtId) => {
    const responseText = doubtReplies[doubtId];
    const responseFileUrl = doubtReplyFiles[doubtId];
    if (!responseText && !responseFileUrl) {
      alert('Please enter response text or attach a file');
      return;
    }
    try {
      await api.resolveDoubt(doubtId, responseText, responseFileUrl);
      setDoubtReplies(prev => ({ ...prev, [doubtId]: '' }));
      setDoubtReplyFiles(prev => ({ ...prev, [doubtId]: '' }));
      alert('Doubt response submitted and resolved!');
      await refreshAllData();
    } catch (e) {
      alert('Failed to resolve doubt ticket');
    }
  };

  // PYQ Create
  const handlePyqSubmit = async (e) => {
    e.preventDefault();
    if (!pyqForm.fileUrl) {
      alert('Please upload the Question PDF file first.');
      return;
    }
    try {
      await api.createPyq(pyqForm);
      setPyqForm({ exam: 'JEE Main', subject: 'Physics', chapter: '', year: new Date().getFullYear(), fileUrl: '', solutionUrl: '' });
      setPyqUploading({ fileUrl: false, solutionUrl: false });
      alert('PYQ Uploaded successfully!');
      await refreshAllData();
    } catch (e) {
      alert('Failed to upload PYQ: ' + (e.message || ''));
    }
  };


  // Delete PYQ
  const deletePyq = async (id) => {
    if (!confirm('Delete this PYQ?')) return;
    try {
      await api.deletePyq(id);
      await refreshAllData();
    } catch (e) {
      alert('Failed to delete PYQ');
    }
  };

  // Update Student Credentials
  const handleCredentialUpdate = async (e) => {
    e.preventDefault();
    if (!credentialModal) return;
    try {
      await api.updateStudentCredentials(credentialModal.id, credForm.email || undefined, credForm.password || undefined);
      alert('Student credentials updated successfully!');
      setCredentialModal(null);
      setCredForm({ email: '', password: '' });
      try { const sl = await api.getStudents(); setStudents(sl); } catch(e) {}
    } catch(e) {
      alert('Failed to update credentials: ' + e.message);
    }
  };

  // Test Series: Add question to local list
  const addQuestionToTest = () => {
    if (!newQuestion.question.trim()) { alert('Please enter a question'); return; }
    if (newQuestion.options.some(o => !o.trim())) { alert('Please fill all 4 options'); return; }
    const q = { ...newQuestion, id: Date.now() };
    setTestQuestions(prev => [...prev, q]);
    setNewQuestion({ subject: 'Physics', question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 4 });
  };

  // Test Series: Submit test
  const handleTestSeriesSubmit = async (e) => {
    e.preventDefault();
    if (testQuestions.length === 0) { alert('Add at least one question!'); return; }
    try {
      const totalMarks = testQuestions.reduce((sum, q) => sum + q.marks, 0);
      await api.createTest({
        ...testForm,
        totalMarks,
        questionsJson: JSON.stringify(testQuestions),
        examType: testForm.examType,
        active: true
      });
      alert('Test Series created successfully!');
      setTestForm({ title: '', examType: 'JEE Main', durationMinutes: 180, totalMarks: 0 });
      setTestQuestions([]);
      setNewQuestion({ subject: 'Physics', question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 4 });
      try { const tl = await api.getTests(); setTests(tl); } catch(e) {}
    } catch(e) {
      alert('Failed to create test: ' + e.message);
    }
  };

  // Update Website CMS Settings
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      setSettingsSuccess('Website layout configuration updated successfully!');
      setTimeout(() => setSettingsSuccess(''), 5000);
      await refreshAllData();
    } catch (e) {
      alert('Failed to save settings: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400 font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen">
      
      {/* ================= ADMIN SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col justify-between shrink-0">
        <div className="p-6 text-left">
          {/* Header Brand */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-black bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-outfit)' }}>
              DEV CLASSES
            </span>
            <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold rounded text-orange-400">
              ADMIN
            </span>
          </div>

          {/* Admin profile */}
          <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-600/15 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400">
              {adminUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{adminUser.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">Administrator Portal</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'analytics' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Analytics Overview
            </button>
            
            <button 
              onClick={() => setActiveTab('enquiries')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'enquiries' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" /> CRM Leads Desk
            </button>

            <button 
              onClick={() => setActiveTab('admissions')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'admissions' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" /> Online Admissions
            </button>

            <button 
              onClick={() => setActiveTab('courses')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'courses' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Courses & Fees CMS
            </button>

            <button 
              onClick={() => setActiveTab('notes')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'notes' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Study Materials CMS
            </button>

            <button 
              onClick={() => setActiveTab('doubts')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'doubts' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Doubt Resolution
            </button>

            <button 
              onClick={() => setActiveTab('pyqs')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'pyqs' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> PYQ Bank CMS
            </button>

            <button 
              onClick={() => setActiveTab('testseries')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'testseries' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" /> Test Series Builder
            </button>

            <button 
              onClick={() => setActiveTab('students')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'students' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Student Accounts
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'settings' ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" /> Website CMS Settings
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-900">
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800/80 text-xs font-bold text-red-400 hover:text-red-300 rounded-lg flex items-center justify-center gap-2 border border-slate-800 transition-all"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* ================= ADMIN MAIN ================= */}
      <main className="flex-1 bg-slate-50 overflow-y-auto px-6 py-8 md:px-8 text-left">
        
        {/* VIEW: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Workspace Analytics
                </h2>
                <p className="text-xs text-slate-500">Real-time counts of leads, approvals, courses, and tuition revenue.</p>
              </div>
              <button 
                onClick={refreshAllData}
                className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-600 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Active Students</p>
                  <p className="text-2xl font-extrabold text-slate-900">{analytics.metrics?.totalStudents || 0}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total leads / Enquiries</p>
                  <p className="text-2xl font-extrabold text-slate-900">{analytics.metrics?.totalEnquiries || 0}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Admission Revenue</p>
                  <p className="text-2xl font-extrabold text-slate-900">₹{(analytics.metrics?.totalRevenue || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Study Materials</p>
                  <p className="text-2xl font-extrabold text-slate-900">{analytics.metrics?.totalMaterials || 0}</p>
                </div>
              </div>

            </div>

            {/* CRM & Admissions lists */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Enquiries block */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Recent Enquiry Leads
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100">
                    <thead>
                      <tr className="text-slate-400 font-bold">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Mobile</th>
                        <th className="pb-3">Course</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics.recentEnquiries?.map(enq => (
                        <tr key={enq.id} className="text-slate-700">
                          <td className="py-3 font-semibold">{enq.studentName}</td>
                          <td className="py-3">{enq.mobile}</td>
                          <td className="py-3 max-w-[120px] truncate">{enq.courseInterested}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              enq.status === 'NEW' ? 'bg-orange-50 text-orange-700' :
                              enq.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {enq.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!analytics.recentEnquiries || analytics.recentEnquiries.length === 0) && (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-slate-400">No leads.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admissions block */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Recent Online Registrations
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100">
                    <thead>
                      <tr className="text-slate-400 font-bold">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Course</th>
                        <th className="pb-3">Registration Date</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics.recentRegistrations?.map(reg => (
                        <tr key={reg.id} className="text-slate-700">
                          <td className="py-3 font-semibold">{reg.studentName}</td>
                          <td className="py-3 max-w-[120px] truncate">{reg.courseName}</td>
                          <td className="py-3">{new Date(reg.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              reg.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                              reg.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!analytics.recentRegistrations || analytics.recentRegistrations.length === 0) && (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-slate-400">No registrations.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: ENQUIRIES CRM */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                CRM Enquiry Leads Pipeline
              </h2>
              <p className="text-xs text-slate-500">Track incoming student questions, assign academic advisors, and update statuses.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Interested In</th>
                      <th className="p-4">Message Detail</th>
                      <th className="p-4">Advisor</th>
                      <th className="p-4">Lead Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiries.map(enq => (
                      <tr key={enq.id} className="text-slate-700 hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{enq.studentName}</div>
                          <div className="text-[10px] text-slate-400">{enq.className}</div>
                        </td>
                        <td className="p-4">
                          <div>{enq.mobile}</div>
                          <div className="text-[10px] text-slate-400">{enq.email}</div>
                        </td>
                        <td className="p-4 font-medium">{enq.courseInterested}</td>
                        <td className="p-4 max-w-[200px] truncate" title={enq.message}>
                          {enq.message || 'No remarks.'}
                        </td>
                        <td className="p-4">
                          <input 
                            type="text" 
                            placeholder="Assign counselor" 
                            defaultValue={enq.counselorName || ''}
                            onBlur={(e) => updateEnquiryStatus(enq.id, enq.status, e.target.value)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:border-orange-500"
                          />
                        </td>
                        <td className="p-4">
                          <select
                            value={enq.status}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value, enq.counselorName || '')}
                            className={`px-2 py-1.5 rounded-lg text-xs font-bold border outline-none ${
                              enq.status === 'NEW' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                              enq.status === 'CONTACTED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              enq.status === 'FOLLOW_UP' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                              'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}
                          >
                            <option value="NEW">New Lead</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="FOLLOW_UP">Follow-up</option>
                            <option value="CONVERTED">Converted</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400">No enquiries found in pipeline.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ADMISSIONS MANAGER */}
        {activeTab === 'admissions' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Admissions Approval Desk
              </h2>
              <p className="text-xs text-slate-500">Review online registrations. Approving creates their student credentials automatically.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Student Details</th>
                      <th className="p-4">Father Name</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Tuition Course</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.map(reg => (
                      <tr key={reg.id} className="text-slate-700 hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{reg.studentName}</div>
                          <div className="text-[10px] text-slate-400">{reg.email}</div>
                          <div className="text-[9px] text-slate-400">{reg.address}</div>
                        </td>
                        <td className="p-4">{reg.fatherName}</td>
                        <td className="p-4 font-mono">{reg.mobile}</td>
                        <td className="p-4 font-medium">{reg.courseName}</td>
                        <td className="p-4">{new Date(reg.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reg.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                            reg.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {reg.status === 'PENDING' ? (
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleApproveRegistration(reg.id)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-all"
                                title="Approve Student"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectRegistration(reg.id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all"
                                title="Reject registration"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-slate-400 italic text-[10px]">No Action Needed</div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {registrations.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400">No pending admission registrations.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: COURSES CMS */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Course Batch Manager
              </h2>
              <p className="text-xs text-slate-500">Add or edit classroom courses which show up on the public website automatically.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Form Left */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-left space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {isEditingCourse ? 'Modify Course Batch' : 'Launch New Course Batch'}
                </h3>
                
                <form onSubmit={handleCourseSubmit} className="space-y-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Course Title</label>
                    <input 
                      type="text" required placeholder="e.g. JEE Elite Rank Batch" 
                      value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea 
                      rows="2" required placeholder="Short description of the course targets..." 
                      value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none resize-none focus:border-orange-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Duration</label>
                      <input 
                        type="text" required placeholder="e.g. 1 Year" 
                        value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Timings</label>
                      <input 
                        type="text" required placeholder="e.g. 08:00 AM - 12:00 PM" 
                        value={courseForm.timings} onChange={e => setCourseForm({ ...courseForm, timings: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Exam Target</label>
                      <select 
                        value={courseForm.targetExam} onChange={e => setCourseForm({ ...courseForm, targetExam: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                      >
                        <option>JEE</option>
                        <option>NEET</option>
                        <option>FOUNDATION</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tuition Fee (₹)</label>
                      <input 
                        type="number" required placeholder="e.g. 75000" 
                        value={courseForm.fee} onChange={e => setCourseForm({ ...courseForm, fee: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Highlights (Comma separated)</label>
                    <input 
                      type="text" required placeholder="e.g. Daily DPPs, 1-on-1 Mentorship, Weekly tests" 
                      value={courseForm.features} onChange={e => setCourseForm({ ...courseForm, features: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      {isEditingCourse ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      {isEditingCourse ? 'Update Batch' : 'Launch Batch'}
                    </button>
                    {isEditingCourse && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsEditingCourse(false);
                          setCourseForm({ title: '', description: '', duration: '', fee: '', timings: '', targetExam: 'JEE', features: '' });
                        }}
                        className="px-3 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List Right */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Active Batches ({courses.length})</h3>
                
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-start text-left">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {course.targetExam}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm">{course.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md">{course.description}</p>
                        <div className="flex gap-4 text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
                          <span>Timings: {course.timings}</span>
                          <span>Fee: ₹{course.fee.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => startEditCourse(course)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteCourse(course.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: STUDY MATERIALS CMS */}
        {activeTab === 'notes' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Study Material & Note CMS
              </h2>
              <p className="text-xs text-slate-500">Upload revision notes, worksheets, and DPP PDFs to the digital portal.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Left */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-left space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Upload Study Document
                </h3>
                
                <form onSubmit={handleMaterialSubmit} className="space-y-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Document Title</label>
                    <input 
                      type="text" required placeholder="e.g. Electrostatics Formula Sheet" 
                      value={materialForm.title} onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                      <select 
                        value={materialForm.subject} onChange={e => setMaterialForm({ ...materialForm, subject: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                      >
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Mathematics</option>
                        <option>Biology</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Doc Category</label>
                      <select 
                        value={materialForm.category} onChange={e => setMaterialForm({ ...materialForm, category: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                      >
                        <option>NOTES</option>
                        <option>DPP</option>
                        <option>ASSIGNMENT</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Chapter Reference</label>
                    <input 
                      type="text" required placeholder="e.g. Electrostatics" 
                      value={materialForm.chapter} onChange={e => setMaterialForm({ ...materialForm, chapter: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Upload Document (PDF)</label>
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          setMaterialUploading(true);
                          try {
                            const res = await api.uploadFile(e.target.files[0], true);
                            setMaterialForm(prev => ({ ...prev, fileUrl: res.fileUrl }));
                          } catch (err) {
                            alert('File upload failed. Make sure the backend server is running.');
                          } finally {
                            setMaterialUploading(false);
                          }
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                    />
                    {materialUploading && <span className="text-[10px] text-orange-500 font-bold">⏳ Uploading...</span>}
                    {!materialUploading && materialForm.fileUrl && (
                      <span className="text-[10px] text-emerald-600 font-bold">✓ File uploaded successfully</span>
                    )}
                    {!materialUploading && !materialForm.fileUrl && (
                      <span className="text-[10px] text-slate-400">No file selected yet</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input 
                      type="checkbox" id="isPremium"
                      checked={materialForm.isPremium} onChange={e => setMaterialForm({ ...materialForm, isPremium: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                    />
                    <label htmlFor="isPremium" className="text-xs font-semibold text-slate-700">
                      Restrict to Premium Package Members
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Document
                  </button>
                </form>
              </div>

              {/* List Right */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Uploaded Documents ({materials.length})</h3>
                
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                  {materials.map(mat => (
                    <div key={mat.id} className="p-4 flex items-center justify-between text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                            {mat.subject}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">{mat.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs">{mat.title}</h4>
                        <div className="flex gap-3 text-[10px] text-slate-400">
                          <span>Chapter: {mat.chapter}</span>
                          {mat.isPremium ? (
                            <span className="text-orange-500 font-bold flex items-center gap-0.5"><Lock className="w-3 h-3" /> Premium</span>
                          ) : (
                            <span className="text-emerald-500 font-bold">Free</span>
                          )}
                          <span>•</span>
                          <a href={getFileUrl(mat.fileUrl)} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold">View Document</a>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteMaterial(mat.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {materials.length === 0 && (
                    <p className="p-8 text-center text-slate-400 text-xs">No documents uploaded.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: DOUBTS RESOLUTION */}
        {activeTab === 'doubts' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Academic Doubt Desk
              </h2>
              <p className="text-xs text-slate-500">Provide verified answers and feedback to student query tickets.</p>
            </div>

            <div className="space-y-6">
              {doubts.map(doubt => (
                <div key={doubt.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {doubt.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">Submitted: {new Date(doubt.createdAt).toLocaleDateString()}</span>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      doubt.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                    }`}>
                      {doubt.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Student Query</p>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      "{doubt.questionText}"
                    </p>
                    {doubt.imageUrl && (
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Attached Image:</p>
                        <a href={getFileUrl(doubt.imageUrl)} target="_blank" rel="noreferrer">
                          <img 
                            src={getFileUrl(doubt.imageUrl)} 
                            alt="Student Doubt Attachment" 
                            className="max-h-60 rounded-xl border border-slate-200 object-contain hover:opacity-90 transition-opacity" 
                          />
                        </a>
                      </div>
                    )}
                  </div>

                  {doubt.status === 'RESOLVED' ? (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Faculty Response ({doubt.faculty?.name})</p>
                      <p className="text-xs text-slate-600 leading-relaxed italic bg-emerald-50/20 p-4 rounded-xl border border-emerald-100/50">
                        "{doubt.responseText}"
                      </p>
                      {doubt.responseFileUrl && (
                        <a href={getFileUrl(doubt.responseFileUrl)} target="_blank" rel="noreferrer" className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200">
                          View Attachment
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Write Faculty Response</p>
                      <textarea
                        rows="3"
                        placeholder="Type detailed answer explanation here..."
                        value={doubtReplies[doubt.id] || ''}
                        onChange={e => setDoubtReplies({ ...doubtReplies, [doubt.id]: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none resize-none focus:bg-white focus:border-orange-500"
                      ></textarea>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Attach Solution Document/Photo (Optional)</label>
                        <input 
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setDoubtFileUploading(prev => ({ ...prev, [doubt.id]: true }));
                              try {
                                const res = await api.uploadFile(e.target.files[0], true);
                                setDoubtReplyFiles(prev => ({ ...prev, [doubt.id]: res.fileUrl }));
                              } catch (err) {
                                alert('File upload failed. Make sure the backend server is running.');
                              } finally {
                                setDoubtFileUploading(prev => ({ ...prev, [doubt.id]: false }));
                              }
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                        />
                        {doubtFileUploading[doubt.id] && <span className="text-[10px] text-orange-500 font-bold">⏳ Uploading...</span>}
                        {!doubtFileUploading[doubt.id] && doubtReplyFiles[doubt.id] && <span className="text-[10px] text-emerald-600 font-bold">✓ File Attached!</span>}

                      </div>
                      <button
                        onClick={() => handleDoubtResponse(doubt.id)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Response & Resolve
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {doubts.length === 0 && (
                <p className="text-xs text-slate-400 py-12 bg-white rounded-2xl border border-slate-200/80 text-center">No doubts registered.</p>
              )}
            </div>
          </div>
        )}

        {/* VIEW: PYQ CMS */}
        {activeTab === 'pyqs' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                PYQ Bank CMS
              </h2>
              <p className="text-xs text-slate-500">Upload Previous Year Questions and Answers for JEE Main, Advanced, and NEET.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Left */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-left space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Upload PYQ
                </h3>
                
                <form onSubmit={handlePyqSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Exam Target</label>
                      <select 
                        value={pyqForm.exam} onChange={e => setPyqForm({ ...pyqForm, exam: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                      >
                        <option>JEE Main</option>
                        <option>JEE Advanced</option>
                        <option>NEET</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                      <select 
                        value={pyqForm.subject} onChange={e => setPyqForm({ ...pyqForm, subject: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                      >
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Mathematics</option>
                        <option>Biology</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Year</label>
                      <input 
                        type="number" required placeholder="e.g. 2024" 
                        value={pyqForm.year} onChange={e => setPyqForm({ ...pyqForm, year: parseInt(e.target.value) })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Chapter</label>
                      <input 
                        type="text" required placeholder="e.g. Kinematics" 
                        value={pyqForm.chapter} onChange={e => setPyqForm({ ...pyqForm, chapter: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Question Document (PDF)</label>
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPyqUploading(prev => ({ ...prev, fileUrl: true }));
                          try {
                            const res = await api.uploadFile(e.target.files[0], true);
                            setPyqForm(prev => ({ ...prev, fileUrl: res.fileUrl }));
                          } catch (err) { alert('Upload failed. Make sure backend server is running.'); }
                          finally { setPyqUploading(prev => ({ ...prev, fileUrl: false })); }
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                    />
                    {pyqUploading.fileUrl && <span className="text-[10px] text-orange-500 font-bold">⏳ Uploading...</span>}
                    {!pyqUploading.fileUrl && pyqForm.fileUrl && <span className="text-[10px] text-emerald-600 font-bold">✓ Question PDF uploaded</span>}
                    {!pyqUploading.fileUrl && !pyqForm.fileUrl && <span className="text-[10px] text-slate-400">No file selected yet</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Answer/Solution Document (PDF)</label>
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPyqUploading(prev => ({ ...prev, solutionUrl: true }));
                          try {
                            const res = await api.uploadFile(e.target.files[0], true);
                            setPyqForm(prev => ({ ...prev, solutionUrl: res.fileUrl }));
                          } catch (err) { alert('Upload failed. Make sure backend server is running.'); }
                          finally { setPyqUploading(prev => ({ ...prev, solutionUrl: false })); }
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                    />
                    {pyqUploading.solutionUrl && <span className="text-[10px] text-orange-500 font-bold">⏳ Uploading...</span>}
                    {!pyqUploading.solutionUrl && pyqForm.solutionUrl && <span className="text-[10px] text-emerald-600 font-bold">✓ Solution PDF uploaded</span>}
                    {!pyqUploading.solutionUrl && !pyqForm.solutionUrl && <span className="text-[10px] text-slate-400">No file selected yet</span>}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save PYQ
                  </button>
                </form>
              </div>

              {/* List Right */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Uploaded PYQs ({pyqs.length})</h3>
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                  {pyqs.map(pyq => (
                    <div key={pyq.id} className="p-4 flex items-center justify-between text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                            {pyq.exam}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">{pyq.year}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs">{pyq.subject} - {pyq.chapter}</h4>
                        <div className="flex gap-3 text-[10px] text-blue-500 font-bold mt-1">
                          <a href={getFileUrl(pyq.fileUrl)} target="_blank" className="hover:underline">Question PDF</a>
                          <a href={getFileUrl(pyq.solutionUrl)} target="_blank" className="hover:underline">Solution PDF</a>
                        </div>
                      </div>
                      <button onClick={() => deletePyq(pyq.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {pyqs.length === 0 && (
                    <p className="p-8 text-center text-slate-400 text-xs">No PYQs uploaded.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: TEST SERIES BUILDER */}
        {activeTab === 'testseries' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>Test Series Builder</h2>
              <p className="text-xs text-slate-500">Create timed mock tests for JEE / NEET students. Add questions one by one, then publish.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

              {/* Left: Build test */}
              <div className="lg:col-span-7 space-y-5">

                {/* Test Meta */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>1. Test Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Test Title</label>
                      <input type="text" required placeholder="e.g. JEE Main Full Mock Test 2026 - Set 1"
                        value={testForm.title} onChange={e => setTestForm({ ...testForm, title: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500 focus:bg-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Exam Type</label>
                      <select value={testForm.examType} onChange={e => setTestForm({ ...testForm, examType: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none">
                        <option>JEE Main</option>
                        <option>JEE Advanced</option>
                        <option>NEET</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Duration (minutes)</label>
                      <input type="number" required min="10" max="360"
                        value={testForm.durationMinutes} onChange={e => setTestForm({ ...testForm, durationMinutes: parseInt(e.target.value) })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500 focus:bg-white" />
                    </div>
                  </div>
                </div>

                {/* Question builder */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>2. Add Question</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                      <select value={newQuestion.subject} onChange={e => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none">
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Mathematics</option>
                        <option>Biology</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Marks</label>
                      <input type="number" min="1" max="10"
                        value={newQuestion.marks} onChange={e => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Question Text</label>
                    <textarea rows="3" placeholder="Type question here..."
                      value={newQuestion.question} onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none resize-none focus:border-orange-500 focus:bg-white" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map((label, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          Option {label}
                          <input type="radio" name="correctAnswer" checked={newQuestion.correctAnswer === idx}
                            onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: idx })}
                            className="w-3 h-3 text-emerald-600" />
                          <span className={`text-[9px] ${newQuestion.correctAnswer === idx ? 'text-emerald-600 font-extrabold' : 'text-slate-300'}`}>
                            {newQuestion.correctAnswer === idx ? '✓ Correct' : ''}
                          </span>
                        </label>
                        <input type="text" placeholder={`Option ${label}...`}
                          value={newQuestion.options[idx]}
                          onChange={e => {
                            const opts = [...newQuestion.options];
                            opts[idx] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: opts });
                          }}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500 focus:bg-white" />
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={addQuestionToTest}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Question to Test
                  </button>
                </div>

                {/* Added questions list */}
                {testQuestions.length > 0 && (
                  <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-sm">Questions Added ({testQuestions.length}) — Total: {testQuestions.reduce((s,q)=>s+q.marks,0)} marks</h3>
                    <div className="divide-y divide-slate-100">
                      {testQuestions.map((q, i) => (
                        <div key={q.id} className="py-3 flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{q.subject}</span>
                              <span className="text-[9px] text-slate-400 font-bold">{q.marks} marks</span>
                            </div>
                            <p className="text-xs text-slate-800 font-medium">Q{i+1}. {q.question}</p>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              {q.options.map((opt, oi) => (
                                <span key={oi} className={`text-[10px] px-2 py-0.5 rounded ${oi === q.correctAnswer ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-500'}`}>
                                  {String.fromCharCode(65+oi)}. {opt}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button onClick={() => setTestQuestions(prev => prev.filter(x => x.id !== q.id))}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded shrink-0">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button onClick={handleTestSeriesSubmit}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/15">
                      <Check className="w-4 h-4" /> Publish Test ({testQuestions.length} Questions)
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Existing tests */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Published Tests ({tests.length})</h3>
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                  {tests.map(t => (
                    <div key={t.id} className="p-4 space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">{t.examType}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{t.durationMinutes} min</span>
                        <span className="text-[9px] text-slate-400 font-bold">{t.totalMarks} marks</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{t.title}</h4>
                      <p className="text-[10px] text-slate-400">{JSON.parse(t.questionsJson || '[]').length} questions</p>
                    </div>
                  ))}
                  {tests.length === 0 && (
                    <p className="p-8 text-center text-slate-400 text-xs">No tests published yet. Use the builder on the left.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: STUDENT ACCOUNTS */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>Student Accounts</h2>
              <p className="text-xs text-slate-500">View enrolled students and update their login credentials (email & password).</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Student</th>
                      <th className="p-4">ID Card</th>
                      <th className="p-4">Login Email</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Course</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(st => (
                      <tr key={st.id} className="text-slate-700 hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{st.user?.name || '—'}</td>
                        <td className="p-4 font-mono text-slate-500">{st.studentIdCard || '—'}</td>
                        <td className="p-4 text-slate-600">{st.user?.email || '—'}</td>
                        <td className="p-4 font-mono">{st.mobile || '—'}</td>
                        <td className="p-4">{st.courses?.[0]?.title || '—'}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => { setCredentialModal({ id: st.id, name: st.user?.name, email: st.user?.email }); setCredForm({ email: st.user?.email || '', password: '' }); }}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold rounded-lg flex items-center gap-1 mx-auto transition-all">
                            <Edit3 className="w-3 h-3" /> Edit Login
                          </button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr><td colSpan="6" className="p-8 text-center text-slate-400">No students found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Credentials Modal */}
            {credentialModal && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                      Edit Login: {credentialModal.name}
                    </h3>
                    <button onClick={() => setCredentialModal(null)} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-xs text-slate-500">Leave password blank to keep existing password. Email will be updated to the new value entered.</p>
                  <form onSubmit={handleCredentialUpdate} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Login Email</label>
                      <input type="email"
                        value={credForm.email} onChange={e => setCredForm({ ...credForm, email: e.target.value })}
                        className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500 focus:bg-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">New Password (leave blank to keep current)</label>
                      <input type="password" placeholder="Enter new password..."
                        value={credForm.password} onChange={e => setCredForm({ ...credForm, password: e.target.value })}
                        className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500 focus:bg-white" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit"
                        className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs active:scale-95 transition-all">
                        Update Credentials
                      </button>
                      <button type="button" onClick={() => setCredentialModal(null)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: SETTINGS CMS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSettingsSubmit} className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Website CMS Settings
              </h2>
              <p className="text-xs text-slate-500">Edit homepage title banners, contact helplines, address, and director bio details.</p>
            </div>

            {settingsSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            {/* Layout Cards */}
            <div className="grid lg:grid-cols-2 gap-8 items-start text-left text-xs">
              
              {/* Box 1: Hero & Contact */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-50 pb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Hero Header & Meta Configuration
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Hero H1 Title Banner</label>
                  <input 
                    type="text" required
                    value={settings.hero_title || ''} 
                    onChange={e => setSettings({ ...settings, hero_title: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Hero Subtitle</label>
                  <textarea 
                    rows="2" required
                    value={settings.hero_subtitle || ''} 
                    onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none focus:bg-white"
                  ></textarea>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-50 pt-4 pb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Contact Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500 uppercase">Helpline Mobile</label>
                    <input 
                      type="text" required
                      value={settings.phone || ''} 
                      onChange={e => setSettings({ ...settings, phone: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500 uppercase">WhatsApp Helplines</label>
                    <input 
                      type="text" required
                      value={settings.whatsapp || ''} 
                      onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Helpline Email</label>
                  <input 
                    type="email" required
                    value={settings.email || ''} 
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Campus Address</label>
                  <textarea 
                    rows="2" required
                    value={settings.address || ''} 
                    onChange={e => setSettings({ ...settings, address: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Box 2: Director bio */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-50 pb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Director Professional Credentials
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500 uppercase">Director Name</label>
                    <input 
                      type="text" required
                      value={settings.director_name || ''} 
                      onChange={e => setSettings({ ...settings, director_name: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500 uppercase">Director Photo URL</label>
                    <input 
                      type="text" required
                      value={settings.director_photo || ''} 
                      onChange={e => setSettings({ ...settings, director_photo: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Qualifications & Degrees</label>
                  <input 
                    type="text" required
                    value={settings.director_qual || ''} 
                    onChange={e => setSettings({ ...settings, director_qual: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Academic Biography</label>
                  <textarea 
                    rows="4" required
                    value={settings.director_bio || ''} 
                    onChange={e => setSettings({ ...settings, director_bio: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Teaching Philosophy</label>
                  <textarea 
                    rows="3" required
                    value={settings.director_philosophy || ''} 
                    onChange={e => setSettings({ ...settings, director_philosophy: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
                  ></textarea>
                </div>
              </div>

            </div>

            {/* Global Premium Override */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-left">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-50 pb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                Global Monetization & Premium Settings
              </h3>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="test_series_premium"
                  checked={settings.test_series_premium === 'true'}
                  onChange={e => setSettings({ ...settings, test_series_premium: e.target.checked ? 'true' : 'false' })}
                  className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="test_series_premium" className="font-bold text-slate-700 text-xs">
                  Force All Free Test Series & Notes to Premium (Lock content for non-subscribed users)
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/15 active:scale-95 transition-all text-xs"
              >
                Save Layout Configurations
              </button>
            </div>
          </form>
        )}

      </main>
    </div>
  );
}
