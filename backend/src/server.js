require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole, JWT_SECRET } = require('./middleware/auth');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Auto-create uploads folder
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any Vercel deployment (*.vercel.app)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(uploadDir));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'DEV CLASSES API' });
});

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDFs, images, Word and PowerPoint files are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});


// Helper to log user activities
async function logActivity(userId, action, req) {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    await prisma.userLog.create({
      data: {
        userId,
        action,
        ipAddress,
      }
    });
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

// ==========================================
// 1. AUTHENTICATION API
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentId: user.studentProfile ? user.studentProfile.id : null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logActivity(user.id, 'Logged in', req);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentProfile: user.studentProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        studentProfile: {
          include: {
            courses: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentProfile: user.studentProfile
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/register-student (Public online registration)
app.post('/api/auth/register-student', async (req, res) => {
  const { studentName, fatherName, mobile, whatsapp, email, address, courseName } = req.body;
  if (!studentName || !fatherName || !mobile || !email || !address || !courseName) {
    return res.status(400).json({ error: 'Missing required registration details' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const reg = await prisma.registration.create({
      data: {
        studentName,
        fatherName,
        mobile,
        whatsapp,
        email,
        address,
        courseName,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      message: 'Registration submitted successfully. Pending Admin Approval.',
      registration: reg
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to submit registration' });
  }
});

// GET /api/auth/logs (Admin only)
app.get('/api/auth/logs', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const logs = await prisma.userLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: { user: { select: { name: true, email: true, role: true } } }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// ==========================================
// 2. WEBSITE CMS SETTINGS API
// ==========================================

// GET /api/cms/settings (Public)
app.get('/api/cms/settings', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load website settings' });
  }
});

// PUT /api/cms/settings (Admin / Content Manager)
app.put('/api/cms/settings', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const settingsData = req.body; // Key-value object
  try {
    for (const [key, value] of Object.entries(settingsData)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }
    await logActivity(req.user.id, 'Updated CMS Website Settings', req);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update website settings' });
  }
});

// ==========================================
// 3. COURSES CMS API
// ==========================================

// GET /api/cms/courses (Public)
app.get('/api/cms/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
});

// POST /api/cms/courses (Admin only)
app.post('/api/cms/courses', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  const { title, description, duration, fee, timings, targetExam, features } = req.body;
  if (!title || !duration || fee === undefined || !targetExam) {
    return res.status(400).json({ error: 'Missing required course fields' });
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description: description || '',
        duration,
        fee: parseFloat(fee),
        timings: timings || '',
        targetExam,
        features: features || '',
      }
    });
    await logActivity(req.user.id, `Created course: ${title}`, req);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT /api/cms/courses/:id (Admin only)
app.put('/api/cms/courses/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  const { title, description, duration, fee, timings, targetExam, features, active } = req.body;
  try {
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        duration,
        fee: fee !== undefined ? parseFloat(fee) : undefined,
        timings,
        targetExam,
        features,
        active
      }
    });
    await logActivity(req.user.id, `Updated course: ${title}`, req);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/cms/courses/:id (Admin only)
app.delete('/api/cms/courses/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.course.delete({ where: { id } });
    await logActivity(req.user.id, `Deleted course ID: ${id}`, req);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ==========================================
// 4. TOPPERS CMS API
// ==========================================

app.get('/api/cms/toppers', async (req, res) => {
  try {
    const toppers = await prisma.topper.findMany({ orderBy: { air: 'asc' } });
    res.json(toppers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load toppers' });
  }
});

app.post('/api/cms/toppers', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { name, exam, year, air, marks, photoUrl, testimonial } = req.body;
  try {
    const topper = await prisma.topper.create({
      data: { name, exam, year: parseInt(year), air: parseInt(air), marks, photoUrl, testimonial }
    });
    res.status(201).json(topper);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add topper' });
  }
});

app.delete('/api/cms/toppers/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    await prisma.topper.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Topper deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topper' });
  }
});

// ==========================================
// 5. GALLERY CMS API
// ==========================================

app.get('/api/cms/gallery', async (req, res) => {
  try {
    const gallery = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load gallery' });
  }
});

