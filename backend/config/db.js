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
    console.error("❌ Error connecting to MongoDB:", err.message);
    if (err.message.includes("whitelist") || err.message.includes("ETIMEOUT") || err.message.includes("ECONNREFUSED")) {
      console.error(
        "👉 TIP: Ensure 0.0.0.0/0 (Allow Access from Anywhere) is added to your MongoDB Atlas Network Access IP Access List."
      );
    }
  }
};

module.exports = connectDB;

