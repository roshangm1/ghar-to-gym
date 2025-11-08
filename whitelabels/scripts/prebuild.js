#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WHITELABELS_DIR = path.join(process.cwd(), 'whitelabels');
const ACTIVE_FILE = path.join(WHITELABELS_DIR, '.active');

function getActiveWhiteLabel() {
  // First, check for BRAND environment variable (from Expo/EAS)
  if (process.env.BRAND) {
    return process.env.BRAND.trim();
  }
  
  // Fallback to .active file
  try {
    const active = fs.readFileSync(ACTIVE_FILE, 'utf-8').trim();
    if (active) {
      return active;
    }
  } catch {
    // File doesn't exist or can't be read
  }
  
  // Default fallback
  return 'gharfit';
}

const activeWhiteLabel = getActiveWhiteLabel();
const source = process.env.BRAND ? 'BRAND environment variable' : 'active whitelabel file';
console.log(`\n🔄 Pre-build: Applying white-label "${activeWhiteLabel}" (from ${source})...\n`);

try {
  const switchScript = path.join(WHITELABELS_DIR, 'scripts', 'switch-whitelabel.js');
  execSync(`node "${switchScript}" apply ${activeWhiteLabel}`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log(`\n✅ Pre-build: White-label "${activeWhiteLabel}" applied successfully!\n`);
} catch (error) {
  console.error(`\n❌ Pre-build: Failed to apply white-label "${activeWhiteLabel}"`);
  console.error(error.message);
  process.exit(1);
}

