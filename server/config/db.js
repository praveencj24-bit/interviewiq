import dns from 'node:dns';
import mongoose from 'mongoose';
import env from './env.js';

// some networks cannot resolve Atlas addresses, so a custom DNS can be set in .env
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
}

export async function connectDB() {
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}