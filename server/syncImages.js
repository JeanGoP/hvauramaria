import { connectToDb, sql } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncImages() {
    let pool;
    try {
        pool = await connectToDb();
        const publicDir = path.resolve(__dirname, '../public');
        
        // 1. Get all files from public directory
        const files = fs.readdirSync(publicDir);
        
        // Filter for image files only (simple check for extensions)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            // Handle cases like .JPG.jpeg by checking the end
            return imageExtensions.some(imgExt => file.toLowerCase().endsWith(imgExt));
        });

        console.log(`Found ${imageFiles.length} images in public folder.`);

        // 2. Get existing images from DB
        const result = await pool.request().query('SELECT src FROM PortfolioItems WHERE type = \'image\'');
        const existingSrcs = new Set(result.recordset.map(row => row.src));

        // 3. Identify missing images
        let addedCount = 0;
        for (const file of imageFiles) {
            const src = `/${file}`; // Web path format
            
            if (!existingSrcs.has(src)) {
                console.log(`Adding new image: ${file}`);
                
                // Generate a simple alt text from filename
                // Remove extensions and replace underscores/hyphens with spaces
                let altText = file.replace(/\.[^/.]+$/, ""); // remove last extension
                altText = altText.replace(/\.[^/.]+$/, ""); // remove second extension if exists (e.g. .JPG.jpeg)
                altText = altText.replace(/[-_]/g, " "); // replace separators
                
                await pool.request()
                    .input('type', sql.VarChar, 'image')
                    .input('src', sql.VarChar, src)
                    .input('alt', sql.VarChar, altText)
                    .query('INSERT INTO PortfolioItems (type, src, alt) VALUES (@type, @src, @alt)');
                
                addedCount++;
            }
        }

        console.log(`Sync complete. Added ${addedCount} new images.`);

    } catch (err) {
        console.error('Error syncing images:', err);
    } finally {
        if (pool) pool.close();
    }
}

syncImages();
