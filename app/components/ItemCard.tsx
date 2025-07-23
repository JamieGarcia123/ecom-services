
import { Link } from "react-router";

// TypeScript interface matching the C# item class
export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string; // Optional image property
  source?: string; // Optional source property for external links
}

interface ItemCardProps {
  item: Item;

}

export function ItemCard({ 
  item, 
}: ItemCardProps) {

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Item Image Placeholder */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>
      
      {/* Item Content */}
      <div className="p-4">
        {/* Item Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        {/* Item Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {item.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            to={`/service/${item.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          
          {/* <button 
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Add to Cart
          </button> */}
        </div>
      </div>
    </div>
  );
}