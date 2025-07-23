// Migration utility to save test data to localStorage
import type { Item } from '../components/ItemCard';

// Extended interface to match what JSONDataManager expects
interface ServiceItem extends Item {
  category?: string;
  provider?: string;
  duration?: string;
  active?: boolean;
}

// Hardcoded test data (since items.ts was removed)
const testItems: Item[] = [
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

// Function to migrate test data to localStorage
export function migrateTestDataToLocalStorage(): ServiceItem[] {
  try {
    console.log('=== MIGRATION PROCESS STARTING ===');
    
    // Clear existing data first
    localStorage.removeItem('services_data');
    console.log('Cleared existing localStorage data');
    
    // Use the hardcoded test data
    console.log('Using hardcoded test items:', testItems.length);
    console.log('Test items:', testItems.map(item => ({ id: item.id, name: item.name })));
    
    // Convert to ServiceItem format with additional fields
    const serviceItems: ServiceItem[] = testItems.map((item, index) => ({
      ...item,
      category: getDefaultCategory(item.name),
      provider: getDefaultProvider(item.name),
      duration: '60 minutes', // Default duration
      active: true
    }));
    
    console.log('Converted to service items:', serviceItems.map(s => ({ 
      id: s.id, 
      name: s.name, 
      category: s.category, 
      provider: s.provider 
    })));
    
    // Save to localStorage using the key that JSONDataManager expects
    localStorage.setItem('services_data', JSON.stringify(serviceItems));
    console.log('=== SAVED TO LOCALSTORAGE ===');
    console.log('Migrated services to localStorage:', serviceItems.length);
    
    // Verify the save
    const saved = localStorage.getItem('services_data');
    if (saved) {
      const parsedServices = JSON.parse(saved);
      console.log('=== VERIFICATION SUCCESSFUL ===');
      console.log('localStorage now contains:', parsedServices.length, 'services');
      console.log('Verified services:', parsedServices.map((s: ServiceItem) => ({ id: s.id, name: s.name })));
      return parsedServices;
    } else {
      console.error('=== VERIFICATION FAILED ===');
      console.error('Failed to save to localStorage');
      return [];
    }
  } catch (error) {
    console.error('=== MIGRATION ERROR ===');
    console.error('Error during migration:', error);
    return [];
  }
}

// Helper function to assign default categories based on service name
function getDefaultCategory(serviceName: string): string {
  const name = serviceName.toLowerCase();
  
  if (name.includes('reiki') || name.includes('healing') || name.includes('massage')) {
    return 'Healing Therapies';
  } else if (name.includes('nutrition') || name.includes('holistic') || name.includes('apothecary')) {
    return 'Nutrition & Wellness';
  } else if (name.includes('yoga') || name.includes('meditation')) {
    return 'Mind & Body';
  } else if (name.includes('life') || name.includes('coaching')) {
    return 'Personal Development';
  } else {
    return 'General Wellness';
  }
}

// Helper function to assign default providers based on service name
function getDefaultProvider(serviceName: string): string {
  const name = serviceName.toLowerCase();
  
  if (name.includes('reiki')) {
    return 'Wellness Center';
  } else if (name.includes('nutrition')) {
    return 'Holistic Health Clinic';
  } else if (name.includes('massage')) {
    return 'Therapeutic Touch';
  } else if (name.includes('yoga')) {
    return 'Zen Studio';
  } else if (name.includes('life') || name.includes('coaching')) {
    return 'Life Transformation Center';
  } else if (name.includes('meditation')) {
    return 'Mindful Living';
  } else if (name.includes('holistic') || name.includes('apothecary')) {
    return 'Natural Healing Center';
  } else {
    return 'Wellness Collective';
  }
}

// Function to clear localStorage (for testing)
export function clearServicesFromLocalStorage(): void {
  localStorage.removeItem('services_data');
  console.log('Cleared services_data from localStorage');
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).migrateTestDataToLocalStorage = migrateTestDataToLocalStorage;
  (window as any).clearServicesFromLocalStorage = clearServicesFromLocalStorage;
}
