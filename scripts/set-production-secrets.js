#!/usr/bin/env node
/**
 * Script to set production secrets from .env.production file
 * Usage: node scripts/set-production-secrets.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ENV_FILE = path.join(process.cwd(), '.env.production');
const ENVIRONMENT = 'production';

// Variables that should be set as secrets (sensitive data)
const SENSITIVE_VARS = [
  'PB_TYPEGEN_PASSWORD',
  'NEXT_PUBLIC_POSTHOG_KEY'
];

// Variables that can be set as regular vars in wrangler.jsonc
const PUBLIC_VARS = [
  'NEXT_PUBLIC_PB_URL',
  'NEXT_PUBLIC_POSTHOG_HOST',
  'PB_TYPEGEN_EMAIL',
  'NODE_ENV'
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File ${filePath} does not exist`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};

  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        // Remove quotes if present
        let value = valueParts.join('=');
        value = value.replace(/^["']|["']$/g, '');
        vars[key] = value;
      }
    }
  });

  return vars;
}

function setSecret(key, value, env) {
  return new Promise((resolve, reject) => {
    const command = `npx wrangler secret put ${key} --env ${env}`;
    console.log(`🔐 Setting secret: ${key}`);
    
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to set secret ${key}:`, stderr);
        reject(error);
      } else {
        console.log(`✅ Successfully set secret: ${key}`);
        resolve(stdout);
      }
    });
    
    // Send the value to the command and close stdin
    child.stdin.write(value + '\n');
    child.stdin.end();
  });
}

async function updateWranglerConfig(publicVars) {
  const wranglerPath = path.join(process.cwd(), 'wrangler.jsonc');
  
  if (!fs.existsSync(wranglerPath)) {
    console.warn(`⚠️  wrangler.jsonc not found at ${wranglerPath}`);
    return;
  }

  try {
    let content = fs.readFileSync(wranglerPath, 'utf8');
    
    // More comprehensive comment removal for JSONC
    const contentForParsing = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/\/\/.*$/gm, '')          // Remove // comments
      .replace(/,(\s*[}\]])/g, '$1');    // Remove trailing commas
    
    let config;
    try {
      config = JSON.parse(contentForParsing);
    } catch (parseError) {
      console.warn(`⚠️  Could not parse wrangler.jsonc automatically:`, parseError.message);
      console.log(`📝 Public variables to add manually to wrangler.jsonc:`);
      Object.entries(publicVars).forEach(([key, value]) => {
        console.log(`   "${key}": "${value}"`);
      });
      return;
    }
    
    // Update production environment vars
    if (!config.env) config.env = {};
    if (!config.env.production) {
      config.env.production = {
        name: "earth-and-home-prod"
      };
    }
    if (!config.env.production.vars) config.env.production.vars = {};
    
    Object.entries(publicVars).forEach(([key, value]) => {
      config.env.production.vars[key] = value;
    });

    // Write back with pretty formatting
    const updatedContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(wranglerPath, updatedContent);
    console.log(`✅ Updated wrangler.jsonc with public variables`);
  } catch (error) {
    console.warn(`⚠️  Could not update wrangler.jsonc automatically:`, error.message);
    console.log(`📝 Public variables to add manually to wrangler.jsonc:`);
    Object.entries(publicVars).forEach(([key, value]) => {
      console.log(`   "${key}": "${value}"`);
    });
  }
}

async function main() {
  console.log(`🚀 Setting up production environment variables from ${ENV_FILE}`);
  console.log(`📝 Environment: ${ENVIRONMENT}\n`);

  const envVars = parseEnvFile(ENV_FILE);
  const secrets = {};
  const publicVars = {};

  // Categorize variables
  Object.entries(envVars).forEach(([key, value]) => {
    if (SENSITIVE_VARS.includes(key)) {
      secrets[key] = value;
    } else if (PUBLIC_VARS.includes(key)) {
      publicVars[key] = value;
    } else {
      // Default to secret for unknown variables
      console.log(`⚠️  Unknown variable ${key}, treating as secret`);
      secrets[key] = value;
    }
  });

  console.log(`📋 Found ${Object.keys(secrets).length} secrets and ${Object.keys(publicVars).length} public variables\n`);

  // Set secrets via Wrangler
  if (Object.keys(secrets).length > 0) {
    console.log('🔐 Setting secrets via Wrangler CLI...\n');
    
    for (const [key, value] of Object.entries(secrets)) {
      try {
        await setSecret(key, value, ENVIRONMENT);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait between commands
      } catch (error) {
        console.error(`❌ Failed to set secret ${key}, continuing...`);
      }
    }
  }

  // Update wrangler.jsonc with public vars
  if (Object.keys(publicVars).length > 0) {
    console.log('\n📝 Updating wrangler.jsonc with public variables...');
    await updateWranglerConfig(publicVars);
  }

  console.log('\n✅ Production environment setup complete!');
  console.log('\n📋 Summary:');
  console.log(`   🔐 Secrets set: ${Object.keys(secrets).join(', ')}`);
  console.log(`   📝 Public vars: ${Object.keys(publicVars).join(', ')}`);
  console.log('\n🚀 You can now deploy with: npm run deploy:prod');
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}
