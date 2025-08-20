/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { body, query, validationResult } from 'express-validator';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'schooldb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Add School API
app.post(
  '/addSchool',
  [
    body('name').isString().trim().notEmpty().withMessage('name is required'),
    body('address').isString().trim().notEmpty().withMessage('address is required'),
    body('latitude')
      .exists().withMessage('latitude is required')
      .isFloat({ min: -90, max: 90 }).withMessage('latitude must be between -90 and 90'),
    body('longitude')
      .exists().withMessage('longitude is required')
      .isFloat({ min: -180, max: 180 }).withMessage('longitude must be between -180 and 180')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, latitude, longitude } = req.body;

    try {
      const sql = `
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES (:name, :address, :latitude, :longitude)
      `;
      const [result] = await pool.execute(sql, { name, address, latitude, longitude });
      return res.status(201).json({
        message: 'School added successfully',
        id: result.insertId,
        school: { id: result.insertId, name, address, latitude, longitude }
      });
    } catch (err) {
      console.error('DB insert error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// List Schools API sorted by distance
app.get(
  '/listSchools',
  [
    query('latitude')
      .exists().withMessage('latitude is required')
      .isFloat({ min: -90, max: 90 }).withMessage('latitude must be between -90 and 90'),
    query('longitude')
      .exists().withMessage('longitude is required')
      .isFloat({ min: -180, max: 180 }).withMessage('longitude must be between -180 and 180')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Use parameters as numbers
    const userLat = Number(req.query.latitude);
    const userLon = Number(req.query.longitude);

    try {
      // Haversine formula (in kilometers); earth radius ~ 6371 km
      const sql = `
        SELECT 
          id, name, address, latitude, longitude,
          (6371 * ACOS(
            COS(RADIANS(:userLat)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(:userLon)) +
            SIN(RADIANS(:userLat)) * SIN(RADIANS(latitude))
          )) AS distance_km
        FROM schools
        ORDER BY distance_km ASC, id ASC
      `;

      const [rows] = await pool.execute(sql, { userLat, userLon });
      return res.json({
        count: rows.length,
        data: rows
      });
    } catch (err) {
      console.error('DB select error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
