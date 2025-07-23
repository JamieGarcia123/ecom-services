import type { Item } from "../components/ItemCard";

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

// Load data from JSON files
async function loadDataFromFile<T>(filename: string): Promise<T> {
  try {
    // In a real app, this would be a fetch to your API
    const response = await fetch(`/data/${filename}.json`);
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
    const [services, categories, providers] = await Promise.all([
      loadDataFromFile<Item[]>('services'),
      loadDataFromFile<string[]>('categories'),
      loadDataFromFile<Provider[]>('providers')
    ]);

    this.data = {
      services: services || [],
      categories: categories || [],
      providers: providers || []
    };
  }

  // Service methods
  getAllServices(): Item[] {
    return this.data.services;
  }

  getServiceById(id: number): Item | undefined {
    return this.data.services.find(service => service.id === id);
  }

  getServicesByCategory(category: string): Item[] {
    return this.data.services.filter(service => 
      service.description.toLowerCase().includes(category.toLowerCase())
    );
  }

  async addService(service: Omit<Item, 'id'>): Promise<Item> {
    const newService: Item = {
      ...service,
      id: Math.max(...this.data.services.map(s => s.id), 0) + 1
    };
    
    this.data.services.push(newService);
    await saveDataToFile('services', this.data.services);
    return newService;
  }

  async updateService(id: number, updates: Partial<Item>): Promise<Item | null> {
    const index = this.data.services.findIndex(service => service.id === id);
    if (index === -1) return null;

    this.data.services[index] = { ...this.data.services[index], ...updates };
    await saveDataToFile('services', this.data.services);
    return this.data.services[index];
  }

  async deleteService(id: number): Promise<boolean> {
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
  getAllCategories(): string[] {
    return this.data.categories;
  }
}

// Export convenience functions
export const dataManager = DataManager.getInstance();

export async function initializeData(): Promise<void> {
  await dataManager.initialize();
}

export function getAllItems(): Item[] {
  return dataManager.getAllServices();
}

export function getItemById(id: number): Item | undefined {
  return dataManager.getServiceById(id);
}

export async function addNewService(service: Omit<Item, 'id'>): Promise<Item> {
  return dataManager.addService(service);
}

export async function updateExistingService(id: number, updates: Partial<Item>): Promise<Item | null> {
  return dataManager.updateService(id, updates);
}

export async function deleteService(id: number): Promise<boolean> {
  return dataManager.deleteService(id);
}
