import { useState, useEffect } from "react";
import { redirect } from "react-router";

// Hardcoded credentials for demo
const DEMO_CREDENTIALS = {
  username: "provider123",
  password: "service2024"
};

export default function Login() {
  const [actionData, setActionData] = useState<{ success?: boolean; error?: string; username?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  // Handle form submission (client-side)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Validate credentials
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      setActionData({ success: true, username });
    } else {
      setActionData({ 
        error: "Invalid username or password. Please try again.", 
        username 
      });
    }
    
    setIsSubmitting(false);
  };

  // Handle successful login on client side
  useEffect(() => {
    if (actionData?.success && actionData.username) {
      // Set login status in localStorage (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('serviceProviderLoggedIn', 'true');
        localStorage.setItem('serviceProviderUsername', actionData.username);
        // Redirect to dashboard
        window.location.href = '/provider-dashboard';
      }
    }
  }, [actionData]);

  // Check if already logged in (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('serviceProviderLoggedIn');
      if (isLoggedIn === 'true') {
        window.location.href = '/provider-dashboard';
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Service Provider Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your services
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Demo Credentials Helper */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-blue-800">Demo Credentials</h3>
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                {showCredentials ? 'Hide' : 'Show'}
              </button>
            </div>
            {showCredentials && (
              <div className="mt-2 text-sm text-blue-700">
                <p><strong>Username:</strong> provider123</p>
                <p><strong>Password:</strong> service2024</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {actionData?.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {actionData.error}
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  defaultValue={actionData?.username || ""}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                This is a demo login for service providers to manage their services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
