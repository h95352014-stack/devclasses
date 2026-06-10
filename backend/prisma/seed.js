const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.userLog.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.testResult.deleteMany({});
  await prisma.doubt.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.studyMaterial.deleteMany({});
  await prisma.pYQ.deleteMany({});
  await prisma.testSeries.deleteMany({});
  await prisma.topper.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.youtubeVideo.deleteMany({});
  await prisma.subscriptionPlan.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.setting.deleteMany({});

  // 2. Hash default passwords
  const adminPasswordHash = await bcrypt.hash('Mukesh@devclasses', 10);
  const facultyPasswordHash = await bcrypt.hash('faculty123', 10);
  const counselorPasswordHash = await bcrypt.hash('counselor123', 10);
  const contentPasswordHash = await bcrypt.hash('content123', 10);
  const studentPasswordHash = await bcrypt.hash('student123', 10);

  // 3. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@devclasses.com',
      password: adminPasswordHash,
      name: 'Admin Dev',
      role: 'SUPER_ADMIN',
    },
  });

  const faculty = await prisma.user.create({
    data: {
      email: 'faculty@devclasses.com',
      password: facultyPasswordHash,
      name: 'Dr. H. C. Verma',
      role: 'FACULTY',
    },
  });

  const counselor = await prisma.user.create({
    data: {
      email: 'counselor@devclasses.com',
      password: counselorPasswordHash,
      name: 'Counselor Priya',
      role: 'COUNSELOR',
    },
  });

  const contentManager = await prisma.user.create({
    data: {
      email: 'content@devclasses.com',
      password: contentPasswordHash,
      name: 'Content Manager Rahul',
      role: 'CONTENT_MANAGER',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@devclasses.com',
      password: studentPasswordHash,
      name: 'Amit Kumar',
      role: 'STUDENT',
    },
  });

  // Create Student Profile
  const studentProfile = await prisma.student.create({
    data: {
      userId: studentUser.id,
      fatherName: 'Rajesh Kumar',
      mobile: '9876543220',
      whatsapp: '9876543220',
      address: 'Sector 62, Noida, UP',
      admissionStatus: 'APPROVED',
      studentIdCard: 'DEV-2026-0001',
    },
  });

  console.log('Users and student profile created.');

  // 4. Create Courses
  const c1 = await prisma.course.create({
    data: {
      title: 'JEE Main Target Batch',
      description: 'Comprehensive preparation program focused on high scoring in JEE Main. Includes exhaustive syllabus coverage and intensive practice sessions.',
      duration: '1 Year',
      fee: 75000,
      timings: '08:00 AM - 12:00 PM (Mon-Sat)',
      targetExam: 'JEE',
      features: 'Daily Practice Problems (DPP), Weekly Part Tests, Study Materials, Doubt Clearing Sessions',
    },
  });

  const c2 = await prisma.course.create({
    data: {
      title: 'JEE Advanced Elite Batch',
      description: 'Advanced problem-solving batch designed for students aiming for top 1000 AIR. Special focus on conceptual depth and complex multi-concept questions.',
      duration: '1 Year',
      fee: 90000,
      timings: '12:30 PM - 04:30 PM (Mon-Sat)',
      targetExam: 'JEE',
      features: 'Rank Booster Test Series, Personal Mentorship by IITians, Advanced Level Assignments, Multi-Concept doubts',
    },
  });

  const c3 = await prisma.course.create({
    data: {
      title: 'NEET Target Batch',
      description: 'Complete syllabus program for NEET aspirants. Focused training in Biology, Physics, and Chemistry with regular assessment mock tests matching the latest pattern.',
      duration: '1 Year',
      fee: 85000,
      timings: '09:00 AM - 02:00 PM (Mon-Sat)',
      targetExam: 'NEET',
      features: 'NCERT Finger-Tip Physics/Chemistry, Complete Biology Flashcards, Weekly OMR Mock Tests, 1-on-1 feedback',
    },
  });

  const c4 = await prisma.course.create({
    data: {
      title: 'NEET / JEE Foundation',
      description: 'Two-year classroom program for Class 9 & 10 students. Lays strong core conceptual foundations for school and future competitive exams.',
      duration: '2 Years',
      fee: 120000,
      timings: '04:30 PM - 07:30 PM (Tue, Thu, Sat)',
      targetExam: 'FOUNDATION',
      features: 'Mental Ability Training, NTSE & Olympiad support, Core Conceptual clarity, School Exam support',
    },
  });

  // Link student profile to courses
  await prisma.student.update({
    where: { id: studentProfile.id },
    data: {
      courses: {
        connect: [{ id: c1.id }],
      },
    },
  });

  console.log('Courses created and linked to student.');

  // 5. Create Toppers
  await prisma.topper.createMany({
    data: [
      {
        name: 'Rahul Gupta',
        exam: 'JEE Advanced',
        year: 2025,
        air: 14,
        marks: '345 / 360',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
        testimonial: 'DEV CLASSES gave me the perfect atmosphere to study. The level of doubts discussed in classroom and the comprehensive test analysis helped me identify and fix my weak zones. Er. Devendra Sir provided personal guidance which was absolutely crucial for my AIR 14!',
      },
      {
        name: 'Aditi Sharma',
        exam: 'NEET UG',
        year: 2025,
        air: 42,
        marks: '710 / 720',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        testimonial: 'The biology faculty at DEV CLASSES is unmatched. Learning botany and zoology with detailed diagrams and tricks made concepts memorable. The 24/7 doubt portal helped me clear doubts immediately, ensuring I did not lag behind. Highly recommend for NEET!',
      },
      {
        name: 'Rohan Mehra',
        exam: 'JEE Main',
        year: 2025,
        air: 112,
        marks: '292 / 300',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        testimonial: 'Excellent material and test schedule! The continuous mock tests built my stamina for the 3-hour exam. Dev classes was key in my success!',
      },
    ],
  });

  console.log('Toppers created.');

  // 6. Create Mock Tests
  const questionsJEE = JSON.stringify([
    {
      id: 1,
      subject: 'Physics',
      question: 'A particle moves in a straight line with deceleration proportional to its velocity v. The distance travelled by the particle in time t is proportional to:',
      options: ['v', '1 - e^(-kt)', 'ln(v)', 't^2'],
      correctAnswer: 1,
      marks: 4,
    },
    {
      id: 2,
      subject: 'Chemistry',
      question: 'Which of the following compounds has the highest dipole moment?',
      options: ['CH3Cl', 'CH2Cl2', 'CHCl3', 'CCl4'],
      correctAnswer: 0,
      marks: 4,
    },
    {
      id: 3,
      subject: 'Mathematics',
      question: 'If log_2(x) + log_4(x) + log_16(x) = 21/4, then x is equal to:',
      options: ['8', '16', '32', '64'],
      correctAnswer: 0,
      marks: 4,
    },
  ]);

  const test1 = await prisma.testSeries.create({
    data: {
      title: 'JEE Main Full Syllabus - Mock Test 1',
      examType: 'JEE',
      durationMinutes: 180,
      totalMarks: 12,
      questionsJson: questionsJEE,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      active: true,
    },
  });

  const test2 = await prisma.testSeries.create({
    data: {
      title: 'NEET Bio-Genetics Special Quiz',
      examType: 'NEET',
      durationMinutes: 45,
      totalMarks: 12,
      questionsJson: questionsJEE, // reusing questions structure
      scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
      active: true,
    },
  });

  // Seed a result for Amit
  await prisma.testResult.create({
    data: {
      studentId: studentProfile.id,
      testId: test2.id,
      score: 8,
      rank: 3,
      answersJson: JSON.stringify({ 1: 1, 2: 1, 3: 0 }), // Q1 correct, Q2 wrong (chose 1, correct is 0), Q3 correct
      subjectAnalysisJson: JSON.stringify({ Physics: 4, Chemistry: 0, Mathematics: 4 }),
    },
  });

  console.log('Mock tests and test result created.');

  // 7. Create Study Material
  await prisma.studyMaterial.createMany({
    data: [
      {
        title: 'Electrostatics Complete Lecture Notes',
        subject: 'Physics',
        chapter: 'Electrostatics',
        fileUrl: '/uploads/electrostatics_notes.pdf',
        isPremium: false,
        downloadsEnabled: true,
        category: 'NOTES',
      },
      {
        title: 'Organic Chemistry Alkyl Halides DPP-1',
        subject: 'Chemistry',
        chapter: 'Alkyl Halides',
        fileUrl: '/uploads/chemistry_dpp1.pdf',
        isPremium: true,
        downloadsEnabled: true,
        category: 'DPP',
      },
      {
        title: 'Definite Integration Solved Assignment',
        subject: 'Mathematics',
        chapter: 'Definite Integration',
        fileUrl: '/uploads/math_integration.pdf',
        isPremium: true,
        downloadsEnabled: true,
        category: 'ASSIGNMENT',
      },
      {
        title: 'Human Physiology Part 1 Notes',
        subject: 'Biology',
        chapter: 'Human Physiology',
        fileUrl: '/uploads/biology_notes.pdf',
        isPremium: false,
        downloadsEnabled: true,
        category: 'NOTES',
      },
    ],
  });

  console.log('Study material created.');

  // 8. Create PYQs
  await prisma.pYQ.createMany({
    data: [
      {
        exam: 'JEE',
        year: 2024,
        subject: 'Physics',
        chapter: 'Kinematics',
        fileUrl: '/uploads/pyq_jee_2024_physics_kinematics.pdf',
        solutionUrl: '/uploads/pyq_jee_2024_physics_kinematics_sol.pdf',
      },
      {
        exam: 'NEET',
        year: 2023,
        subject: 'Biology',
        chapter: 'Genetics',
        fileUrl: '/uploads/pyq_neet_2023_bio_genetics.pdf',
        solutionUrl: '/uploads/pyq_neet_2023_bio_genetics_sol.pdf',
      },
      {
        exam: 'JEE',
        year: 2023,
        subject: 'Mathematics',
        chapter: 'Matrices & Determinants',
        fileUrl: '/uploads/pyq_jee_2023_maths_matrices.pdf',
      },
    ],
  });

  console.log('PYQs created.');

  // 9. Enquiries & Registrations
  await prisma.enquiry.createMany({
    data: [
      {
        studentName: 'Vikram Aditya',
        className: 'Class 12',
        mobile: '9988776655',
        email: 'vikram@example.com',
        courseInterested: 'JEE Advanced Elite Batch',
        message: 'I would like to know if there is a scholarship exam for JEE Elite Batch.',
        status: 'NEW',
      },
      {
        studentName: 'Sanya Malhotra',
        className: 'Class 11',
        mobile: '9888877777',
        email: 'sanya@example.com',
        courseInterested: 'NEET Target Batch',
        message: 'Looking for a fresh batch start date.',
        status: 'CONTACTED',
        counselorId: counselor.id,
        counselorName: counselor.name,
      },
    ],
  });

  await prisma.registration.createMany({
    data: [
      {
        studentName: 'Ramesh Verma',
        fatherName: 'Suresh Verma',
        mobile: '9777777777',
        whatsapp: '9777777777',
        email: 'ramesh@example.com',
        address: 'Uttam Nagar, New Delhi',
        courseName: 'JEE Main Target Batch',
        status: 'PENDING',
      },
    ],
  });

  console.log('Enquiries and registrations created.');

  // 10. Doubts
  await prisma.doubt.create({
    data: {
      studentId: studentUser.id,
      facultyId: faculty.id,
      subject: 'Physics',
      questionText: 'Sir, how do we determine the net electric field of an infinite sheet with a small circular hole in it? Please explain the superposition method.',
      imageUrl: '',
      responseText: 'Superposition principle states that the total field is E = E_full_sheet - E_removed_disc. For an infinite sheet, the field is sigma/(2*epsilon_0). For a disk of radius R at distance z, the field can be calculated using integration. The difference will yield the net field at the axis.',
      status: 'RESOLVED',
    },
  });

  await prisma.doubt.create({
    data: {
      studentId: studentUser.id,
      subject: 'Chemistry',
      questionText: 'Explain the mechanism of nucleophilic substitution in neopentyl halides which proceed via SN1 or SN2?',
      status: 'PENDING',
    },
  });

  console.log('Doubts created.');

  // 11. Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'New JEE & NEET Batches Commencing from 15th June',
        content: 'Registration is open for our upcoming targets batches. Special scholarship up to 50% based on admission test performance. Visit the center to enroll.',
        category: 'NOTICE',
        published: true,
      },
      {
        title: 'Syllabus Breakup and Test Schedule for June 2026',
        content: 'All enrolled students can download the detailed chapter coverage and monthly assessment test schedule from the student portal.',
        category: 'EXAM',
        published: true,
      },
      {
        title: 'Summer Vacation Notification',
        content: 'Classes will remain suspended from 20th June to 25th June. Online doubt portal and practice mocks will continue to be operational.',
        category: 'HOLIDAY',
        published: true,
      },
    ],
  });

  console.log('Announcements created.');

  // 12. YouTube Lectures
  await prisma.youtubeVideo.createMany({
    data: [
      {
        title: 'Electrostatics Lecture 1 - Coulomb Law',
        videoId: '3aD5jYpCqOk',
        playlist: 'Physics Foundation Class 12',
        category: 'Physics',
        featured: true,
      },
      {
        title: 'Organic Chemistry - Nomenclature & Basics',
        videoId: 'k_5W2mXy_pM',
        playlist: 'Chemistry Target Batch',
        category: 'Chemistry',
        featured: true,
      },
      {
        title: 'Calculus - Limits & Continuity',
        videoId: 'f_Jb27e8a94',
        playlist: 'Math Target Batch',
        category: 'Mathematics',
        featured: false,
      },
    ],
  });

  console.log('YouTube lectures created.');

  // 13. Subscription Plans
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: 'Free Starter Plan',
        price: 0,
        featuresJson: JSON.stringify([
          'Access to basic class notes (PDF)',
          'Limited subject-wise PYQ downloads',
          'Access to free public announcements and notifications',
          'Participate in monthly open mock tests'
        ]),
        active: true,
      },
      {
        name: 'Premium Study Package',
        price: 2499,
        featuresJson: JSON.stringify([
          'All Free Plan benefits included',
          'Access to advanced chapter-wise DPPs & assignments',
          'Detailed solutions for all PYQs (2018-2025)',
          'Daily practice quizzes with instant reports',
          'Priority doubt solving forum'
        ]),
        active: true,
      },
      {
        name: 'Ultimate Mock Test Series',
        price: 4999,
        featuresJson: JSON.stringify([
          'All Premium Plan benefits included',
          'Complete access to CBT Mock Test series',
          'Detailed performance analysis and rank predictor',
          'National leaderboard ranking',
          'Video solutions for difficult mock questions'
        ]),
        active: true,
      },
    ],
  });

  console.log('Subscription plans created.');

  // 14. Gallery
  await prisma.gallery.createMany({
    data: [
      {
        title: 'Toppers Celebration Event 2025',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
        category: 'CELEBRATION',
      },
      {
        title: 'Air-Conditioned Premium Classroom',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
        category: 'CLASSROOM',
      },
      {
        title: 'NEET Strategy Seminar by Er. Devendra Sir',
        imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop',
        category: 'SEMINAR',
      },
    ],
  });

  console.log('Gallery created.');

  // 15. Attendance
  const dates = [
    new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    new Date(),
  ];

  await prisma.attendance.createMany({
    data: [
      { studentId: studentProfile.id, date: dates[0], status: 'PRESENT' },
      { studentId: studentProfile.id, date: dates[1], status: 'PRESENT' },
      { studentId: studentProfile.id, date: dates[2], status: 'ABSENT' },
      { studentId: studentProfile.id, date: dates[3], status: 'PRESENT' },
      { studentId: studentProfile.id, date: dates[4], status: 'PRESENT' },
    ],
  });

  console.log('Attendance records created.');

  // 16. Dynamic Settings
  const settingsData = {
    hero_title: 'Transforming Aspirants into IITians & Future Doctors',
    hero_subtitle: 'Expert Coaching for JEE Main, JEE Advanced & NEET',
    director_name: 'Er. Devendra Kumar',
    director_qual: 'B.Tech IIT Roorkee, Ex-Allen, Ex-FIITJEE Faculty',
    director_achiev: '15+ Years Experience, Mentored over 10,000+ Students, 500+ selections in IIT & AIIMS.',
    director_bio: 'Er. Devendra Kumar is a visionary academician who has devoted the last 15 years of his life to preparing students for competitive examinations like IIT-JEE and NEET. With a deep passion for teaching physics and solving complex problems, he has mentored numerous students who went on to secure double-digit ranks in JEE and NEET. Under his direction, DEV CLASSES has built an unmatched reputation for producing top academic selections with integrity and care.',
    director_photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    director_philosophy: 'We believe in building conceptual depth over superficial formulas. The education we provide teaches kids how to analyze and solve problems from first principles. When students understand the "why" behind any concept, competitive exams become a natural byproduct of their curiosity.',
    address: 'DEV CLASSES Campus, Opp. Modern Hospital, Academic Zone, New Delhi - 110016',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43211',
    email: 'info@devclasses.com',
    youtube_link: 'https://youtube.com/c/devclasses',
    instagram_link: 'https://instagram.com/devclasses',
    seo_meta_title: 'DEV CLASSES - Premier JEE & NEET Coaching Institute',
    seo_meta_description: 'Join DEV CLASSES for JEE Main, JEE Advanced, and NEET preparations. Led by Er. Devendra Kumar (IIT Roorkee), with online mock tests, interactive doubt solving, and premium study materials.',
    seo_keywords: 'JEE Coaching, NEET Preparation, IIT JEE, Medical Entrance, Best Coaching Delhi, Er Devendra Kumar, Physics HC Verma, Mock Test Series',
    google_analytics_id: 'G-XXXXXXXXXX',
  };

  for (const [key, value] of Object.entries(settingsData)) {
    await prisma.setting.create({
      data: {
        key,
        value,
      },
    });
  }

  console.log('Dynamic Settings created.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