app.post('/api/cms/gallery', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { title, imageUrl, category } = req.body;
  try {
    const item = await prisma.gallery.create({
      data: { title, imageUrl, category }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload gallery item' });
  }
});

app.delete('/api/cms/gallery/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    await prisma.gallery.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// ==========================================
// 6. STUDY MATERIAL & PYQ API
// ==========================================

// GET /api/study/materials (Public with filters, premium flag determines access)
app.get('/api/study/materials', async (req, res) => {
  try {
    const materials = await prisma.studyMaterial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve study materials' });
  }
});

app.post('/api/study/materials', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { title, subject, chapter, fileUrl, isPremium, category, downloadsEnabled } = req.body;
  try {
    const material = await prisma.studyMaterial.create({
      data: {
        title,
        subject,
        chapter,
        fileUrl,
        isPremium: Boolean(isPremium),
        category: category || 'NOTES',
        downloadsEnabled: downloadsEnabled !== undefined ? Boolean(downloadsEnabled) : true
      }
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add study material' });
  }
});

app.delete('/api/study/materials/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  try {
    await prisma.studyMaterial.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete study material' });
  }
});

// PYQs
app.get('/api/study/pyqs', async (req, res) => {
  try {
    const pyqs = await prisma.pYQ.findMany({ orderBy: { year: 'desc' } });
    res.json(pyqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve PYQs' });
  }
});

app.post('/api/study/pyqs', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { exam, year, subject, chapter, fileUrl, solutionUrl } = req.body;
  try {
    const pyq = await prisma.pYQ.create({
      data: { exam, year: parseInt(year), subject, chapter: chapter || 'General', fileUrl, solutionUrl }
    });
    res.status(201).json(pyq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add PYQ' });
  }
});

app.delete('/api/study/pyqs/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    await prisma.pYQ.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'PYQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete PYQ' });
  }
});

// ==========================================
// 7. CRM ENQUIRY MANAGEMENT API
// ==========================================

// POST /api/enquiries (Public enquiry form)
app.post('/api/enquiries', async (req, res) => {
  const { studentName, className, mobile, email, courseInterested, message } = req.body;
  if (!studentName || !className || !mobile || !email || !courseInterested) {
    return res.status(400).json({ error: 'Missing required enquiry details' });
  }
  try {
    const enq = await prisma.enquiry.create({
      data: { studentName, className, mobile, email, courseInterested, message }
    });
    res.status(201).json({ message: 'Enquiry submitted. A counselor will contact you shortly.', enquiry: enq });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
});

// GET /api/enquiries (Admin & Counselor)
app.get('/api/enquiries', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'COUNSELOR']), async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load enquiries' });
  }
});

// PUT /api/enquiries/:id (Status updates & Counselor Assignment)
app.put('/api/enquiries/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'COUNSELOR']), async (req, res) => {
  const { status, counselorId, counselorName } = req.body;
  try {
    const enq = await prisma.enquiry.update({
      where: { id: parseInt(req.params.id) },
      data: { status, counselorId, counselorName }
    });
    res.json(enq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// ==========================================
// 8. ONLINE REGISTRATION MANAGEMENT API
// ==========================================

// GET /api/registrations (Admin / Counselor)
app.get('/api/registrations', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'COUNSELOR']), async (req, res) => {
  try {
    const list = await prisma.registration.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load registrations' });
  }
});

// POST /api/registrations/:id/approve (Creates User and Student Profile)
app.post('/api/registrations/:id/approve', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  const regId = parseInt(req.params.id);
  try {
    const reg = await prisma.registration.findUnique({ where: { id: regId } });
    if (!reg) return res.status(404).json({ error: 'Registration not found' });
    if (reg.status !== 'PENDING') return res.status(400).json({ error: 'Registration already processed' });

    // 1. Create secure default password based on mobile
    const passwordHash = await bcrypt.hash(reg.mobile, 10);

    // 2. Create Student User account
    const user = await prisma.user.create({
      data: {
        email: reg.email,
        name: reg.studentName,
        password: passwordHash,
        role: 'STUDENT'
      }
    });

    // 3. Generate sequential Card ID
    const studentCount = await prisma.student.count();
    const studentCardId = `DEV-${new Date().getFullYear()}-${String(studentCount + 1).padStart(4, '0')}`;

    // 4. Create Student Profile
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        fatherName: reg.fatherName,
        mobile: reg.mobile,
        whatsapp: reg.whatsapp || reg.mobile,
        address: reg.address,
        admissionStatus: 'APPROVED',
        studentIdCard: studentCardId
      }
    });

    // 5. Connect to Course if exists
    const course = await prisma.course.findFirst({
      where: { title: { contains: reg.courseName } }
    });
    if (course) {
      await prisma.student.update({
        where: { id: student.id },
        data: { courses: { connect: [{ id: course.id }] } }
      });
    }

    // 6. Update registration entry
    await prisma.registration.update({
      where: { id: regId },
      data: { status: 'APPROVED' }
    });

    await logActivity(req.user.id, `Approved admission for ${reg.studentName}. Created ID: ${studentCardId}`, req);

    res.json({ message: 'Admission approved successfully.', studentCardId });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Admission approval failed' });
  }
});

