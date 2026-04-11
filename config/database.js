require('dotenv').config();
require('reflect-metadata');
const { DataSource } = require('typeorm');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const path = require('path');
const awsService = require('../service/awsService');


mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));


const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB || 1,
  password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('ready', () => console.log('✅ Redis ready'));
redis.on('error', err => console.error('❌ Redis error:', err.message));


module.exports = {
  mongoose,
  redis,
  awsService,
};
