import { useState, useEffect } from "react";

export default function DebugEnv() {
  const [envData, setEnvData] = useState<any>({});

  useEffect(() => {
    // Log all environment variables
    console.log('All import.meta.env:', import.meta.env);
    
    const env = {
      all: import.meta.env,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      nodeEnv: import.meta.env.NODE_ENV,
      mode: import.meta.env.MODE
    };
    
    setEnvData(env);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Debug</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Environment Variables:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(envData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
