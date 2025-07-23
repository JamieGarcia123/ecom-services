    import { useState, useEffect } from "react";
import { Link, redirect, useSearchParams, Form } from "react-router";
import { ItemCard, type Item } from "../components/ItemCard";
import { getAllItemsAsync } from "../data/jsonDataManager";

// Function to load services data (browser-compatible)
async function loadServicesData(): Promise<Item[]> {
  try {
    console.log('=== loadServicesData called ===');
    
    // Use fetch for browser compatibility (SPA mode)
    const response = await fetch('/ecom_template/data/services.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`);
    }
    
    const services = await response.json();
    console.log('Loaded from fetch:', services.length, 'services');
    return services.filter((s: any) => s.active !== false);
  } catch (error) {
    console.error('Error loading services data:', error);
    // Fallback to hardcoded data
    return [
      {
        id: 1,
        name: "Reiki Healing",
        description: "One-on-one energy healing session with certified practitioners. Restore balance and promote natural healing through gentle touch therapy.",
        price: 75.00,
        image: "/images/reiki-healing.jpg"
      },
      {
        id: 2,
        name: "Nutrition Consultation",
        description: "Professional dietary guidance and meal planning. Work with certified nutritionists to improve your health and wellness.",
        price: 120.00,
        image: "/images/nutritional-guidance.jpg"
      },
      {
        id: 3,
        name: "Massage Therapy",
        description: "Relaxing therapeutic massage sessions. Reduce stress and muscle tension with our licensed massage therapists.",
        price: 150.00,
        image: "/images/massage-therapy.jpg"
      },
      {
        id: 4,
        name: "Yoga Classes",
        description: "Group and private yoga sessions for all skill levels. Improve flexibility, strength, and mindfulness.",
        price: 75.00,
        image: "/images/yoga-sessions.jpg"
      },
      {
        id: 5,
        name: "Life Coaching",
        description: "Professional guidance to help you achieve personal and professional goals. Transform your life today.",
        price: 150.00,
        image: "/images/life-coaching.jpg"
      },
      {
        id: 6,
        name: "Meditation Sessions",
        description: "Guided meditation and mindfulness training. Learn techniques to reduce stress and improve mental clarity.",
        price: 75.00,
        image: "/images/meditation-service.jpg"
      },
      {
        id: 7,
        name: "Nutrition and Holistic Apothecary Sessions",
        description: "Personalized herbal medicine consultations and holistic health guidance. Priced per 1 hour in-home session with starter kit included.",
        price: 150.00,
        image: "/images/nutrition-holistic-apothecary.jpg"
      }
    ];
  }
}

