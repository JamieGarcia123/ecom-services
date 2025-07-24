import { useState, useEffect } from "react";
import { supabaseDataManager } from "../data/supabaseManager";
import type { Item } from "../components/ItemCard";

export default function TestServiceDetail() {
  const [service, setService] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allServices, setAllServices] = useState<Item[]>([]);

  useEffect(() => {
    async function testServiceLoading() {
      try {
        console.log('Testing service loading...');
        
        // First, get all services to see what IDs exist
        const services = await supabaseDataManager.getAllServices();
        console.log('All services:', services);
        setAllServices(services);
        
        // Try to get service with ID 1
        if (services.length > 0) {
          const firstService = services[0];
          console.log('Trying to load first service by ID:', firstService.id);
          
          const serviceById = await supabaseDataManager.getServiceById(firstService.id);
          console.log('Service by ID result:', serviceById);
          setService(serviceById);
        }
      } catch (error) {
        console.error('Error testing service loading:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
    
    testServiceLoading();
  }, []);

  if (loading) {
    return <div className="p-8">Loading test...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Service Detail Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">All Services ({allServices.length}):</h2>
        <div className="space-y-2">
          {allServices.map((s) => (
            <div key={s.id} className="bg-gray-100 p-2 rounded">
              ID: {s.id} - {s.name}
            </div>
          ))}
        </div>
      </div>
      
      {service && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Retrieved Service:</h2>
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-bold">{service.name}</h3>
            <p>{service.description}</p>
            <p>Price: ${service.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}
