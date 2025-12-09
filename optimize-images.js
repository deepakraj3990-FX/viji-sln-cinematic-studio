/**
 * Image Optimization Script for Lokesh Photography
 * 
 * This script helps compress and optimize images for production.
 * Run with: node optimize-images.js
 * 
 * Prerequisites:
 * npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('⚠️  Sharp not installed. Install with: npm install sharp');
    console.log('\nManual optimization instructions:');
    console.log('================================');
    console.log('\n📸 Your images are quite large! Here are the optimizations needed:\n');

    // List files that need optimization
    const imagesDir = path.join(__dirname, 'assets', 'images');
    const files = fs.readdirSync(imagesDir);

    let totalSize = 0;
    const largeFiles = [];

    files.forEach(file => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = stats.size / 1024;
        const sizeMB = sizeKB / 1024;
        totalSize += stats.size;

        if (sizeKB > 500) {
            largeFiles.push({ name: file, size: sizeMB.toFixed(2) + ' MB' });
        }
    });

    console.log('Large files (>500KB) that need compression:\n');
    largeFiles.forEach(f => {
        console.log(`  ❌ ${f.name} - ${f.size}`);
    });

    console.log(`\n📊 Total images size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Target size after optimization: ~${(totalSize / 1024 / 1024 / 5).toFixed(2)} MB (80% reduction)`);

    console.log('\n🔧 Recommended tools for manual optimization:');
    console.log('   1. TinyPNG (https://tinypng.com) - Free online compression');
    console.log('   2. Squoosh (https://squoosh.app) - Google\'s image optimizer');
    console.log('   3. ImageOptim (Mac) or FileOptimizer (Windows)');
    console.log('\n📐 Recommended settings:');
    console.log('   - Hero images: 1920x1080, quality 80%');
    console.log('   - Marquee images: 600x400, quality 75%');
    console.log('   - Format: Convert to WebP for 30-50% smaller files');

    process.exit(0);
}

const INPUT_DIR = path.join(__dirname, 'assets', 'images');
const OUTPUT_DIR = path.join(__dirname, 'assets', 'images-optimized');

// Optimization settings
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 75;
const MAX_WIDTH = 1920; // For hero images
const MARQUEE_WIDTH = 600; // For marquee images

async function optimizeImages() {
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(INPUT_DIR);
    let totalOriginal = 0;
    let totalOptimized = 0;

    console.log('🚀 Starting image optimization...\n');

    for (const file of files) {
        const inputPath = path.join(INPUT_DIR, file);
        const stats = fs.statSync(inputPath);

        if (!stats.isFile()) continue;

        const ext = path.extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

        totalOriginal += stats.size;

        const baseName = path.basename(file, ext);

        // Determine if this is a marquee image (smaller is better)
        const isMarquee = file.includes('marquee') || stats.size < 500000;
        const targetWidth = isMarquee ? MARQUEE_WIDTH : MAX_WIDTH;

        try {
            // Create optimized JPEG
            const jpegOutput = path.join(OUTPUT_DIR, `${baseName}.jpg`);
            await sharp(inputPath)
                .resize(targetWidth, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .jpeg({ quality: JPEG_QUALITY, progressive: true })
                .toFile(jpegOutput);

            const jpegStats = fs.statSync(jpegOutput);

            // Create WebP version
            const webpOutput = path.join(OUTPUT_DIR, `${baseName}.webp`);
            await sharp(inputPath)
                .resize(targetWidth, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: WEBP_QUALITY })
                .toFile(webpOutput);

            const webpStats = fs.statSync(webpOutput);

            totalOptimized += Math.min(jpegStats.size, webpStats.size);

            const savings = ((stats.size - Math.min(jpegStats.size, webpStats.size)) / stats.size * 100).toFixed(1);
            console.log(`✅ ${file}`);
            console.log(`   Original: ${(stats.size / 1024).toFixed(0)}KB → JPEG: ${(jpegStats.size / 1024).toFixed(0)}KB, WebP: ${(webpStats.size / 1024).toFixed(0)}KB (${savings}% saved)\n`);

        } catch (err) {
            console.log(`❌ Error processing ${file}: ${err.message}`);
        }
    }

    const savingsPercent = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);

    console.log('═══════════════════════════════════════════');
    console.log('📊 OPTIMIZATION COMPLETE');
    console.log('═══════════════════════════════════════════');
    console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Total savings: ${savingsPercent}%`);
    console.log(`\n   Output folder: ${OUTPUT_DIR}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Review optimized images in the output folder');
    console.log('   2. Replace originals with optimized versions');
    console.log('   3. Use WebP with JPEG fallback for best support');
}

optimizeImages().catch(console.error);
