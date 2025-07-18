const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAuthTables() {
  try {
    console.log('Setting up Auth.js database tables...');

    // Create Auth.js required tables
    const authTablesSql = `
      -- Auth.js accounts table
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "userId" UUID NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(provider, "providerAccountId")
      );

      -- Auth.js sessions table
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" UUID NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Update existing users table to be compatible with Auth.js
      DO $$ 
      BEGIN
        -- Add Auth.js compatible columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='emailVerified') THEN
          ALTER TABLE users ADD COLUMN "emailVerified" TIMESTAMPTZ;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='image') THEN
          ALTER TABLE users ADD COLUMN image TEXT;
        END IF;
      END $$;

      -- Auth.js verification tokens table (for magic links)
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );

      -- Add foreign key constraints
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'accounts_userId_fkey') THEN
          ALTER TABLE accounts ADD CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'sessions_userId_fkey') THEN
          ALTER TABLE sessions ADD CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END $$;

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts ("userId");
      CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions ("userId");
      CREATE INDEX IF NOT EXISTS sessions_sessionToken_idx ON sessions ("sessionToken");
      CREATE INDEX IF NOT EXISTS verification_tokens_token_idx ON verification_tokens (token);
    `;

    const { error: tablesError } = await supabase.rpc('exec_sql', {
      sql: authTablesSql
    });

    if (tablesError) {
      console.error('Error creating Auth.js tables:', tablesError);
      throw tablesError;
    } else {
      console.log('✅ Auth.js tables created successfully');
    }

    // Migrate existing users to Auth.js format
    console.log('Migrating existing users to Auth.js format...');
    
    // Update existing users to add role column and set admin status
    const adminEmails = ['harshkumaryadavg@gmail.com', 'escoemelyn@gmail.com', 'lakhstack@gmail.com', 'lakhstack.dev@gmail.com'];
    
    for (const email of adminEmails) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        // Update existing user to admin
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('email', email);
        console.log(`✅ Updated existing user ${email} to admin`);
      }
    }

    console.log('🎉 Auth.js database setup completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Set up Google OAuth credentials in Google Cloud Console');
    console.log('2. Add environment variables for AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET');
    console.log('3. Configure Resend API key for magic links');

  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupAuthTables();