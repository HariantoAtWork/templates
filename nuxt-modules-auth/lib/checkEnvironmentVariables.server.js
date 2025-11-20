/**
 * Environment Variables Validation Script
 * Checks required environment variables based on database type
 *
 * Created: 2025-09-08T14:42:16+0200
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Load environment variables from .env file if it exists
function loadEnvFile() {
  try {
    const envPath = join(projectRoot, '.env')
    const envContent = readFileSync(envPath, 'utf8')

    envContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      }
    })
  } catch {
    // .env file doesn't exist or can't be read, continue with system env vars
  }
}

// Required environment variables
const requiredVars = {
  // Always required (core auth)
  always: ['BETTER_AUTH_SECRET'],

  // Required for SMTP functionality
  smtp: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'],

  // Required for database functionality
  database: ['DB_TYPE'],

  // Required when DB_TYPE=sqlite
  sqlite: ['SQLITE_PATH'],

  // Required when DB_TYPE=postgres
  postgres: ['PGUSER', 'PGPASSWORD', 'PGHOST', 'PGPORT', 'PGDATABASE'],
}

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...\n')

  let hasErrors = false
  const missingVars = []

  // Check if running in proxy mode
  // If BETTER_AUTH_PROXY_URL is defined and non-empty, skip SMTP and database checks
  const isProxyMode = Boolean(process.env.BETTER_AUTH_PROXY_URL?.trim())

  if (isProxyMode) {
    console.log('🔄 Running in Better Auth Proxy mode - skipping SMTP and database checks')
    return
  }

  // Check always required variables (core auth)
  console.log('📋 Checking core auth variables:')
  for (const varName of requiredVars.always) {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      console.log(`❌ ${varName}: Missing or empty`)
      missingVars.push(varName)
      hasErrors = true
    } else {
      console.log(`✅ ${varName}: Set`)
    }
  }

  // Skip SMTP and database checks if in proxy mode
  if (!isProxyMode) {
    // Check SMTP variables
    console.log('\n📧 Checking SMTP variables:')
    for (const varName of requiredVars.smtp) {
      const value = process.env[varName]
      if (!value || value.trim() === '') {
        console.log(`❌ ${varName}: Missing or empty`)
        missingVars.push(varName)
        hasErrors = true
      } else {
        console.log(`✅ ${varName}: Set`)
      }
    }

    // Check database variables
    console.log('\n🗄️  Checking database variables:')
    for (const varName of requiredVars.database) {
      const value = process.env[varName]
      if (!value || value.trim() === '') {
        console.log(`❌ ${varName}: Missing or empty`)
        missingVars.push(varName)
        hasErrors = true
      } else {
        console.log(`✅ ${varName}: Set`)
      }
    }

    // Check database-specific variables
    const dbType = process.env.DB_TYPE?.toLowerCase()

    if (!dbType) {
      console.log(
        '\n❌ DB_TYPE is not set, cannot check database-specific variables'
      )
      hasErrors = true
    } else {
      console.log(`\n🗄️  Checking ${dbType} database-specific variables:`)

      if (dbType === 'sqlite') {
        for (const varName of requiredVars.sqlite) {
          const value = process.env[varName]
          if (!value || value.trim() === '') {
            console.log(`❌ ${varName}: Missing or empty`)
            missingVars.push(varName)
            hasErrors = true
          } else {
            console.log(`✅ ${varName}: Set`)
          }
        }
      } else if (dbType === 'postgres') {
        for (const varName of requiredVars.postgres) {
          const value = process.env[varName]
          if (!value || value.trim() === '') {
            console.log(`❌ ${varName}: Missing or empty`)
            missingVars.push(varName)
            hasErrors = true
          } else {
            console.log(`✅ ${varName}: Set`)
          }
        }
      } else {
        console.log(
          `❌ Unsupported DB_TYPE: ${dbType}. Supported types: sqlite, postgres`
        )
        hasErrors = true
      }
    }
  } else {
    console.log('\n⏭️  Skipping SMTP and database validation (proxy mode)')
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  if (hasErrors) {
    console.log('❌ Environment validation failed!')
    console.log('\nMissing or empty variables:')
    missingVars.forEach((varName) => {
      console.log(`  - ${varName}`)
    })
    console.log(
      '\nPlease set these variables in your .env file or environment.'
    )
    process.exit(1)
  } else {
    console.log('✅ All required environment variables are set!')
    // process.exit(0)
  }
}

export { checkEnvironmentVariables as default, loadEnvFile }
