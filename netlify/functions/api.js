import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectToDb, sql } from '../../server/db.js';

const app = express();

// Configuración explícita de CORS
app.use(cors({
    origin: '*', // Permitir cualquier origen por ahora para depurar
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.path}`);
    next();
});

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