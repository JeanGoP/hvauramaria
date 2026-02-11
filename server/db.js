import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export async function connectToDb() {
    try {
        if (!process.env.DB_SERVER) {
            throw new Error('DB_SERVER environment variable is missing');
        }
        
        console.log(`Connecting to database at ${process.env.DB_SERVER}...`);
        
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server successfully');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

export { sql };
