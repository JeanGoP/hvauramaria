import { connectToDb, sql } from './db.js';

async function setupDb() {
    let pool;
    try {
        pool = await connectToDb();
        
        // Create PortfolioItems table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PortfolioItems' AND xtype='U')
            BEGIN
                CREATE TABLE PortfolioItems (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    type VARCHAR(50) NOT NULL,
                    src VARCHAR(255),
                    alt VARCHAR(255),
                    videoUrl VARCHAR(255),
                    thumbnail VARCHAR(255)
                );
            END
        `);

        // Create FeaturedVideos table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FeaturedVideos' AND xtype='U')
            BEGIN
                CREATE TABLE FeaturedVideos (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    vimeoId VARCHAR(50) NOT NULL,
                    type VARCHAR(50) NOT NULL
                );
            END
        `);

        console.log('Tables created or already exist.');

        // Check if data exists in PortfolioItems
        const portfolioCount = await pool.request().query('SELECT COUNT(*) as count FROM PortfolioItems');
        if (portfolioCount.recordset[0].count === 0) {
            console.log('Seeding PortfolioItems...');
            const items = [
                { type: 'image', src: '/20250927_205425177_iOS.jpg', alt: 'Portrait photography 1' },
                { type: 'image', src: '/20250925_182439000_iOS.jpg', alt: 'Fashion portrait' },
                { type: 'image', src: '/IMG_3716.JPG', alt: 'Street photography 1' },
                { type: 'image', src: '/IMG_3717.JPG', alt: 'Street photography 2' },
                { type: 'image', src: '/IMG_3718.JPG', alt: 'Street photography 3' },
                { type: 'image', src: '/IMG_3719.JPG', alt: 'Street photography 4' },
                { type: 'image', src: '/IMG_3721.JPG', alt: 'Street photography 5' },
                { type: 'image', src: '/20250721_202335000_iOS.jpg', alt: 'Portrait photography 2' },
            ];

            for (const item of items) {
                await pool.request()
                    .input('type', sql.VarChar, item.type)
                    .input('src', sql.VarChar, item.src)
                    .input('alt', sql.VarChar, item.alt)
                    .query('INSERT INTO PortfolioItems (type, src, alt) VALUES (@type, @src, @alt)');
            }
        }

        // Check if data exists in FeaturedVideos
        const videosCount = await pool.request().query('SELECT COUNT(*) as count FROM FeaturedVideos');
        if (videosCount.recordset[0].count === 0) {
            console.log('Seeding FeaturedVideos...');
            const videos = [
                { vimeoId: '1126062368', type: 'regular' },
                { vimeoId: '1126062254', type: 'short' },
                { vimeoId: '1126062015', type: 'short' },
                { vimeoId: '1126061837', type: 'short' },
                { vimeoId: '1126059714', type: 'short' }
            ];

            for (const video of videos) {
                await pool.request()
                    .input('vimeoId', sql.VarChar, video.vimeoId)
                    .input('type', sql.VarChar, video.type)
                    .query('INSERT INTO FeaturedVideos (vimeoId, type) VALUES (@vimeoId, @type)');
            }
        }

        console.log('Database setup complete.');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        if (pool) pool.close();
    }
}

setupDb();
