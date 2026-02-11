import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectToDb, sql } from '../../server/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', async (req, res) => {
    try {
        const pool = await connectToDb();
        const result = await pool.request().query('SELECT 1 as number');
        res.json({ message: 'Connected to SQL Server', result: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get Portfolio Items
app.get('/api/portfolio', async (req, res) => {
    try {
        const pool = await connectToDb();
        const result = await pool.request().query('SELECT * FROM PortfolioItems');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get Featured Videos
app.get('/api/videos', async (req, res) => {
    try {
        const pool = await connectToDb();
        const result = await pool.request().query('SELECT * FROM FeaturedVideos');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export const handler = serverless(app);