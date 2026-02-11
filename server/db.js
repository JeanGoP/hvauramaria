import sql from 'mssql';
// Eliminamos dotenv, path y url de aquí para evitar conflictos en Netlify.
// Las variables de entorno deben ser cargadas por el punto de entrada (index.js o Netlify env).

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
            console.error('Environment variables missing. DB_SERVER is undefined.');
            console.error('Current env vars:', {
                DB_USER: process.env.DB_USER ? 'Set' : 'Missing',
                DB_SERVER: process.env.DB_SERVER ? 'Set' : 'Missing',
                DB_NAME: process.env.DB_NAME ? 'Set' : 'Missing'
            });
            throw new Error('DB_SERVER environment variable is missing');
        }
        
        // Si la conexión ya existe y está conectada, la reusamos (buena práctica para serverless)
        if (sql.globalConnection && sql.globalConnection.connected) {
            console.log('Reusing existing SQL connection');
            return sql.globalConnection;
        }

        console.log(`Connecting to database at ${process.env.DB_SERVER}...`);
        const pool = await sql.connect(config);
        sql.globalConnection = pool; // Guardamos referencia global
        console.log('Connected to SQL Server successfully');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

export { sql };