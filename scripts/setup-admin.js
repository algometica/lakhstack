const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Replace with your Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create users table
    const { error: usersTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR UNIQUE NOT NULL,
          password_hash VARCHAR NOT NULL,
          name VARCHAR,
          role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (usersTableError) {
      console.error('Error creating users table:', usersTableError);
    } else {
      console.log('✅ Users table created successfully');
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@besharamlist.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Check if admin user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user
      const { data: adminUser, error: adminError } = await supabase
        .from('users')
        .insert([
          {
            email: adminEmail,
            password_hash: hashedPassword,
            name: adminName,
            role: 'admin'
          }
        ])
        .select()
        .single();

      if (adminError) {
        console.error('Error creating admin user:', adminError);
      } else {
        console.log('✅ Admin user created successfully');
        console.log('Admin credentials:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
      }
    }

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase(); 