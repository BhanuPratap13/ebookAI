async function test() {
  try {
    const email = `test${Date.now()}@test.com`;
    console.log("1. Registering user...");
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

    console.log("2. Generating AI Outline...");
    const aiRes = await fetch('http://localhost:8000/api/ai/generate-outline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ topic: "Test book", style: "Professional", chapterCount: 3 })
    });
    const outline = await aiRes.json();
    console.log(outline.outline ? "Outline generated!" : "Failed to generate outline", outline);

    console.log("3. Creating eBook...");
    const bookRes = await fetch('http://localhost:8000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: "Test Book Title",
        author: "Test Author",
        chapters: outline.outline || []
      })
    });
    const bookData = await bookRes.json();
    console.log(bookData.book ? "eBook created!" : "Failed to create eBook", bookData);

    if (bookData.book && bookData.book.chapters.length > 0) {
      console.log("4. Generating chapter content for chapter 1...");
      const chTitle = bookData.book.chapters[0].title;
      const chDesc = bookData.book.chapters[0].description;
      const chRes = await fetch('http://localhost:8000/api/ai/generate-chapter-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ chapterTitle: chTitle, chapterDescription: chDesc, style: "Professional" })
      });
      const chData = await chRes.json();
      console.log(chData.content ? "Chapter content generated! length: " + chData.content.length : "Failed", chData);
    }
  } catch (e) {
    console.error("E2E Test failed:", e.message);
  }
}
test();
