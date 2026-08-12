async function test() {
  try {
    // 1. Register a test user
    const email = `test${Date.now()}@test.com`;
    console.log("Registering user:", email);
    let token;
    try {
      const regRes = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email,
          password: 'Password123!'
        })
      });
      const regData = await regRes.json();
      token = regData.token;
      console.log("Registered! Token:", token);
    } catch (e) {
      console.error("Register failed:", e.message);
      return;
    }

    // 2. Hit the AI route
    console.log("Hitting AI generate outline route...");
    const aiRes = await fetch('http://localhost:8000/api/ai/generate-outline', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        topic: "A comprehensive guide for software engineers",
        style: "Professional",
        chapterCount: 5
      })
    });
    
    const aiData = await aiRes.json();
    console.log(JSON.stringify(aiData, null, 2));

  } catch (e) {
    console.error("AI Route failed:", e.message);
  }
}

test();
