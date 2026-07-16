// Test script to verify JWT authentication flow
// Run this in browser console after logging in

console.log('=== JWT Authentication Flow Test ===\n');

// 1. Check if token exists in localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('1. LocalStorage Check:');
console.log('   Token exists:', !!token);
console.log('   User data exists:', !!user);

if (token) {
  console.log('   Token preview:', token.substring(0, 20) + '...');
}
if (user) {
  const userData = JSON.parse(user);
  console.log('   User role:', userData.role);
  console.log('   User email:', userData.email);
}
// 2. Test protected API call
console.log('\n2. Testing Protected API Call (/api/auth/me):');
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('   Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('   Response data:', data);
})
.catch(error => {
  console.error('   Error:', error);
});

// 3. Verify current URL
console.log('\n3. Current URL:', window.location.href);
console.log('   Expected port: 5174');
console.log('   Actual port:', window.location.port);

console.log('\n=== Test Complete ===');