async function test() {
  try {
    const email = `test${Date.now()}@test.com`;
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
    const token = regData.token;

    console.log("Hitting GET /api/books...");
    const booksRes = await fetch('http://localhost:8000/api/books', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      }
    });
    
    console.log("Status:", booksRes.status);
    const booksData = await booksRes.text();
    console.log("Books Route output:", booksData);

  } catch (e) {
    console.error("Test failed:", e.message);
  }
}
test();
