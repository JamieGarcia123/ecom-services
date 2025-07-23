import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import type { Item } from "../components/ItemCard";

// Simple function to load service data directly
async function loadServiceData(id: number): Promise<Item | null> {
  try {
    // Use fetch for browser compatibility (SPA mode)
    // Handle both development and production paths
    const basePath = window.location.hostname === 'localhost' ? '' : '/ecom-services';
    const response = await fetch(`${basePath}/data/services.json`);
    if (!response.ok) {
      console.error('Failed to fetch services.json:', response.status);
      return null;
    }
    
    const services = await response.json();
    const service = services.find((s: any) => s.id === id && s.active !== false);
    return service || null;
  } catch (error) {
    console.error('Error loading service data:', error);
    return null;
  }
}

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const [service, setService] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Load service data on component mount
  useEffect(() => {
    async function loadData() {
      if (!serviceId) {
        setError('Service ID not found');
        setLoading(false);
        return;
      }

      try {
        const serviceIdNum = parseInt(serviceId);
        console.log('Loading service with ID:', serviceIdNum);
        
        const serviceData = await loadServiceData(serviceIdNum);
        console.log('Service found:', serviceData);
        
        if (!serviceData) {
          setError('Service not found');
        } else {
          setService(serviceData);
        }
      } catch (error) {
        console.error('Error loading service:', error);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [serviceId]);

  // Check if service is favorited
  useEffect(() => {
    if (service && typeof window !== 'undefined') {
      const favorites = localStorage.getItem('serviceFavorites');
      if (favorites) {
        const favList = JSON.parse(favorites);
        setIsFavorite(favList.includes(service.id));
      }
    }
  }, [service]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The service you are looking for does not exist.'}</p>
          <Link
            to="/services"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (typeof window !== 'undefined' && service) {
      const favorites = localStorage.getItem('serviceFavorites');
      const favList = favorites ? JSON.parse(favorites) : [];
      
      let newFavorites;
      if (isFavorite) {
        newFavorites = favList.filter((id: number) => id !== service.id);
      } else {
        newFavorites = [...favList, service.id];
      }
      
      localStorage.setItem('serviceFavorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    }
  };

  // Handle booking
  const handleBooking = () => {
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (service) {
      alert(`Booking request submitted for ${service.name}! You will be contacted soon.`);
      setShowBookingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link to="/services" className="text-gray-500 hover:text-gray-700">
                  Services
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{service.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image */}
          <div className="flex flex-col-reverse">
            <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-96 object-center object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-200">
                  <span className="text-gray-400 text-lg">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Service info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{service.name}</h1>
            
            {/* Price */}
            <div className="mt-3">
              <h2 className="sr-only">Service information</h2>
              <p className="text-3xl tracking-tight text-green-600 font-bold">
                ${service.price.toFixed(2)}
              </p>
            </div>

            {/* Service details */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Service Details</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Duration */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{(service as any).duration || "60 minutes"}</p>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{(service as any).category || "General"}</p>
                    </div>
                  </div>
                </div>

                {/* Provider */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Provider</p>
                      <p className="font-medium">{(service as any).provider || "Wellness Center"}</p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium text-green-600">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <p>{service.description}</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
              <div className="mt-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Promotes natural healing and relaxation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Reduces stress and anxiety</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Improves overall well-being</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Balances energy and promotes healing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleBooking}
                className="flex-1 bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Book This Service
              </button>
              
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-md border ${
                  isFavorite 
                    ? 'border-red-300 text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300'
                }`}
              >
                <svg className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Contact info */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900">Questions?</h3>
              <p className="mt-2 text-sm text-gray-500">
                Contact us at <a href="mailto:info@wellnesscenter.com" className="text-green-600 hover:text-green-500">info@wellnesscenter.com</a> or call{' '}
                <a href="tel:+15551234567" className="text-green-600 hover:text-green-500">(555) 123-4567</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book {service.name}</h3>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Any special requests or questions..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  Submit Booking Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