// POST /api/registrations/:id/reject
app.post('/api/registrations/:id/reject', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const reg = await prisma.registration.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'REJECTED' }
    });
    res.json({ message: 'Registration rejected', reg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject registration' });
  }
});

// ==========================================
// 9. STUDENT & ATTENDANCE MANAGEMENT API
// ==========================================

// GET /api/students (Admin / Faculty)
app.get('/api/students', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'FACULTY', 'COUNSELOR']), async (req, res) => {
  try {
    const list = await prisma.student.findMany({
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        courses: { select: { title: true } },
        attendance: true,
        testResults: true
      }
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students list' });
  }
});

// PUT /api/students/:id/credentials (Admin only - update student login)
app.put('/api/students/:id/credentials', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await prisma.student.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    let updateData = {};
    if (email) updateData.email = email;
    if (password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    await prisma.user.update({ where: { id: student.userId }, data: updateData });
    res.json({ message: 'Student credentials updated successfully' });
  } catch (error) {
    console.error('Update student credentials error:', error);
    res.status(500).json({ error: 'Failed to update student credentials' });
  }
});

// POST /api/students/attendance (Batch logging)
app.post('/api/students/attendance', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'FACULTY']), async (req, res) => {
  const { date, attendanceList } = req.body; // Array: [{ studentId: 1, status: 'PRESENT' }]
  if (!date || !attendanceList) return res.status(400).json({ error: 'Missing parameters' });

  try {
    const parsedDate = new Date(date);
    // StartOfDay to reset time
    parsedDate.setHours(0,0,0,0);

    for (const record of attendanceList) {
      // Check if attendance already logged for this date
      const existing = await prisma.attendance.findFirst({
        where: {
          studentId: parseInt(record.studentId),
          date: {
            gte: parsedDate,
            lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      if (existing) {
        await prisma.attendance.update({
          where: { id: existing.id },
          data: { status: record.status }
        });
      } else {
        await prisma.attendance.create({
          data: {
            studentId: parseInt(record.studentId),
            date: parsedDate,
            status: record.status
          }
        });
      }
    }

    res.json({ message: 'Attendance registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log attendance' });
  }
});

// GET /api/students/attendance/my (Current Student)
app.get('/api/students/attendance/my', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: req.user.studentId },
      orderBy: { date: 'desc' }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load attendance logs' });
  }
});

// ==========================================
// 10. TEST SERIES MANAGEMENT & CBT ENGINE API
// ==========================================

// GET /api/tests (All active test templates)
app.get('/api/tests', authenticateToken, async (req, res) => {
  try {
    const tests = await prisma.testSeries.findMany({
      where: { active: true },
      orderBy: { scheduledDate: 'desc' }
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load tests' });
  }
});

// POST /api/tests (Admin / Faculty)
app.post('/api/tests', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'FACULTY']), async (req, res) => {
  const { title, examType, durationMinutes, totalMarks, questions, scheduledDate, isPremium } = req.body;
  try {
    const test = await prisma.testSeries.create({
      data: {
        title,
        examType,
        durationMinutes: parseInt(durationMinutes),
        totalMarks: parseInt(totalMarks),
        questionsJson: JSON.stringify(questions),
        scheduledDate: new Date(scheduledDate),
        isPremium: Boolean(isPremium)
      }
    });
    res.status(201).json(test);
  } catch (error) {
    console.error('Test creation error:', error);
    res.status(500).json({ error: 'Failed to create mock test' });
  }
});

