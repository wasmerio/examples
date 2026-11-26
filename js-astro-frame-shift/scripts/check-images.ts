#!/usr/bin/env tsx

import fs from 'fs';
import https from 'https';
import http from 'http';
import { URL } from 'url';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  categories: string[];
  date: string;
  photographer: string;
  photographerLink?: string;
}

interface ValidationResult {
  id: number;
  title: string;
  url: string;
  status: number;
  ok: boolean;
  error?: string;
}

// Read the gallery data
const galleryData: GalleryImage[] = JSON.parse(
  fs.readFileSync('./src/data/gallery.json', 'utf8')
);

console.log(`\n🔍 Checking ${galleryData.length} image URLs...\n`);

async function checkImageUrl(imageData: GalleryImage): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const url = new URL(imageData.src);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      const status = res.statusCode || 0;
      const isOk = status >= 200 && status < 300;
      
      console.log(
        `${isOk ? '✅' : '❌'} ID ${imageData.id}: ${imageData.title} - ${status} ${res.statusMessage || 'Unknown'}`
      );
      
      resolve({
        id: imageData.id,
        title: imageData.title,
        url: imageData.src,
        status: status,
        ok: isOk
      });
    });
    
    req.on('error', (err: Error) => {
      console.log(`❌ ID ${imageData.id}: ${imageData.title} - ERROR: ${err.message}`);
      resolve({
        id: imageData.id,
        title: imageData.title,
        url: imageData.src,
        status: 0,
        ok: false,
        error: err.message
      });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ID ${imageData.id}: ${imageData.title} - TIMEOUT`);
      req.destroy();
      resolve({
        id: imageData.id,
        title: imageData.title,
        url: imageData.src,
        status: 0,
        ok: false,
        error: 'Timeout'
      });
    });
    
    req.end();
  });
}

// Main validation function
async function validateImages(): Promise<void> {
  try {
    // Check all images
    const results = await Promise.all(
      galleryData.map(checkImageUrl)
    );

    // Summary
    const successful = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (failed.length > 0) {
      console.log(`\n❌ Failed images:`);
      failed.forEach(f => {
        console.log(`  - ID ${f.id}: ${f.title}`);
        console.log(`    URL: ${f.url}`);
        if (f.error) console.log(`    Error: ${f.error}`);
      });
    }

    console.log(`\n✨ Check complete!\n`);

    // Exit with error if any images failed
    process.exit(failed.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error during validation:', error);
    process.exit(1);
  }
}

// Run validation
validateImages();