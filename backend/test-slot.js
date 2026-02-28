const http = require('http');

// First login, then create a slot

async function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (bodyStr) {
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`\n📤 ${method} ${path}`);
    if (body) {
      console.log('Body:', JSON.stringify(body, null, 2));
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n📥 Response: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log(JSON.stringify(json, null, 2));
          resolve({ status: res.statusCode, data: json });
        } catch {
          console.log(data);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error:', error);
      reject(error);
    });

    if (bodyStr) {
      req.write(bodyStr);
    }
    req.end();
  });
}

async function test() {
  try {
    // 1. Login
    console.log('🔐 Logging in...');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'guru@example.com',
      password: 'password123',
    });

    if (loginRes.status !== 200) {
      console.log('❌ Login failed');
      process.exit(1);
    }

    const token = loginRes.data.data.token;
    console.log('✅ Login successful, token:', token.substring(0, 50) + '...');

    // 2. Create slot
    console.log('\n\n🎯 Creating slot...');
    const slotRes = await makeRequest(
      'POST',
      '/api/slots',
      {
        fromDate: '2026-01-23',
        toDate: '2026-01-31',
        state: 'Madhya Pradesh',
        district: 'Datia',
        availableGranths: ['Mahabharat', 'Brahma Puran', 'Skanda Puran'],
      },
      token
    );

    if (slotRes.status === 201) {
      console.log('✅ Slot created successfully!');
    } else {
      console.log('❌ Slot creation failed');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

test();