// POST /api/tests/:id/submit (Student CBT test submission)
app.post('/api/tests/:id/submit', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  const testId = parseInt(req.params.id);
  const { answers } = req.body; // Map: { questionId: selectedIndex }

  try {
    const test = await prisma.testSeries.findUnique({ where: { id: testId } });
    if (!test) return res.status(404).json({ error: 'Test not found' });

    // Calculate score
    const questions = JSON.parse(test.questionsJson);
    let score = 0;
    const subjectAnalysis = {};

    questions.forEach(q => {
      const selectedOption = answers[q.id];
      const isCorrect = selectedOption !== undefined && parseInt(selectedOption) === q.correctAnswer;
      const points = isCorrect ? q.marks : (selectedOption !== undefined ? -1 : 0); // negative marking for wrong answers
      score += points;

      if (!subjectAnalysis[q.subject]) subjectAnalysis[q.subject] = 0;
      if (isCorrect) subjectAnalysis[q.subject] += q.marks;
      else if (selectedOption !== undefined) subjectAnalysis[q.subject] -= 1;
    });

    // Save test result
    const result = await prisma.testResult.create({
      data: {
        studentId: req.user.studentId,
        testId: testId,
        score: parseFloat(score),
        answersJson: JSON.stringify(answers),
        subjectAnalysisJson: JSON.stringify(subjectAnalysis)
      }
    });

    // Auto calculate ranks for this test
    const allResults = await prisma.testResult.findMany({
      where: { testId },
      orderBy: { score: 'desc' }
    });

    for (let index = 0; index < allResults.length; index++) {
      await prisma.testResult.update({
        where: { id: allResults[index].id },
        data: { rank: index + 1 }
      });
    }

    res.json({
      message: 'Test submitted successfully',
      score,
      rank: allResults.findIndex(r => r.id === result.id) + 1,
      subjectAnalysis
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

// GET /api/tests/student-results (Fetch logged-in student results)
app.get('/api/tests/student-results', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const results = await prisma.testResult.findMany({
      where: { studentId: req.user.studentId },
      include: { test: { select: { title: true, totalMarks: true, examType: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

// GET /api/tests/leaderboard/:testId (Get rank list)
app.get('/api/tests/leaderboard/:testId', authenticateToken, async (req, res) => {
  try {
    const list = await prisma.testResult.findMany({
      where: { testId: parseInt(req.params.testId) },
      include: { student: { include: { user: { select: { name: true } } } } },
      orderBy: { score: 'desc' }
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// ==========================================
// 11. DOUBT CLEARING TICKETS API
// ==========================================

app.post('/api/doubts', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  const { subject, questionText, imageUrl } = req.body;
  if (!subject || !questionText) return res.status(400).json({ error: 'Missing parameters' });
  try {
    const ticket = await prisma.doubt.create({
      data: {
        studentId: req.user.id,
        subject,
        questionText,
        imageUrl: imageUrl || '',
        status: 'PENDING'
      }
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create doubt' });
  }
});

app.get('/api/doubts', authenticateToken, async (req, res) => {
  try {
    let doubts;
    if (req.user.role === 'STUDENT') {
      doubts = await prisma.doubt.findMany({
        where: { studentId: req.user.id },
        include: { faculty: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Faculty/Admin see all
      doubts = await prisma.doubt.findMany({
        include: {
          student: { select: { name: true } },
          faculty: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve doubts' });
  }
});

app.put('/api/doubts/:id/resolve', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'FACULTY']), async (req, res) => {
  const { responseText, responseFileUrl } = req.body;
  if (!responseText && !responseFileUrl) return res.status(400).json({ error: 'Response content missing' });
  try {
    const doubt = await prisma.doubt.update({
      where: { id: parseInt(req.params.id) },
      data: {
        responseText: responseText || '',
        responseFileUrl: responseFileUrl || null,
        status: 'RESOLVED',
        facultyId: req.user.id
      }
    });
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit doubt resolution' });
  }
});

// ==========================================
// 12. ANNOUNCEMENTS API
// ==========================================

app.get('/api/announcements', async (req, res) => {
  try {
    const list = await prisma.announcement.findMany({
      where: { published: true, NOT: { category: 'TICKER' } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load announcements' });
  }
});

// Ticker notifications (scrolling marquee items)
app.get('/api/announcements/ticker', async (req, res) => {
  try {
    const list = await prisma.announcement.findMany({
      where: { published: true, category: 'TICKER' },
      orderBy: { createdAt: 'desc' }
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load ticker' });
  }
});

// Admin: get all announcements (including ticker)
app.get('/api/announcements/all', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  try {
    const list = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load all announcements' });
  }
});

app.post('/api/announcements', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const note = await prisma.announcement.create({
      data: { title, content, category: category || 'NOTICE' }
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post announcement' });
  }
});

app.put('/api/announcements/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { title, content, category, published } = req.body;
  try {
    const note = await prisma.announcement.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, category, published: published !== undefined ? Boolean(published) : true }
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

app.delete('/api/announcements/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// ==========================================
// 13. YOUTUBE VIDEO LECTURES API
// ==========================================

app.get('/api/youtube', async (req, res) => {
  try {
    const videos = await prisma.youtubeVideo.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lectures' });
  }
});

app.post('/api/youtube', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { title, videoId, playlist, category, featured } = req.body;
  try {
    const video = await prisma.youtubeVideo.create({
      data: { title, videoId, playlist, category: category || 'General', featured: Boolean(featured) }
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add YouTube video' });
  }
});

app.put('/api/youtube/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  const { title, videoId, playlist, category, featured } = req.body;
  try {
    const video = await prisma.youtubeVideo.update({
      where: { id: parseInt(req.params.id) },
      data: { title, videoId, playlist, category, featured: Boolean(featured) }
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video' });
  }
});

app.delete('/api/youtube/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), async (req, res) => {
  try {
    await prisma.youtubeVideo.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});


// ==========================================
// 14. SUBSCRIPTION PLANS API
// ==========================================

app.get('/api/subscriptions', async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ where: { active: true } });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load plans' });
  }
});

app.post('/api/subscriptions', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  const { name, price, features } = req.body;
  try {
    const plan = await prisma.subscriptionPlan.create({
      data: { name, price: parseFloat(price), featuresJson: JSON.stringify(features) }
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add subscription plan' });
  }
});

// ==========================================
// 15. FILE UPLOAD CONTROLLER
// ==========================================
app.post('/api/upload', authenticateToken, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Multer error (file size, file type, etc.)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select a file.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl, filename: req.file.filename, originalname: req.file.originalname });
  });
});


// ==========================================
// 16. ANALYTICS OVERVIEW API (Admin Dashboard)
// ==========================================
app.get('/api/analytics/overview', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'COUNSELOR', 'CONTENT_MANAGER']), async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalRegistrations = await prisma.registration.count();
    const totalEnquiries = await prisma.enquiry.count();
    const totalCourses = await prisma.course.count();
    const totalMaterials = await prisma.studyMaterial.count();

    // Sum of course fees as mock revenue
    const studentList = await prisma.student.findMany({ include: { courses: true } });
    let totalRevenue = 0;
    studentList.forEach(s => {
      s.courses.forEach(c => {
        totalRevenue += c.fee;
      });
    });

    const recentEnquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const recentRegistrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      metrics: {
        totalStudents,
        totalRegistrations,
        totalEnquiries,
        totalCourses,
        totalMaterials,
        totalRevenue
      },
      recentEnquiries,
      recentRegistrations
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to load analytics overview' });
  }
});

// Start Express Application
app.listen(PORT, async () => {
  console.log(`DEV CLASSES ERP Server running on http://localhost:${PORT}`);
  
  // Auto-seed SUPER_ADMIN on every startup (creates if missing, updates password if exists)
  try {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('Mukesh@devclasses', 10);
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    
    if (existingAdmin) {
      // Update the password to ensure it's always correct
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { password: hash }
      });
      console.log('✅ Super Admin password synced: Mukesh@devclasses');
    } else {
      // Create fresh admin user if production DB is empty
      await prisma.user.create({
        data: {
          email: 'admin@devclasses.com',
          name: 'Mukesh Gurjar',
          password: hash,
          role: 'SUPER_ADMIN',
        }
      });
      console.log('✅ Super Admin created: admin@devclasses.com / Mukesh@devclasses');
    }
  } catch (e) {
    console.error('Error seeding admin on startup:', e);
  }
});

