import { connectToDb, sql } from './db.js';

async function updateDb() {
    let pool;
    try {
        pool = await connectToDb();
        
        // Add src column if not exists
        try {
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('FeaturedVideos') AND name = 'src')
                BEGIN
                    ALTER TABLE FeaturedVideos ADD src VARCHAR(255);
                END
            `);
            console.log('Added src column to FeaturedVideos');
        } catch (e) {
            console.log('Error adding src column:', e.message);
        }

        // Make vimeoId nullable
        try {
            await pool.request().query(`
                ALTER TABLE FeaturedVideos ALTER COLUMN vimeoId VARCHAR(50) NULL;
            `);
            console.log('Made vimeoId nullable');
        } catch (e) {
            console.log('Error altering vimeoId:', e.message);
        }

        // Insert Video principal.mp4
        const videoName = 'Video principal.mp4';
        const videoSrc = '/' + videoName;
        
        // Check if already exists
        const check = await pool.request()
            .input('src', sql.VarChar, videoSrc)
            .query('SELECT * FROM FeaturedVideos WHERE src = @src');
            
        if (check.recordset.length === 0) {
            await pool.request()
                .input('type', sql.VarChar, 'local') // using 'local' type
                .input('src', sql.VarChar, videoSrc)
                .query('INSERT INTO FeaturedVideos (type, src) VALUES (@type, @src)');
            console.log(`Inserted ${videoName}`);
        } else {
            console.log(`${videoName} already exists`);
        }

    } catch (err) {
        console.error('Error updating DB:', err);
    } finally {
        if (pool) pool.close();
    }
}

updateDb();
