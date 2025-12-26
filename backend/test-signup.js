const testSignup = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/auth/student/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Test Student",
        email: `test${Date.now()}@example.com`,
        mobile: "1234567890",
        rollNo: `123${Date.now()}`,
        division: "A",
        password: "Password123",
        confirmPassword: "Password123"
      })
    });

    const data = await response.json().catch(() => ({})); 
    console.log(`Status: ${response.status}`);
    console.log("Body:", JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
};

testSignup();
