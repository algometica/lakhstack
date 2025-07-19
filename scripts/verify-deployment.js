#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Get the domain from command line argument or use default
const domain = process.argv[2] || 'lakhstack.com';
const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1');
const protocol = isLocalhost ? 'http' : 'https';
const client = isLocalhost ? http : https;

console.log(`🔍 Checking environment variables for: ${domain}`);
console.log('');

async function checkEnvironment() {
  try {
    const response = await new Promise((resolve, reject) => {
      const req = client.get(`${protocol}://${domain}/api/auth/check-env`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });

    console.log('✅ Environment Check Results:');
    console.log(`   Environment: ${response.environment}`);
    console.log(`   Success: ${response.success ? '✅' : '❌'}`);
    
    if (response.missing && response.missing.length > 0) {
      console.log(`   ❌ Missing variables: ${response.missing.join(', ')}`);
    } else {
      console.log('   ✅ All required variables present');
    }
    
    console.log('');
    console.log('📋 Variable Status:');
    console.log(`   GOOGLE_CLIENT_ID: ${response.hasGoogleClientId ? '✅' : '❌'}`);
    console.log(`   GOOGLE_CLIENT_SECRET: ${response.hasGoogleClientSecret ? '✅' : '❌'}`);
    console.log(`   AUTH_SECRET: ${response.hasAuthSecret ? '✅' : '❌'}`);
    
    if (!response.success) {
      console.log('');
      console.log('🚨 ISSUES FOUND:');
      console.log('1. Go to your Vercel dashboard');
      console.log('2. Navigate to Settings → Environment Variables');
      console.log('3. Add the missing variables listed above');
      console.log('4. Redeploy your application');
    } else {
      console.log('');
      console.log('🎉 All environment variables are properly configured!');
      console.log('If you\'re still experiencing issues, check:');
      console.log('1. Google OAuth redirect URIs');
      console.log('2. Vercel function logs');
      console.log('3. Browser cookies');
    }
    
  } catch (error) {
    console.error('❌ Error checking environment:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure your domain is correct');
    console.log('2. Check if the site is deployed and accessible');
    console.log('3. Verify the API route is working');
  }
}

checkEnvironment(); 