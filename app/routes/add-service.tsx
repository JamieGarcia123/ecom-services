import { useState, useEffect } from "react";
import { addNewService, getAllCategories, getAllProviders, type ServiceItem, type Category, type Provider } from "../data/jsonDataManager";
import { supabaseDataManager } from "../data/supabaseDataManager";

export default function AddService() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission (client-side)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!supabaseDataManager.isConfigured()) {
      setError("Service addition requires Supabase configuration. Please set up your environment variables or use a platform with backend support.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(event.currentTarget);
      
      // Validation
      const price = parseFloat(formData.get('price') as string);
      const duration = formData.get('duration') as string;
      
      // Price validation
      if (isNaN(price) || price <= 0) {
        setError("Please enter a valid price greater than $0.00");
        setIsSubmitting(false);
        return;
      }
      
      // Duration validation
      if (duration && !duration.toLowerCase().match(/(minute|hour|min|hr)/)) {
        setError("Duration must include time units (e.g., '60 minutes', '1 hour', '90 mins')");
        setIsSubmitting(false);
        return;
      }
      
      const serviceData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Math.round(price * 100) / 100, // Round to 2 decimal places
        category: formData.get('category') as string,
        provider: formData.get('provider') as string,
        duration: duration || undefined,
        image: formData.get('image') as string || undefined,
      };

      const newService = await supabaseDataManager.addService(serviceData);
      
      if (newService) {
        // Redirect to services page on success
        window.location.href = '/services';
      } else {
        setError("Failed to add service. Please try again.");
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setError("Error adding service: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load categories and providers on component mount
  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, providersData] = await Promise.all([
          getAllCategories(),
          getAllProviders()
        ]);
        setCategories(categoriesData);
        setProviders(providersData);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Add New Service</h1>
          <p className="text-gray-600">Create a new holistic service offering</p>
        </div>

        {/* Static Site Notice */}
        {!supabaseDataManager.isConfigured() ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Setup Required:</strong> To enable service addition, please set up Supabase (free database). 
                  See <strong>SUPABASE_SETUP.md</strong> for instructions. Without Supabase, this is a static demo only.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>Database Connected:</strong> Supabase is configured. You can add new services to the database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className={`bg-white shadow-md rounded-lg p-6 ${!supabaseDataManager.isConfigured() ? 'opacity-75' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}

            {/* Service Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Service Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Advanced Reiki Healing"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Detailed description of the service..."
              />
            </div>

            {/* Price and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0.01"
                  step="0.01"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="75.00"
                  title="Enter price in format: 75.00"
                />
                <p className="mt-1 text-sm text-gray-500">Format: 00.00 (e.g., 75.00)</p>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="60 minutes"
                  title="Include time units: minutes, hours, mins, hrs"
                />
                <p className="mt-1 text-sm text-gray-500">Include time units (e.g., "60 minutes", "1 hour")</p>
              </div>
            </div>

            {/* Category and Provider Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                  Provider
                </label>
                <select
                  id="provider"
                  name="provider"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.name}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="/images/service-name.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: URL to service image (relative or absolute)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !supabaseDataManager.isConfigured()}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${
                  supabaseDataManager.isConfigured() 
                    ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting 
                  ? "Adding Service..." 
                  : supabaseDataManager.isConfigured() 
                    ? "Add Service" 
                    : "Add Service (Setup Supabase First)"
                }
              </button>
              {!supabaseDataManager.isConfigured() && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Configure Supabase to enable service addition
                </p>
              )}
            </div>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <a
                href="/services"
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                ← Back to Services
              </a>
              <a
                href="/provider-dashboard"
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                Provider Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
