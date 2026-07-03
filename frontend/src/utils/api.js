const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

// Fallback Mock Data
const MOCK_SETTINGS = {
  logo_url: '/images/img1.jpg',
  map_link: 'https://maps.app.goo.gl/SEgkUGnxibE5i7VD7?g_st=aw',
  hero_title: 'Transforming Aspirants into IITians & Future Doctors',
  hero_subtitle: 'Expert Coaching for JEE Main, JEE Advanced & NEET',
  director_name: 'Er. Mukesh Gurjar',
  director_qual: 'Expert Faculty',
  director_bio: 'Er. Mukesh Gurjar is a visionary academician who has devoted the last 15 years of his life to preparing students for competitive examinations like IIT-JEE and NEET. Under his direction, DEV CLASSES has built an unmatched reputation for producing top academic selections with integrity and care.',
  director_photo: '/images/img2.jpg',
  director_philosophy: 'We believe in building conceptual depth over superficial formulas. The education we provide teaches kids how to analyze and solve problems from first principles.',
  address: 'DEV CLASSES Campus, Sikar',
  phone: '+91 8003953284',
  whatsapp: '+91 8003953284',
  email: 'mukeshgurjar9821@gmail.com',
  youtube_link: 'https://youtube.com/@devclassessikar?si=4z9GS1eD4_vyxHFk',
  instagram_link: 'https://www.instagram.com/dev_classes_sikar_?igsh=a2s3Nm9xZXhydGNx',
  seo_meta_title: 'DEV CLASSES - Premier JEE & NEET Coaching Institute',
  seo_meta_description: 'Join DEV CLASSES for JEE Main, JEE Advanced, and NEET preparations. Led by Er. Mukesh Gurjar (IIT Roorkee).',
  seo_keywords: 'JEE Coaching, NEET Preparation, IIT JEE, Medical Entrance, Best Coaching Delhi, Er Devendra Kumar',
  test_series_premium: 'false'
};

const MOCK_COURSES = [
  {
    id: 1,
    title: 'JEE Main Target Batch',
    description: 'Comprehensive preparation program focused on high scoring in JEE Main. Includes exhaustive syllabus coverage and intensive practice sessions.',
    duration: '1 Year',
    fee: 0,
    timings: '08:00 AM - 12:00 PM (Mon-Sat)',
    targetExam: 'JEE',
    features: 'Daily Practice Problems (DPP), Weekly Part Tests, Study Materials, Doubt Clearing Sessions',
  },
  {
    id: 2,
    title: 'JEE Advanced Elite Batch',
    description: 'Advanced problem-solving batch designed for students aiming for top 1000 AIR. Special focus on conceptual depth and complex multi-concept questions.',
    duration: '1 Year',
    fee: 0,
    timings: '12:30 PM - 04:30 PM (Mon-Sat)',
    targetExam: 'JEE',
    features: 'Rank Booster Test Series, Personal Mentorship by IITians, Advanced Level Assignments, Multi-Concept doubts',
  },
  {
    id: 3,
    title: 'NEET Target Batch',
    description: 'Complete syllabus program for NEET aspirants. Focused training in Biology, Physics, and Chemistry with regular assessment mock tests matching the latest pattern.',
    duration: '1 Year',
    fee: 0,
    timings: '09:00 AM - 02:00 PM (Mon-Sat)',
    targetExam: 'NEET',
    features: 'NCERT Finger-Tip Physics/Chemistry, Complete Biology Flashcards, Weekly OMR Mock Tests, 1-on-1 feedback',
  },
];

const MOCK_TOPPERS = [
  {
    id: 1,
    name: 'Rahul Gupta',
    exam: 'JEE Advanced',
    year: 2025,
    air: 14,
    marks: '345 / 360',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
    testimonial: 'DEV CLASSES gave me the perfect atmosphere to study. Er. Devendra Sir provided personal guidance which was absolutely crucial for my AIR 14!',
  },
  {
    id: 2,
    name: 'Aditi Sharma',
    exam: 'NEET UG',
    year: 2025,
    air: 42,
    marks: '710 / 720',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    testimonial: 'The biology faculty at DEV CLASSES is unmatched. The 24/7 doubt portal helped me clear doubts immediately, ensuring I did not lag behind.',
  }
];

