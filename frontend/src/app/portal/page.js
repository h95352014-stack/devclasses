'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, Calendar, BookOpen, MessageSquare, User, 
  LogOut, CheckCircle, Clock, FileText, ChevronRight, AlertCircle,
  HelpCircle, Send, Check, Play, ChevronLeft, Award, Lock, Download
} from 'lucide-react';
import { api } from '@/utils/api';

export default function StudentPortal() {
  const router = useRouter();
  
  // App states
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, tests, notes, doubts, profile
  const [attendance, setAttendance] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tests, setTests] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // CBT Exam States
  const [cbtActiveTest, setCbtActiveTest] = useState(null); // When taking a test
  const [cbtAnswers, setCbtAnswers] = useState({}); // { qId: optionIndex }
  const [cbtTimeLeft, setCbtTimeLeft] = useState(0); // in seconds
  const [cbtCurrentIdx, setCbtCurrentIdx] = useState(0);
  const [cbtSubmitting, setCbtSubmitting] = useState(false);
  const [cbtReport, setCbtReport] = useState(null); // Scorecard after test
  const timerRef = useRef(null);

  // Doubt submission states
  const [doubtForm, setDoubtForm] = useState({ subject: 'Physics', questionText: '', imageUrl: '' });
  const [doubtSuccess, setDoubtSuccess] = useState(false);

  // Verify auth on mount
  useEffect(() => {
    async function loadPortalData() {
      try {
        const user = await api.getMe(false);
        if (user.role !== 'STUDENT') {
          router.push('/portal/login');
          return;
        }
        setStudent(user);

        // Fetch student specifics
        const [attList, matList, testList, resultList, doubtList, settingsData] = await Promise.all([
          api.getMyAttendance(),
          api.getMaterials(),
          api.getTests(),
          api.getMyTestResults(),
          api.getDoubts(false),
          api.getSettings()
        ]);

        setAttendance(attList);
        setMaterials(matList);
        setTests(testList);
        setMyResults(resultList);
        setDoubts(doubtList);
        setSettings(settingsData);
        setLoading(false);
      } catch (err) {
        console.error('Portal loading error, redirecting to login:', err);
        router.push('/portal/login');
      }
    }
    loadPortalData();
  }, [router]);

  // CBT Timer effect
  useEffect(() => {
    if (cbtActiveTest && cbtTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setCbtTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleCbtSubmit(true); // Auto submit on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [cbtActiveTest, cbtTimeLeft]);

  const handleLogout = () => {
    api.logout(false);
    router.push('/portal/login');
  };

  // Launch CBT Player
  const startMockTest = (test) => {
    const questions = JSON.parse(test.questionsJson);
    setCbtActiveTest(test);
    setCbtAnswers({});
    setCbtTimeLeft(test.durationMinutes * 60);
    setCbtCurrentIdx(0);
    setCbtReport(null);
  };

  // Select Option in CBT
  const handleCbtSelectOption = (qId, optIdx) => {
    setCbtAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  // Submit CBT Mock test
  const handleCbtSubmit = async (isAuto = false) => {
    if (!cbtActiveTest) return;
    setCbtSubmitting(true);
    clearInterval(timerRef.current);

    try {
      const res = await api.submitTest(cbtActiveTest.id, cbtAnswers);
      setCbtReport(res);
      // Reload results
      const updatedResults = await api.getMyTestResults();
      setMyResults(updatedResults);
    } catch (err) {
      alert('Failed to submit test: ' + err.message);
    } finally {
      setCbtSubmitting(false);
    }
  };

  // Submit Doubt Ticket
  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    if (!doubtForm.questionText) return;
    try {
      await api.submitDoubt(doubtForm.subject, doubtForm.questionText, doubtForm.imageUrl);
      setDoubtSuccess(true);
      setDoubtForm({ subject: 'Physics', questionText: '', imageUrl: '' });
      const updatedDoubts = await api.getDoubts(false);
      setDoubts(updatedDoubts);
      setTimeout(() => setDoubtSuccess(false), 4000);
    } catch (err) {
      alert('Failed to submit doubt');
    }
  };

  // Formats time (seconds -> HH:MM:SS)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400 font-semibold">Loading Student Portal...</p>
        </div>
      </div>
    );
  }

  // Attendance metrics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const attPct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Render Full CBT Test Screen
  if (cbtActiveTest) {
    const questions = JSON.parse(cbtActiveTest.questionsJson);
    const currentQ = questions[cbtCurrentIdx];
    const isAnswered = cbtAnswers[currentQ.id] !== undefined;

    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans select-none">
        
        {/* CBT Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              {cbtActiveTest.examType} MOCK EXAM
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-100">{cbtActiveTest.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-yellow-400 font-mono text-sm font-bold">
              <Clock className="w-4 h-4" /> {formatTime(cbtTimeLeft)}
            </div>
            
            {!cbtReport && (
              <button 
                onClick={() => { if(confirm('Are you sure you want to finish and submit the test?')) handleCbtSubmit(); }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95"
              >
                Submit Test
              </button>
            )}
          </div>
        </header>

        {/* Report Card Screen */}
        {cbtReport ? (
          <div className="flex-1 overflow-y-auto px-6 py-12 flex items-center justify-center">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Test Scorecard
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your mock examination has been graded successfully.
                </p>
              </div>

              {/* Ranks & Marks */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Marks Earned</p>
                  <p className="text-3xl font-extrabold text-white mt-1">{cbtReport.score} <span className="text-xs text-slate-400">/ {cbtActiveTest.totalMarks}</span></p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Leaderboard Rank</p>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-1"># {cbtReport.rank || 1}</p>
                </div>
              </div>

              {/* Subject scores */}
              <div className="space-y-2.5 text-left bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Performance</h5>
                {Object.entries(cbtReport.subjectAnalysis).map(([sub, score]) => (
                  <div key={sub} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">{sub}</span>
                    <span className={`font-bold ${score >= 4 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-slate-200'}`}>
                      {score} Marks
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setCbtActiveTest(null)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-95 transition-all text-sm"
              >
                Return to Student Portal
              </button>
            </div>
          </div>
        ) : (
          /* CBT Active Question Panels */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Question Box */}
            <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 overflow-y-auto">
              <div className="space-y-6 text-left">
                {/* Question Details header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wide">
                    Question {cbtCurrentIdx + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Marks: +{currentQ.marks} | -1 Wrong Option
                  </span>
                </div>

                {/* Question Subject badge */}
                <span className="inline-block px-2.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-extrabold rounded-md uppercase">
                  {currentQ.subject}
                </span>

                {/* Question Text */}
                <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-100">
                  {currentQ.question}
                </p>

                {/* Options list */}
                <div className="space-y-3.5 pt-4">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = cbtAnswers[currentQ.id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleCbtSelectOption(currentQ.id, oIdx)}
                        className={`w-full p-4 text-left text-sm rounded-xl border transition-all flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/20' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-extrabold ${
                          isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-700 bg-slate-950 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Actions */}
              <div className="flex justify-between items-center pt-8 border-t border-slate-900 mt-6">
                <button
                  disabled={cbtCurrentIdx === 0}
                  onClick={() => setCbtCurrentIdx(prev => prev - 1)}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 disabled:opacity-30 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCbtAnswers(prev => {
                        const copy = { ...prev };
                        delete copy[currentQ.id];
                        return copy;
                      });
                    }}
                    className="px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all"
                  >
                    Clear Response
                  </button>
                </div>

                <button
                  disabled={cbtCurrentIdx === questions.length - 1}
                  onClick={() => setCbtCurrentIdx(prev => prev + 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Navigator Grid */}
            <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6 text-left">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Question Navigation</h4>
                
                {/* Question selection grid */}
                <div className="grid grid-cols-4 gap-2.5">
                  {questions.map((q, idx) => {
                    const answered = cbtAnswers[q.id] !== undefined;
                    const active = cbtCurrentIdx === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCbtCurrentIdx(idx)}
                        className={`h-10 rounded-lg text-xs font-bold transition-all border flex items-center justify-center ${
                          active 
                            ? 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-500/20 shadow-md shadow-blue-600/10' 
                            : (answered 
                                ? 'bg-emerald-600/25 border-emerald-500/50 text-emerald-400' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700')
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legends instructions */}
              <div className="pt-6 border-t border-slate-800 space-y-2.5 text-xs text-slate-400 text-left mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-600/25 border border-emerald-500/50 rounded"></div>
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-950 border border-slate-800 rounded"></div>
                  <span>Unanswered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 border border-blue-400 rounded"></div>
                  <span>Currently Viewing</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    );
  }

  // Render Portal Core Dashboard
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen">
      
      {/* ================= PORTAL SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-6 text-left">
          {/* Header Brand */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-outfit)' }}>
              DEV CLASSES
            </span>
            <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold rounded text-blue-400">
              PORTAL
            </span>
          </div>

          {/* Student Profile Quick View */}
          <div className="flex items-center gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600/15 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
              {student.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{student.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">{student.studentProfile?.studentIdCard}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Overview Dashboard
            </button>
            
            <button 
              onClick={() => setActiveTab('tests')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'tests' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> CBT Test Series
            </button>

            <button 
              onClick={() => setActiveTab('notes')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'notes' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Study Materials
            </button>

            <button 
              onClick={() => setActiveTab('doubts')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'doubts' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Doubt Solver
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> My Profile
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-800/80">
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800/80 text-xs font-bold text-red-400 hover:text-red-300 rounded-lg flex items-center justify-center gap-2 border border-slate-800 transition-all"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* ================= PORTAL MAIN ================= */}
      <main className="flex-1 bg-slate-50 overflow-y-auto px-6 py-8 md:px-8 text-left">
        
        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Greeting Header */}
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Welcome back, {student.name}!
              </h2>
              <p className="text-xs text-slate-500">Track your academic progress and assignments in real-time.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid sm:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Class Attendance</p>
                  <p className="text-2xl font-extrabold text-slate-900">{attPct}% <span className="text-xs text-slate-400 font-semibold">({presentDays}/{totalDays} days)</span></p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Average Test Score</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {myResults.length > 0 
                      ? `${Math.round(myResults.reduce((acc, r) => acc + r.score, 0) / myResults.length)} pts` 
                      : '0 pts'
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Active Doubts</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {doubts.filter(d => d.status === 'PENDING').length} <span className="text-xs text-slate-400 font-semibold">tickets</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Test Performance custom SVG Graph */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                Academic Test Performance Curve
              </h3>

              {myResults.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No tests completed yet. Take an online CBT Mock Test to view graphs.</p>
              ) : (
                <div className="space-y-4">
                  {/* Score indicators */}
                  <div className="h-48 flex items-end justify-around border-b border-slate-200 pb-2 pt-6 px-4">
                    {myResults.slice().reverse().map((r, i) => {
                      const pct = Math.min(100, Math.max(10, (r.score / r.test.totalMarks) * 100));
                      return (
                        <div key={r.id} className="flex flex-col items-center gap-2 group w-12">
                          <span className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded transition-opacity absolute mb-14 font-semibold">
                            {r.score}/{r.test.totalMarks}
                          </span>
                          <div 
                            style={{ height: `${pct}%` }} 
                            className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md hover:from-blue-500 transition-all cursor-pointer"
                          ></div>
                          <span className="text-[9px] text-slate-500 font-semibold truncate w-full text-center">
                            Test {i + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center italic">Hover over bars to view detailed score ratios</p>
                </div>
              )}
            </div>

            {/* Recent Scorecard & Active Tests Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Left Column: Recent results table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Recent Mock Exam Scores
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100">
                    <thead>
                      <tr className="text-slate-400 font-bold">
                        <th className="pb-3">Test Title</th>
                        <th className="pb-3">Score</th>
                        <th className="pb-3">AIR Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myResults.map(r => (
                        <tr key={r.id} className="text-slate-700">
                          <td className="py-3 font-semibold max-w-[200px] truncate">{r.test.title}</td>
                          <td className="py-3 font-bold">{r.score} <span className="text-[10px] text-slate-400">/ {r.test.totalMarks}</span></td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                              Rank {r.rank || 1}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {myResults.length === 0 && (
                        <tr>
                          <td colSpan="3" className="py-6 text-center text-slate-400">No mock test scores available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Active Courses / Batch details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Enrolled Course Batches
                </h3>
                <div className="space-y-4">
                  {student.studentProfile?.courses?.map(course => (
                    <div key={course.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 text-xs">{course.title}</h4>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                          {course.targetExam}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{course.description}</p>
                      <div className="flex gap-4 text-[10px] text-slate-500 font-medium pt-1">
                        <span>Duration: {course.duration}</span>
                        <span>Time: {course.timings}</span>
                      </div>
                    </div>
                  ))}
                  {(!student.studentProfile?.courses || student.studentProfile.courses.length === 0) && (
                    <p className="text-xs text-slate-400 py-6 text-center">No courses connected yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: CBT TESTS */}
        {activeTab === 'tests' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Online CBT Mock Exams
              </h2>
              <p className="text-xs text-slate-500">Take examinations in actual mock patterns to prepare for national competition levels.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tests.map(test => {
                const completed = myResults.find(r => r.testId === test.id);
                return (
                  <div key={test.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 text-left flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          {test.examType} Pattern
                        </span>
                        {completed ? (
                          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-orange-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 animate-pulse" /> Active Test
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {test.title}
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div>
                          <strong>Duration:</strong> {test.durationMinutes} mins
                        </div>
                        <div>
                          <strong>Total Marks:</strong> {test.totalMarks} pts
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-50">
                      {completed ? (
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-slate-500">
                            Score: <strong className="text-slate-800">{completed.score} / {test.totalMarks}</strong>
                          </div>
                          <button 
                            disabled 
                            className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed"
                          >
                            Submitted
                          </button>
                        </div>
                      ) : (
                        test.isPremium || settings?.test_series_premium === 'true' ? (
                          <button
                            disabled
                            className="w-full py-2 bg-orange-100 text-orange-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed"
                          >
                            <Lock className="w-3.5 h-3.5" /> Premium Content
                          </button>
                        ) : (
                          <button
                            onClick={() => startMockTest(test)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" /> Start Mock Test (CBT)
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
              {tests.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center col-span-2">No mock tests available currently.</p>
              )}
            </div>
          </div>
        )}

        {/* VIEW: STUDY MATERIALS */}
        {activeTab === 'notes' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Study Materials & Notes
              </h2>
              <p className="text-xs text-slate-500">Access and download your worksheets, DPPs, and chapter-wise class lecture notes.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(mat => (
                <div key={mat.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-left flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                        {mat.subject}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{mat.category}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{mat.title}</h4>
                    <p className="text-xs text-slate-500">Chapter: {mat.chapter}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    {mat.isPremium || settings?.test_series_premium === 'true' ? (
                      <>
                        <span className="text-xs text-orange-500 font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Premium Locked
                        </span>
                        <button disabled className="px-3.5 py-1.5 bg-slate-200 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Full Access
                        </span>
                        <a 
                          href={mat.fileUrl} target="_blank" rel="noreferrer"
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DOUBT SOLVER */}
        {activeTab === 'doubts' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Doubt Solving Portal
              </h2>
              <p className="text-xs text-slate-500">Submit your queries directly to faculties and review historical resolutions.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Doubt list Left */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Your Submitted Doubts</h3>
                
                {doubts.map(doubt => (
                  <div key={doubt.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {doubt.subject}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        doubt.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {doubt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      Q: {doubt.questionText}
                    </p>

                    {doubt.status === 'RESOLVED' ? (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                            {doubt.faculty?.name.charAt(0) || 'F'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">Faculty Response ({doubt.faculty?.name})</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          "{doubt.responseText}"
                        </p>
                        {doubt.responseFileUrl && (
                          <a href={doubt.responseFileUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg hover:bg-emerald-200">
                            Download Attached Solution
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">Faculty response pending (average reply time: 4 hours)</p>
                    )}
                  </div>
                ))}

                {doubts.length === 0 && (
                  <p className="text-xs text-slate-400 py-12 bg-white rounded-2xl border border-slate-200/80 text-center">No doubts submitted yet.</p>
                )}
              </div>

              {/* Submit Form Right */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-left space-y-5">
                <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Submit a New Doubt
                </h3>

                {doubtSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Doubt submitted successfully!</span>
                  </div>
                )}

                <form onSubmit={handleDoubtSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                    <select
                      value={doubtForm.subject}
                      onChange={e => setDoubtForm({ ...doubtForm, subject: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-xs outline-none"
                    >
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                      <option>Biology</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Doubt Query Text</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Describe your doubt here..."
                      value={doubtForm.questionText}
                      onChange={e => setDoubtForm({ ...doubtForm, questionText: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-xs outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Attach Doubt Image (Optional)</label>
                    <input
                      type="file"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            const res = await api.uploadFile(e.target.files[0], false);
                            setDoubtForm({ ...doubtForm, imageUrl: res.fileUrl });
                          } catch (err) {
                            alert('Failed to upload image');
                          }
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-xs outline-none"
                    />
                    {doubtForm.imageUrl && <span className="text-[10px] text-emerald-600 font-bold">Image Uploaded Successfully!</span>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Doubt Ticket
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 p-8 rounded-3xl space-y-6 shadow-sm animate-fade-in">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center">
                {student.name.charAt(0)}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {student.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Enrolled Student Profile</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Student Card ID</p>
                <p className="text-sm font-semibold text-slate-800">{student.studentProfile?.studentIdCard}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Registered Email</p>
                <p className="text-sm font-semibold text-slate-800">{student.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</p>
                <p className="text-sm font-semibold text-slate-800">{student.studentProfile?.mobile}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp Contact</p>
                <p className="text-sm font-semibold text-slate-800">{student.studentProfile?.whatsapp || student.studentProfile?.mobile}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Father's Name</p>
                <p className="text-sm font-semibold text-slate-800">{student.studentProfile?.fatherName || 'Not Registered'}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Permanent Address</p>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">{student.studentProfile?.address || 'Not Registered'}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Account active since: {new Date(student.studentProfile?.createdAt || Date.now()).toLocaleDateString()}</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Checked & Approved</span>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