export default function ProviderDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [username, setUsername] = useState<string>('provider');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'delete'>('success');

  // Load services data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        const services = await loadServicesData();
        setItems(services);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Generate reports data
  const generateReports = () => {
    // Services by category
    const categoryStats = items.reduce((acc, item: any) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, totalPrice: 0, services: [] };
      }
      acc[category].count++;
      acc[category].totalPrice += item.price;
      acc[category].services.push(item.name);
      return acc;
    }, {} as Record<string, { count: number; totalPrice: number; services: string[] }>);

    // Services by provider
    const providerStats = items.reduce((acc, item: any) => {
      const provider = item.provider || 'Unknown Provider';
      if (!acc[provider]) {
        acc[provider] = { count: 0, totalPrice: 0, services: [] };
      }
      acc[provider].count++;
      acc[provider].totalPrice += item.price;
      acc[provider].services.push(item.name);
      return acc;
    }, {} as Record<string, { count: number; totalPrice: number; services: string[] }>);

    // Price analysis
    const prices = items.map(item => item.price);
    const totalRevenue = prices.reduce((sum, price) => sum + price, 0);
    const averagePrice = prices.length > 0 ? totalRevenue / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      categoryStats,
      providerStats,
      priceAnalysis: {
        totalRevenue,
        averagePrice,
        minPrice,
        maxPrice,
        totalServices: items.length
      }
    };
  };

  const reports = generateReports();

  // CSV Export Functions
  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateServicesCSV = () => {
    const headers = ['ID', 'Service Name', 'Category', 'Provider', 'Price', 'Duration', 'Description', 'Status'];
    const csvRows = [headers.join(',')];
    
    items.forEach((item: any) => {
      const row = [
        item.id,
        `"${item.name}"`,
        `"${item.category || 'Uncategorized'}"`,
        `"${item.provider || 'Unknown Provider'}"`,
        item.price,
        `"${item.duration || 'N/A'}"`,
        `"${item.description.replace(/"/g, '""')}"`,
        item.active !== false ? 'Active' : 'Inactive'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadCSV(csvContent, `services-report-${timestamp}.csv`);
  };

  const generateCategoryReportCSV = () => {
    const headers = ['Category', 'Service Count', 'Average Price', 'Total Value', 'Services'];
    const csvRows = [headers.join(',')];
    
    Object.entries(reports.categoryStats).forEach(([category, stats]) => {
      const row = [
        `"${category}"`,
        stats.count,
        (stats.totalPrice / stats.count).toFixed(2),
        stats.totalPrice.toFixed(2),
        `"${stats.services.join('; ')}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadCSV(csvContent, `category-report-${timestamp}.csv`);
  };

  const generateProviderReportCSV = () => {
    const headers = ['Provider', 'Service Count', 'Total Value', 'Average Price', 'Services'];
    const csvRows = [headers.join(',')];
    
    Object.entries(reports.providerStats).forEach(([provider, stats]) => {
      const row = [
        `"${provider}"`,
        stats.count,
        stats.totalPrice.toFixed(2),
        (stats.totalPrice / stats.count).toFixed(2),
        `"${stats.services.join('; ')}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadCSV(csvContent, `provider-report-${timestamp}.csv`);
  };

  const generateSummaryReportCSV = () => {
    const headers = ['Metric', 'Value'];
    const csvRows = [headers.join(',')];
    
    const summaryData = [
      ['Total Services', reports.priceAnalysis.totalServices],
      ['Total Categories', Object.keys(reports.categoryStats).length],
      ['Total Providers', Object.keys(reports.providerStats).length],
      ['Average Price', `$${reports.priceAnalysis.averagePrice.toFixed(2)}`],
      ['Minimum Price', `$${reports.priceAnalysis.minPrice.toFixed(2)}`],
      ['Maximum Price', `$${reports.priceAnalysis.maxPrice.toFixed(2)}`],
      ['Total Portfolio Value', `$${reports.priceAnalysis.totalRevenue.toFixed(2)}`],
      ['Report Generated', new Date().toLocaleString()]
    ];
    
    summaryData.forEach(([metric, value]) => {
      csvRows.push(`"${metric}","${value}"`);
    });
    
    const csvContent = csvRows.join('\n');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadCSV(csvContent, `summary-report-${timestamp}.csv`);
  };

  // Check for success message from URL params
  useEffect(() => {
    const success = searchParams.get('success');
    const deleted = searchParams.get('deleted');
    const serviceName = searchParams.get('serviceName');
    
    if (success === 'true' && serviceName) {
      setShowSuccessMessage(`Service "${serviceName}" added successfully!`);
      setMessageType('success');
      // Clear the URL params
      setSearchParams({});
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(null), 5000);
      
      // Force a page reload to refresh the data from the file system
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (deleted === 'true' && serviceName) {
      setShowSuccessMessage(`Service "${serviceName}" deleted successfully!`);
      setMessageType('delete');
      // Clear the URL params
      setSearchParams({});
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(null), 5000);
      
      // Force a page reload to refresh the data from the file system
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [searchParams, setSearchParams]);

  // Check authentication on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('serviceProviderLoggedIn');
      const storedUsername = localStorage.getItem('serviceProviderUsername');
      
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true);
        setUsername(storedUsername || 'provider');
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/login';
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('serviceProviderLoggedIn');
      localStorage.removeItem('serviceProviderUsername');
      window.location.href = '/login';
    }
  };

  // Handle edit item
  const handleEditItem = (item: Item) => {
    setEditingItem({ ...item });
  };

  // Handle delete item
  const handleDeleteItem = (item: Item) => {
    if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      // Create a form and submit it to trigger the action
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/provider-dashboard';
      
      const intentInput = document.createElement('input');
      intentInput.type = 'hidden';
      intentInput.name = 'intent';
      intentInput.value = 'delete';
      
      const serviceIdInput = document.createElement('input');
      serviceIdInput.type = 'hidden';
      serviceIdInput.name = 'serviceId';
      serviceIdInput.value = item.id.toString();
      
      form.appendChild(intentInput);
      form.appendChild(serviceIdInput);
      document.body.appendChild(form);
      form.submit();
    }
  };

  // Handle save item
  const handleSaveItem = (updatedItem: Item) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setEditingItem(null);
    
    // In a real app, you would save to database here
    alert(`Service "${updatedItem.name}" updated successfully!`);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // Show loading while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Provider Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {username}</p>
            </div>
            <div className="flex items-center space-x-4">
             
              <Link 
                to="/add-service" 
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                + Add New Service
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success/Delete Message */}
          {showSuccessMessage && (
            <div className={`mb-6 rounded-md p-4 border ${
              messageType === 'delete' 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className={`h-5 w-5 ${
                    messageType === 'delete' ? 'text-orange-400' : 'text-green-400'
                  }`} viewBox="0 0 20 20" fill="currentColor">
                    {messageType === 'delete' ? (
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    messageType === 'delete' ? 'text-orange-800' : 'text-green-800'
                  }`}>
                    {showSuccessMessage}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setShowSuccessMessage(null)}
                      className={`inline-flex rounded-md p-1.5 hover:bg-opacity-75 ${
                        messageType === 'delete' 
                          ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' 
                          : 'bg-green-50 text-green-500 hover:bg-green-100'
                      }`}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Service Reports & Analytics</h2>
              
              {/* CSV Export Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={generateServicesCSV}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Services CSV
                </button>
                <button
                  onClick={generateCategoryReportCSV}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                  </svg>
                  Category Report
                </button>
                <button
                  onClick={generateProviderReportCSV}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Provider Report
                </button>
                <button
                  onClick={generateSummaryReportCSV}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Summary Report
                </button>
              </div>
            </div>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Services</p>
                    <p className="text-2xl font-semibold text-gray-900">{reports.priceAnalysis.totalServices}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Price</p>
                    <p className="text-2xl font-semibold text-gray-900">${reports.priceAnalysis.averagePrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Price Range</p>
                    <p className="text-2xl font-semibold text-gray-900">${reports.priceAnalysis.minPrice} - ${reports.priceAnalysis.maxPrice}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Categories</p>
                    <p className="text-2xl font-semibold text-gray-900">{Object.keys(reports.categoryStats).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Services by Category */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Services by Category</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {Object.entries(reports.categoryStats).map(([category, stats]) => (
                      <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{category}</p>
                          <p className="text-sm text-gray-500">
                            {stats.count} service{stats.count !== 1 ? 's' : ''} • Avg: ${(stats.totalPrice / stats.count).toFixed(2)}
                          </p>
                          <div className="mt-2">
                            <div className="text-xs text-gray-400">
                              Services: {stats.services.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {stats.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Services by Provider */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Services by Provider</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {Object.entries(reports.providerStats).map(([provider, stats]) => (
                      <div key={provider} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{provider}</p>
                          <p className="text-sm text-gray-500">
                            {stats.count} service{stats.count !== 1 ? 's' : ''} • Total Value: ${stats.totalPrice.toFixed(2)}
                          </p>
                          <div className="mt-2">
                            <div className="text-xs text-gray-400">
                              Services: {stats.services.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {stats.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
              <Link 
                to="/add-service"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Service
              </Link>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800">
                You have {items.length} services listed. Click "Edit" on any service to update its details, or add a new service using the button above.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No services found. Items length: {items.length}</p>
                <p className="text-gray-400 text-sm">Debug: {JSON.stringify(items)}</p>
              </div>
            )}
            {items.map((item) => (
              <div key={item.id} className="relative">
                <ItemCard
                  item={item}
                />
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={handleCancelEdit}
          onChange={setEditingItem}
        />
      )}
    </div>
  );
}

// Edit Item Modal Component
interface EditItemModalProps {
  item: Item;
  onSave: (item: Item) => void;
  onCancel: () => void;
  onChange: (item: Item) => void;
}

function EditItemModal({ item, onSave, onCancel, onChange }: EditItemModalProps) {
  const handleInputChange = (field: keyof Item, value: string | number) => {
    onChange({
      ...item,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Service</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