const MOCK_MATERIALS = [
  { id: 1, title: 'Electrostatics Complete Lecture Notes', subject: 'Physics', chapter: 'Electrostatics', fileUrl: '#', isPremium: false, category: 'NOTES' },
  { id: 2, title: 'Organic Chemistry Alkyl Halides DPP-1', subject: 'Chemistry', chapter: 'Alkyl Halides', fileUrl: '#', isPremium: false, category: 'DPP' },
  { id: 3, title: 'Definite Integration Solved Assignment', subject: 'Mathematics', chapter: 'Definite Integration', fileUrl: '#', isPremium: false, category: 'ASSIGNMENT' }
];

const MOCK_PYQS = [
  { id: 1, exam: 'JEE', year: 2024, subject: 'Physics', chapter: 'Kinematics', fileUrl: '#' },
  { id: 2, exam: 'NEET', year: 2023, subject: 'Biology', chapter: 'Genetics', fileUrl: '#' }
];

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'New JEE & NEET Batches Commencing from 15th June', content: 'Registration is open for our upcoming targets batches. Special scholarship up to 50% based on admission test performance. Visit the center to enroll.', category: 'NOTICE' },
  { id: 2, title: 'Syllabus Breakup and Test Schedule for June 2026', content: 'All enrolled students can download the detailed chapter coverage and monthly assessment test schedule from the student portal.', category: 'EXAM' }
];

const MOCK_VIDEOS = [
  { id: 1, title: 'Electrostatics Lecture 1 - Coulomb Law', videoId: '3aD5jYpCqOk', category: 'Physics', featured: true },
  { id: 2, title: 'Organic Chemistry - Nomenclature & Basics', videoId: 'k_5W2mXy_pM', category: 'Chemistry', featured: true }
];

