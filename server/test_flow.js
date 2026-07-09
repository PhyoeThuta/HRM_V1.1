import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // bypass nginx for local test
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

async function test() {
  try {
    console.log('1. Logging in...');
    const loginRes = await api.post('/auth/login', {
      username: 'successor_001',
      password: 'password123' // fallback/default if possible?
    });
    console.log('Login successful!', loginRes.data);
    
    // Set token
    const token = loginRes.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    console.log('2. Fetching dashboard...');
    const dashRes = await api.get('/dashboard');
    console.log('Dashboard successful!');
  } catch (err) {
    console.error('Error:', err.response?.status, err.response?.data);
  }
}
test();
