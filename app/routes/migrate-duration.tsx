import { useState } from "react";
import { supabase } from "../data/supabaseManager";

export default function MigrateDuration() {
  const [status, setStatus] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const runMigration = async () => {
    setIsRunning(true);
    setStatus("Checking if migration is needed...");

    try {
      // Test if duration column exists by trying to select it
      const { data, error } = await supabase
        .from('services')
        .select('id, name, duration')
        .limit(1);

      if (error && error.message.includes('duration')) {
        setStatus("Duration column does not exist. Please run this SQL in Supabase SQL editor:\n\nALTER TABLE services ADD COLUMN duration TEXT;");
      } else if (error) {
        throw error;
      } else {
        setStatus(`Duration column exists! Found ${data?.length || 0} services. You can now use the duration field when adding services.`);
      }
    } catch (error) {
      console.error('Migration check error:', error);
      setStatus(`Error checking migration: ${(error as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Duration Column Migration</h1>
      
      <div className="mb-4">
        <button
          onClick={runMigration}
          disabled={isRunning}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isRunning ? 'Checking...' : 'Check Migration Status'}
        </button>
      </div>

      {status && (
        <div className="bg-gray-100 p-4 rounded whitespace-pre-line">
          <p>{status}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Manual Migration Steps:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to your Supabase project dashboard</li>
          <li>Navigate to the SQL Editor</li>
          <li>Run this SQL command:</li>
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono mt-2">
            ALTER TABLE services ADD COLUMN duration TEXT;
          </div>
          <li>Come back here and click "Check Migration Status"</li>
        </ol>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">What this fixes:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Allows services to store duration information (e.g., "60 minutes", "1 hour", "90 mins")</li>
          <li>Fixes the issue where all services default to 60 minutes regardless of input</li>
          <li>New services will properly save and display their specified duration</li>
        </ul>
      </div>
    </div>
  );
}
