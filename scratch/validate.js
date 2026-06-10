const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function makeRequest(url, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: json });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('STARTING INTEGRATION & API VALIDATION TESTS...');
  console.log('==================================================\n');

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  try {
    // Test 1: Get CMS Settings
    console.log('Testing CMS Settings GET...');
    const settingsRes = await makeRequest(`${BASE_URL}/cms/settings`);
    assert(settingsRes.statusCode === 200, 'CMS Settings responds with status 200');
    assert(settingsRes.body.hero_title !== undefined, 'CMS Settings contains hero_title');

    // Test 2: Get Courses
    console.log('\nTesting Courses GET...');
    const coursesRes = await makeRequest(`${BASE_URL}/cms/courses`);
    assert(coursesRes.statusCode === 200, 'Courses API responds with status 200');
    assert(Array.isArray(coursesRes.body), 'Courses API returns an array');
    assert(coursesRes.body.length > 0, 'Seeded courses exist in the database');

    // Test 3: Admin login
    console.log('\nTesting Admin Authentication POST...');
    const loginRes = await makeRequest(`${BASE_URL}/auth/login`, 'POST', {
      email: 'admin@devclasses.com',
      password: 'admin123'
    });
    assert(loginRes.statusCode === 200, 'Admin auth login responds with status 200');
    assert(loginRes.body.token !== undefined, 'Admin auth login returns a JWT token');
    const adminToken = loginRes.body.token;

    // Test 4: Student login
    console.log('\nTesting Student Authentication POST...');
    const studentLoginRes = await makeRequest(`${BASE_URL}/auth/login`, 'POST', {
      email: 'student@devclasses.com',
      password: 'student123'
    });
    assert(studentLoginRes.statusCode === 200, 'Student auth login responds with status 200');
    assert(studentLoginRes.body.token !== undefined, 'Student auth login returns a JWT token');

    // Test 5: Fetch profile using token
    console.log('\nTesting Profile lookup with JWT...');
    const profileRes = await makeRequest(`${BASE_URL}/auth/me`, 'GET', null, adminToken);
    assert(profileRes.statusCode === 200, 'Profile check responds with status 200');
    assert(profileRes.body.role === 'SUPER_ADMIN', 'Returned user role is SUPER_ADMIN');

    // Test 6: Announcements GET
    console.log('\nTesting Announcements GET...');
    const annRes = await makeRequest(`${BASE_URL}/announcements`);
    assert(annRes.statusCode === 200, 'Announcements responds with status 200');
    assert(Array.isArray(annRes.body), 'Announcements API returns an array');

    console.log('\n==================================================');
    console.log(`TEST RUN COMPLETED. Passed: ${passCount}, Failed: ${failCount}`);
    console.log('==================================================');

    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('\n[ERROR] Test run crashed with error:', err.message);
    process.exit(1);
  }
}

runTests();
