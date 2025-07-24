import type { Item } from "../components/ItemCard";
import { supabaseDataManager } from "./supabaseDataManager";

// Data storage interface
export interface DataStore {
  services: Item[];
  categories: string[];
  providers: Provider[];
}

export interface Provider {
  id: number;
  name: string;
  email: string;
  bio: string;
  specialties: string[];
  verified: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
}

// Load data from JSON files
async function loadDataFromFile<T>(filename: string): Promise<T> {
  try {
    // In a real app, this would be a fetch to your API
    // Handle both development and production paths
    const basePath = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '' : '/ecom-services';
    const response = await fetch(`${basePath}/data/${filename}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return {} as T;
  }
}

// Save data to JSON files (would be an API call in production)
async function saveDataToFile<T>(filename: string, data: T): Promise<boolean> {
  try {
    // This would be a POST/PUT request to your API
    const response = await fetch(`/api/data/${filename}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
    return false;
  }
}

// Data access layer
export class DataManager {
  private static instance: DataManager;
  private data: DataStore = {
    services: [],
    categories: [],
    providers: []
  };

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  async initialize(): Promise<void> {
    // Try Supabase first, fall back to JSON files
    if (supabaseDataManager.isConfigured()) {
      try {
        const [services, categories] = await Promise.all([
          supabaseDataManager.getAllServices(),
          supabaseDataManager.getAllCategories()
        ]);

        // Load providers from JSON (can be moved to Supabase later)
        const providers = await loadDataFromFile<Provider[]>('providers');

        this.data = {
          services: services || [],
          categories: categories || [],
          providers: providers || []
        };
        return;
      } catch (error) {
        console.warn('Supabase failed, falling back to JSON:', error);
      }
    }

    // Fallback to JSON files
    const [services, categoriesData, providers] = await Promise.all([
      loadDataFromFile<Item[]>('services'),
      loadDataFromFile<Category[]>('categories'),
      loadDataFromFile<Provider[]>('providers')
    ]);

    // Extract category names from category objects
    const categories = categoriesData ? categoriesData.map(cat => cat.name) : [];

    this.data = {
      services: services || [],
      categories: categories,
      providers: providers || []
    };
  }

  // Service methods
  async getAllServices(): Promise<Item[]> {
    if (supabaseDataManager.isConfigured()) {
      return await supabaseDataManager.getAllServices();
    }
    return this.data.services;
  }

  async getServiceById(id: number): Promise<Item | undefined> {
    if (supabaseDataManager.isConfigured()) {
      const service = await supabaseDataManager.getServiceById(id);
      return service || undefined;
    }
    return this.data.services.find(service => service.id === id);
  }

  async addService(service: Omit<Item, 'id'>): Promise<Item | null> {
    if (supabaseDataManager.isConfigured()) {
      return await supabaseDataManager.addService(service);
    }
    throw new Error('Service addition requires Supabase configuration');
  }

  getServicesByCategory(category: string): Item[] {
    return this.data.services.filter(service => 
      service.description.toLowerCase().includes(category.toLowerCase())
    );
  }

  async updateService(id: number, updates: Partial<Item>): Promise<Item | null> {
    if (supabaseDataManager.isConfigured()) {
      return await supabaseDataManager.updateService(id, updates);
    }
    
    const index = this.data.services.findIndex(service => service.id === id);
    if (index === -1) return null;

    this.data.services[index] = { ...this.data.services[index], ...updates };
    await saveDataToFile('services', this.data.services);
    return this.data.services[index];
  }

  async deleteService(id: number): Promise<boolean> {
    if (supabaseDataManager.isConfigured()) {
      return await supabaseDataManager.deleteService(id);
    }
    
    const index = this.data.services.findIndex(service => service.id === id);
    if (index === -1) return false;

    this.data.services.splice(index, 1);
    await saveDataToFile('services', this.data.services);
    return true;
  }

  // Provider methods
  getAllProviders(): Provider[] {
    return this.data.providers;
  }

  getProviderById(id: number): Provider | undefined {
    return this.data.providers.find(provider => provider.id === id);
  }

  // Category methods
  async getAllCategories(): Promise<string[]> {
    if (supabaseDataManager.isConfigured()) {
      return await supabaseDataManager.getAllCategories();
    }
    return this.data.categories;
  }
}

// Export convenience functions
export const dataManager = DataManager.getInstance();

export async function initializeData(): Promise<void> {
  await dataManager.initialize();
}

export async function getAllItems(): Promise<Item[]> {
  return await dataManager.getAllServices();
}

export async function getItemById(id: number): Promise<Item | undefined> {
  return await dataManager.getServiceById(id);
}

export async function addNewService(service: Omit<Item, 'id'>): Promise<Item | null> {
  return await dataManager.addService(service);
}

export async function updateExistingService(id: number, updates: Partial<Item>): Promise<Item | null> {
  return dataManager.updateService(id, updates);
}

export async function deleteService(id: number): Promise<boolean> {
  return dataManager.deleteService(id);
}
