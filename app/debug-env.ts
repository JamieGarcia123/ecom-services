// Debug environment variables
console.log('=== Environment Debug ===');
console.log('NODE_ENV:', import.meta.env.MODE);
console.log('All env vars:', import.meta.env);
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);
console.log('========================');

// Test URL construction
try {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (url) {
    const testUrl = new URL(url);
    console.log('URL test passed:', testUrl.origin);
  } else {
    console.log('URL is undefined/empty');
  }
} catch (error) {
  console.error('URL test failed:', error);
}

export {};