const MOCK_GALLERY = [
  { id: 1, title: 'Toppers Celebration Event 2025', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', category: 'CELEBRATION' },
  { id: 2, title: 'Air-Conditioned Premium Classroom', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop', category: 'CLASSROOM' }
];

const MOCK_PLANS = [
  { id: 1, name: 'Free Starter Plan', price: 0, featuresJson: '["Access to basic class notes (PDF)", "Limited subject-wise PYQ downloads", "Access to free public announcements"]' },
  { id: 2, name: 'Premium Study Package', price: 0, featuresJson: '["All Free Plan benefits included", "Access to advanced chapter-wise DPPs & assignments", "Detailed solutions for all PYQs"]' },
  { id: 3, name: 'Ultimate Mock Test Series', price: 0, featuresJson: '["All Premium Plan benefits included", "Complete access to CBT Mock Test series", "Detailed performance analysis and rank predictor"]' }
];

const MOCK_TESTS = [
  {
    id: 1,
    title: 'JEE Main Full Syllabus - Mock Test 1',
    examType: 'JEE',
    durationMinutes: 180,
    totalMarks: 12,
    questionsJson: JSON.stringify([
      { id: 1, subject: 'Physics', question: 'A particle moves in a straight line with deceleration proportional to its velocity v. The distance travelled by the particle in time t is proportional to:', options: ['v', '1 - e^(-kt)', 'ln(v)', 't^2'], correctAnswer: 1, marks: 4 },
      { id: 2, subject: 'Chemistry', question: 'Which of the following compounds has the highest dipole moment?', options: ['CH3Cl', 'CH2Cl2', 'CHCl3', 'CCl4'], correctAnswer: 0, marks: 4 },
      { id: 3, subject: 'Mathematics', question: 'If log_2(x) + log_4(x) + log_16(x) = 21/4, then x is equal to:', options: ['8', '16', '32', '64'], correctAnswer: 0, marks: 4 }
    ]),
    scheduledDate: new Date().toISOString()
  }
];

// Helper to handle tokens
function getAuthHeaders(isAdmin = false) {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem(isAdmin ? 'dev_classes_admin_token' : 'dev_classes_token') 
    : '';
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Helper to get absolute file URL resolving relative uploads
export const getFileUrl = (path) => {
  if (!path || path === '#' || path === '') return '#';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const backendHost = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backendHost}${cleanPath}`;
};


// Universal fetch wrapper
async function request(url, options = {}, isAdmin = false) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(isAdmin),
      ...(options.headers || {})
    };

    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Request failed');
    }

    return await res.json();
  } catch (error) {
    console.warn(`API Error for ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication
  async login(email, password, isAdmin = false) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }, isAdmin);
      if (typeof window !== 'undefined') {
        localStorage.setItem(isAdmin ? 'dev_classes_admin_token' : 'dev_classes_token', data.token);
      }
      return data;
    } catch (error) {
      // Fallback auth for demo
      if (email === 'admin@devclasses.com' && password === 'Mukesh@devclasses' && isAdmin) {
        const fakeData = { token: 'mock_admin_token', user: { name: 'Mukesh Gurjar', role: 'SUPER_ADMIN', email } };
        localStorage.setItem('dev_classes_admin_token', fakeData.token);
        return fakeData;
      }
      if (email === 'student@devclassessikar.com' && password === 'student123' && !isAdmin) {
        const fakeData = { token: 'mock_student_token', user: { name: 'Amit Kumar', role: 'STUDENT', email, studentProfile: { id: 1, studentIdCard: 'DEV-2026-0001', mobile: '9876543220' } } };
        localStorage.setItem('dev_classes_token', fakeData.token);
        return fakeData;
      }
      throw error;
    }
  },

  logout(isAdmin = false) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(isAdmin ? 'dev_classes_admin_token' : 'dev_classes_token');
    }
  },

  async getMe(isAdmin = false) {
    try {
      return await request('/auth/me', {}, isAdmin);
    } catch (error) {
      // Fallback me
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(isAdmin ? 'dev_classes_admin_token' : 'dev_classes_token');
        if (token === 'mock_admin_token') return { name: 'Admin Dev', role: 'SUPER_ADMIN', email: 'admin@devclassessikar.com' };
        if (token === 'mock_student_token') return { name: 'Amit Kumar', role: 'STUDENT', email: 'student@devclassessikar.com', studentProfile: { id: 1, studentIdCard: 'DEV-2026-0001', mobile: '9876543220', fatherName: 'Rajesh Kumar', address: 'Sector 62, Noida' } };
      }
      throw error;
    }
  },

  async registerStudent(formData) {
    try {
      return await request('/auth/register-student', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    } catch (error) {
      return { message: 'Demo mode: Online registration submitted (Mock approval required)' };
    }
  },

  // Website CMS Settings
  async getSettings() {
    try {
      return await request('/cms/settings');
    } catch (e) {
      return MOCK_SETTINGS;
    }
  },

  async updateSettings(settings) {
    return await request('/cms/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }, true);
  },

  // Courses
  async getCourses() {
    try {
      return await request('/cms/courses');
    } catch (e) {
      return MOCK_COURSES;
    }
  },

  async createCourse(course) {
    return await request('/cms/courses', {
      method: 'POST',
      body: JSON.stringify(course)
    }, true);
  },

  async updateCourse(id, course) {
    return await request(`/cms/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course)
    }, true);
  },

  async deleteCourse(id) {
    return await request(`/cms/courses/${id}`, {
      method: 'DELETE'
    }, true);
  },

  // Toppers
  async getToppers() {
    try {
      return await request('/cms/toppers');
    } catch (e) {
      return MOCK_TOPPERS;
    }
  },

  async createTopper(topper) {
    return await request('/cms/toppers', {
      method: 'POST',
      body: JSON.stringify(topper)
    }, true);
  },

  async deleteTopper(id) {
    return await request(`/cms/toppers/${id}`, {
      method: 'DELETE'
    }, true);
  },

  // Gallery
  async getGallery() {
    try {
      return await request('/cms/gallery');
    } catch (e) {
      return MOCK_GALLERY;
    }
  },

  async createGalleryItem(item) {
    return await request('/cms/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    }, true);
  },

  async deleteGalleryItem(id) {
    return await request(`/cms/gallery/${id}`, {
      method: 'DELETE'
    }, true);
  },

  // Study Materials
  async getMaterials() {
    try {
      return await request('/study/materials');
    } catch (e) {
      return MOCK_MATERIALS;
    }
  },

  async createMaterial(mat) {
    return await request('/study/materials', {
      method: 'POST',
      body: JSON.stringify(mat)
    }, true);
  },

  async deleteMaterial(id) {
    return await request(`/study/materials/${id}`, {
      method: 'DELETE'
    }, true);
  },

  // PYQs
  async getPyqs() {
    try {
      return await request('/study/pyqs');
    } catch (e) {
      return MOCK_PYQS;
    }
  },

  async createPyq(pyq) {
    return await request('/study/pyqs', {
      method: 'POST',
      body: JSON.stringify(pyq)
    }, true);
  },

  async deletePyq(id) {
    return await request(`/study/pyqs/${id}`, {
      method: 'DELETE'
    }, true);
  },

  // Enquiries (CRM)
  async submitEnquiry(enquiry) {
    try {
      return await request('/enquiries', {
        method: 'POST',
        body: JSON.stringify(enquiry)
      });
    } catch (e) {
      return { message: 'Demo mode: Enquiry submitted successfully!' };
    }
  },

  async getEnquiries() {
    try {
      return await request('/enquiries', {}, true);
    } catch (e) {
      return [
        { id: 1, studentName: 'Vikram Aditya', className: 'Class 12', mobile: '9988776655', email: 'vikram@example.com', courseInterested: 'JEE Advanced Elite Batch', message: 'I want to inquire about scholarship exams.', status: 'NEW', createdAt: new Date().toISOString() },
        { id: 2, studentName: 'Sanya Malhotra', className: 'Class 11', mobile: '9888877777', email: 'sanya@example.com', courseInterested: 'NEET Target Batch', message: 'Class schedule details?', status: 'CONTACTED', counselorName: 'Counselor Priya', createdAt: new Date().toISOString() }
      ];
    }
  },

  async updateEnquiryStatus(id, updateData) {
    return await request(`/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }, true);
  },

  // Online Registrations
  async getRegistrations() {
    try {
      return await request('/registrations', {}, true);
    } catch (e) {
      return [
        { id: 1, studentName: 'Ramesh Verma', fatherName: 'Suresh Verma', mobile: '9777777777', email: 'ramesh@example.com', address: 'Uttam Nagar, New Delhi', courseName: 'JEE Main Target Batch', status: 'PENDING', createdAt: new Date().toISOString() }
      ];
    }
  },

  async approveRegistration(id) {
    try {
      return await request(`/registrations/${id}/approve`, { method: 'POST' }, true);
    } catch (e) {
      return { message: 'Approved successfully (Mock)', studentCardId: `DEV-2026-0002` };
    }
  },

  async rejectRegistration(id) {
    try {
      return await request(`/registrations/${id}/reject`, { method: 'POST' }, true);
    } catch (e) {
      return { message: 'Rejected (Mock)' };
    }
  },

  // Students & Attendance
  async getStudents() {
    try {
      return await request('/students', {}, true);
    } catch (e) {
      return [
        {
          id: 1,
          user: { name: 'Amit Kumar', email: 'student@devclassessikar.com', createdAt: new Date().toISOString() },
          courses: [{ title: 'JEE Main Target Batch' }],
          attendance: [{ status: 'PRESENT', date: new Date().toISOString() }],
          testResults: [{ score: 8, createdAt: new Date().toISOString() }],
          mobile: '9876543220',
          studentIdCard: 'DEV-2026-0001'
        }
      ];
    }
  },

  async updateStudentCredentials(studentId, email, password) {
    return await request(`/students/${studentId}/credentials`, {
      method: 'PUT',
      body: JSON.stringify({ email, password })
    }, true);
  },

  async logAttendance(date, attendanceList) {
    return await request('/students/attendance', {
      method: 'POST',
      body: JSON.stringify({ date, attendanceList })
    }, true);
  },

  async getMyAttendance() {
    try {
      return await request('/students/attendance/my');
    } catch (e) {
      return [
        { status: 'PRESENT', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'PRESENT', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'ABSENT', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'PRESENT', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'PRESENT', date: new Date().toISOString() }
      ];
    }
  },

  // Test Series
  async getTests() {
    try {
      return await request('/tests');
    } catch (e) {
      return MOCK_TESTS;
    }
  },

  async createTest(test) {
    return await request('/tests', {
      method: 'POST',
      body: JSON.stringify(test)
    }, true);
  },

  async submitTest(id, answers) {
    try {
      return await request(`/tests/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers })
      });
    } catch (e) {
      // Mock grading for demo
      return {
        message: 'Mock submission complete',
        score: 8,
        rank: 1,
        subjectAnalysis: { Physics: 4, Chemistry: 0, Mathematics: 4 }
      };
    }
  },

  async getMyTestResults() {
    try {
      return await request('/tests/student-results');
    } catch (e) {
      return [
        {
          id: 1,
          score: 8,
          rank: 3,
          test: { title: 'NEET Bio-Genetics Special Quiz', totalMarks: 12, examType: 'NEET' },
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  async getTestLeaderboard(testId) {
    try {
      return await request(`/tests/leaderboard/${testId}`);
    } catch (e) {
      return [
        { score: 12, rank: 1, student: { user: { name: 'Karan Mehra' } } },
        { score: 8, rank: 2, student: { user: { name: 'Amit Kumar' } } },
        { score: 4, rank: 3, student: { user: { name: 'Shreya Roy' } } }
      ];
    }
  },

  // Doubts
  async submitDoubt(subject, questionText, imageUrl) {
    try {
      return await request('/doubts', {
        method: 'POST',
        body: JSON.stringify({ subject, questionText, imageUrl })
      });
    } catch (e) {
      return { id: 99, subject, questionText, status: 'PENDING', createdAt: new Date().toISOString() };
    }
  },

  async getDoubts(isAdmin = false) {
    try {
      return await request('/doubts', {}, isAdmin);
    } catch (e) {
      return [
        { id: 1, subject: 'Physics', questionText: 'Sir, how do we determine the net electric field of an infinite sheet with a small circular hole?', responseText: 'Superposition principle: E = E_sheet - E_removed_disk.', status: 'RESOLVED', faculty: { name: 'Dr. H. C. Verma' }, createdAt: new Date().toISOString() },
        { id: 2, subject: 'Chemistry', questionText: 'Explain the mechanism of nucleophilic substitution in neopentyl halides.', status: 'PENDING', createdAt: new Date().toISOString() }
      ];
    }
  },

  async resolveDoubt(id, responseText, responseFileUrl) {
    return await request(`/doubts/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ responseText, responseFileUrl })
    }, true);
  },

  // Announcements
  async getAnnouncements() {
    try {
      return await request('/announcements');
    } catch (e) {
      return MOCK_ANNOUNCEMENTS;
    }
  },

  async getTickerNotifications() {
    try {
      return await request('/announcements/ticker');
    } catch (e) {
      return [];
    }
  },

  async getAllAnnouncements() {
    try {
      return await request('/announcements/all', {}, true);
    } catch (e) {
      return MOCK_ANNOUNCEMENTS;
    }
  },

  async createAnnouncement(ann) {
    return await request('/announcements', {
      method: 'POST',
      body: JSON.stringify(ann)
    }, true);
  },

  async updateAnnouncement(id, data) {
    return await request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, true);
  },

  async deleteAnnouncement(id) {
    return await request(`/announcements/${id}`, { method: 'DELETE' }, true);
  },

  // Youtube Videos
  async getYoutubeVideos() {
    try {
      return await request('/youtube');
    } catch (e) {
      return MOCK_VIDEOS;
    }
  },

  async addYoutubeVideo(video) {
    return await request('/youtube', {
      method: 'POST',
      body: JSON.stringify(video)
    }, true);
  },

  async updateYoutubeVideo(id, data) {
    return await request(`/youtube/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, true);
  },

  async deleteYoutubeVideo(id) {
    return await request(`/youtube/${id}`, { method: 'DELETE' }, true);
  },



  // Subscription Plans
  async getSubscriptions() {
    try {
      return await request('/subscriptions');
    } catch (e) {
      return MOCK_PLANS;
    }
  },

  async createSubscription(sub) {
    return await request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(sub)
    }, true);
  },

  // File Upload
  async uploadFile(file, isAdmin = false) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = getAuthHeaders(isAdmin);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) {
      let errMsg = 'Upload failed';
      try {
        const errData = await res.json();
        errMsg = errData.error || errMsg;
      } catch (_) {}
      throw new Error(errMsg);
    }
    return await res.json();
  },


  // Analytics
  async getAnalyticsOverview() {
    try {
      return await request('/analytics/overview', {}, true);
    } catch (e) {
      return {
        metrics: {
          totalStudents: 1,
          totalRegistrations: 1,
          totalEnquiries: 2,
          totalCourses: 3,
          totalMaterials: 3,
          totalRevenue: 75000
        },
        recentEnquiries: [
          { id: 1, studentName: 'Vikram Aditya', className: 'Class 12', mobile: '9988776655', email: 'vikram@example.com', courseInterested: 'JEE Advanced Elite Batch', status: 'NEW', createdAt: new Date().toISOString() }
        ],
        recentRegistrations: [
          { id: 1, studentName: 'Ramesh Verma', fatherName: 'Suresh Verma', mobile: '9777777777', email: 'ramesh@example.com', address: 'Uttam Nagar, New Delhi', courseName: 'JEE Main Target Batch', status: 'PENDING', createdAt: new Date().toISOString() }
        ]
      };
    }
  }
};
