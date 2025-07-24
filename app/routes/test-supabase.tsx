import { useState, useEffect } from "react";
import { supabaseDataManager } from "../data/supabaseDataManager";

export default function TestSupabase() {
  const [status, setStatus] = useState<string>("Checking...");
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    async function testConnection() {
      try {
        // Check environment variables
        const envCheck = {
          url: import.meta.env.VITE_SUPABASE_URL,
          key: import.meta.env.VITE_SUPABASE_ANON_KEY,
          urlValid: import.meta.env.VITE_SUPABASE_URL?.startsWith('https://'),
          keyValid: import.meta.env.VITE_SUPABASE_ANON_KEY?.length > 50
        };
        setDebugInfo(envCheck);

        // Check if Supabase is configured
        const isConfigured = supabaseDataManager.isConfigured();
        setStatus(`Supabase configured: ${isConfigured}`);

        if (isConfigured) {
          // Try to fetch services
          console.log('Attempting to fetch services from Supabase...');
          const servicesData = await supabaseDataManager.getAllServices();
          console.log('Services data received:', servicesData);
          
          setServices(servicesData);
          setStatus(`Supabase working! Found ${servicesData.length} services`);
        } else {
          setError("Supabase not configured - check environment variables");
        }
      } catch (err) {
        console.error('Supabase test error:', err);
        setError(`Error: ${(err as Error).message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Status:</h2>
        <p className={error ? "text-red-600" : "text-green-600"}>
          {error || status}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Environment Variables:</h2>
        <p>VITE_SUPABASE_URL: {debugInfo.url ? "✓ Set" : "✗ Missing"} {debugInfo.urlValid ? "(Valid HTTPS)" : "(Invalid)"}</p>
        <p>VITE_SUPABASE_ANON_KEY: {debugInfo.key ? "✓ Set" : "✗ Missing"} {debugInfo.keyValid ? "(Valid length)" : "(Too short)"}</p>
        <div className="text-xs text-gray-600 mt-2">
          <p>URL: {debugInfo.url}</p>
          <p>Key: {debugInfo.key ? `${debugInfo.key.substring(0, 20)}...` : "Not set"}</p>
        </div>
      </div>

      {services.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Services from Supabase:</h2>
          <ul className="list-disc pl-6">
            {services.map((service, index) => (
              <li key={index}>{service.name} - ${service.price}</li>
            ))}
          </ul>
        </div>
      )}

      {services.length === 0 && !error && status.includes("working") && (
        <div className="text-yellow-600">
          <p>Supabase connection works but no services found in the database.</p>
          <p>Check your Supabase table or add some services.</p>
        </div>
      )}
    </div>
  );
}
