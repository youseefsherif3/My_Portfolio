import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI');
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!globalForMongo.mongoose) {
  globalForMongo.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (globalForMongo.mongoose?.conn) {
    return globalForMongo.mongoose.conn;
  }

  if (!globalForMongo.mongoose?.promise) {
    globalForMongo.mongoose!.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    });
  }

  globalForMongo.mongoose!.conn = await globalForMongo.mongoose!.promise;
  return globalForMongo.mongoose!.conn;
}
