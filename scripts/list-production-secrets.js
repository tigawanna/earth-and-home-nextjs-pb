#!/usr/bin/env node
/**
 * Script to list current Wrangler secrets for production environment
 * Usage: node scripts/list-production-secrets.js
 */

const { exec } = require('child_process');

const ENVIRONMENT = 'production';

function listSecrets(env) {
  return new Promise((resolve, reject) => {
    const command = `npx wrangler secret list --env ${env}`;
    console.log(`🔍 Listing secrets for environment: ${env}\n`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to list secrets:`, stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function main() {
  try {
    await listSecrets(ENVIRONMENT);
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
