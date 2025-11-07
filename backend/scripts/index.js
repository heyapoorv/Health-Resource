const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const db = mongoose.connection.db;

    console.log("✅ Connected to DB. Creating indexes...");

    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('appointments').createIndex({ user_id: 1, status: 1 });
    await db.collection('medicine_requests').createIndex({ user_id: 1 });
    await db.collection('locations').createIndex({ service_id: 1 });

    console.log("✅ Indexes created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating indexes:", err);
    process.exit(1);
  }
})();
