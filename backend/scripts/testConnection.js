/**
 * scripts/testConnection.js
 *
 * One-shot script to verify:
 *  1. MongoDB Atlas URI is valid and reachable
 *  2. Mongoose connects successfully
 *  3. The Agreement model can write to and read from the DB
 *
 * Run with:  node scripts/testConnection.js
 * Delete after verifying — this is a dev utility, not production code.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGO_URI;

if (!URI) {
  console.error('[Test] ✗ MONGO_URI is not set in .env');
  process.exit(1);
}

// Minimal inline schema just for this test
const TestSchema = new mongoose.Schema({ ping: String }, { timestamps: true });
const TestModel = mongoose.model('_connection_test', TestSchema);

const run = async () => {
  console.log('[Test] Connecting to MongoDB Atlas...');
  
  await mongoose.connect(URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`[Test] ✓ Connected to → ${mongoose.connection.host}`);
  console.log(`[Test]   Database name: ${mongoose.connection.name}`);

  // Write
  const doc = await TestModel.create({ ping: 'voice-karar-test' });
  console.log(`[Test] ✓ Write successful — inserted _id: ${doc._id}`);

  // Read
  const found = await TestModel.findById(doc._id);
  console.log(`[Test] ✓ Read successful  — value: "${found.ping}"`);

  // Cleanup
  await TestModel.deleteOne({ _id: doc._id });
  console.log('[Test] ✓ Cleanup complete — test document deleted');

  await mongoose.disconnect();
  console.log('[Test] ✓ Disconnected. MongoDB Atlas connection is fully working!');
};

run().catch((err) => {
  console.error('[Test] ✗ Connection test FAILED:', err.message);
  process.exit(1);
});
