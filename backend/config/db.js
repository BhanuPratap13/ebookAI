const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setDefaultResultOrder?.("ipv4first");
} catch (e) {
  // Ignore
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    if (err.message && (err.message.includes("ECONNREFUSED") || err.message.includes("ETIMEOUT"))) {
      try {
        console.log("Retrying MongoDB connection with public DNS resolvers...");
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected (via DNS fallback): ${conn.connection.host}`);
        return;
      } catch (retryErr) {
        console.error("❌ Error connecting to MongoDB:", retryErr.message);
      }
    } else {
      console.error("❌ Error connecting to MongoDB:", err.message);
    }
    console.error(
      "👉 TIP: Ensure 0.0.0.0/0 (Allow Access from Anywhere) is added to your MongoDB Atlas Network Access IP Access List."
    );
  }
};

module.exports = connectDB;

