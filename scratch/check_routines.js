import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  // Query RPC functions in public schema
  const { data, error } = await supabase.rpc('get_routines'); // Try common custom schema check or RPC
  if (error) {
    console.log("No standard get_routines RPC. Let's query pg_proc via REST if possible, or print standard queries.");
    
    // We can query pg_catalog tables via postgrest if they are exposed, which is usually not the case.
    const { data: procData, error: procError } = await supabase.from('pg_proc').select('*').limit(5);
    console.log("pg_proc error:", procError?.message);
    console.log("pg_proc data:", procData);
  } else {
    console.log("Routines data:", data);
  }
}

run();
