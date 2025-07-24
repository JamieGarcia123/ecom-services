export default function SetupImageUpload() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Upload Setup</h1>
      
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">Setup Required</p>
        <p>Before image uploads work, you need to create a storage bucket in Supabase.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Steps to enable image uploads:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to your Supabase project dashboard</li>
            <li>Navigate to <strong>Storage</strong> in the sidebar</li>
            <li>Click <strong>"Create a new bucket"</strong></li>
            <li>Name it: <code className="bg-gray-200 px-1 rounded">service-images</code></li>
            <li>Make it <strong>public</strong> (check the public option)</li>
            <li>Click <strong>"Create bucket"</strong></li>
          </ol>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Alternative: Use Image URLs</h2>
          <p>If you don't want to set up file uploads, you can still use image URLs from:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Unsplash:</strong> unsplash.com (free stock photos)</li>
            <li><strong>Your website:</strong> If you have images hosted elsewhere</li>
            <li><strong>Image hosting services:</strong> Imgur, Cloudinary, etc.</li>
          </ul>
          <div className="mt-3 p-3 bg-gray-100 rounded">
            <p className="text-sm"><strong>Example URL:</strong></p>
            <code className="text-sm">https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400</code>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">How it works:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>File Upload:</strong> Upload image files directly (JPG, PNG, WebP)</li>
            <li><strong>Image URL:</strong> Paste a link to an existing image</li>
            <li><strong>Choose one:</strong> You can use either method, not both</li>
            <li><strong>Automatic resizing:</strong> Images are stored and served efficiently</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <a 
          href="/add-service" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Go to Add Service →
        </a>
      </div>
    </div>
  );
}
