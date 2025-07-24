import { createClient } from '@supabase/supabase-js';
import type { Item } from '../components/ItemCard';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://');
};

// Initialize Supabase only if configured
if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    supabase = null;
  }
}

export interface SupabaseService {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  provider?: string;
  duration?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

class SupabaseDataManager {
  private fallbackData: Item[] = [];

  constructor() {
    // Load fallback data from JSON files
    this.loadFallbackData();
  }

  private async loadFallbackData() {
    try {
      const response = await fetch('/data/services.json');
      if (response.ok) {
        this.fallbackData = await response.json();
      }
    } catch (error) {
      console.warn('Could not load fallback data:', error);
    }
  }

  async getAllServices(): Promise<Item[]> {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured, using fallback data');
      return this.fallbackData;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return this.fallbackData;
      }

      return data || this.fallbackData;
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      return this.fallbackData;
    }
  }

  async addService(service: Omit<SupabaseService, 'id' | 'created_at' | 'updated_at'>): Promise<Item | null> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured. Please set up your environment variables.');
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) {
        console.error('Error adding service:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding service to Supabase:', error);
      throw error;
    }
  }

  async getAllCategories(): Promise<string[]> {
    if (!isSupabaseConfigured() || !supabase) {
      // Return fallback categories
      const categories = [...new Set(this.fallbackData.map(item => item.category).filter(Boolean))];
      return categories as string[];
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('category')
        .eq('active', true);

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      const categories = [...new Set(data.map((item: any) => item.category).filter(Boolean))] as string[];
      return categories;
    } catch (error) {
      console.error('Error fetching categories from Supabase:', error);
      return [];
    }
  }

  async getServiceById(id: number): Promise<Item | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return this.fallbackData.find(item => item.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
        return this.fallbackData.find(item => item.id === id) || null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching service from Supabase:', error);
      return this.fallbackData.find(item => item.id === id) || null;
    }
  }

  async deleteService(id: number): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured. Please set up your environment variables.');
    }

    try {
      const { error } = await supabase
        .from('services')
        .update({ active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting service:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting service from Supabase:', error);
      throw error;
    }
  }

  async updateService(id: number, updates: Partial<Item>): Promise<Item | null> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured. Please set up your environment variables.');
    }

    try {
      console.log('Updating service:', id, 'with updates:', updates);

      // First, check if the service exists (don't filter by active in case it was deactivated)
      const { data: existingService, error: checkError } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingService) {
        console.error('Service not found:', checkError);
        throw new Error(`Service with ID ${id} not found`);
      }

      console.log('Existing service found:', existingService);

      // Clean the updates object - remove any undefined or null values and non-database fields
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([key, value]) => 
          value !== undefined && 
          value !== null && 
          // Only include fields that exist in the Supabase table
          ['name', 'description', 'price', 'image', 'category', 'provider', 'duration', 'active'].includes(key)
        )
      );

      console.log('Clean updates:', cleanUpdates);

      // Check if cleanUpdates is empty
      if (Object.keys(cleanUpdates).length === 0) {
        console.log('No valid updates to apply, returning existing service');
        return existingService;
      }

      // Try update without RLS restrictions by using a more permissive approach
      console.log('Executing update query for service ID:', id);
      
      // First try a direct update
      const updateResult = await supabase
        .from('services')
        .update(cleanUpdates)
        .eq('id', id);

      console.log('Update result (without select):', updateResult);

      if (updateResult.error) {
        console.error('Supabase update error:', updateResult.error);
        throw new Error(`Database error: ${updateResult.error.message}`);
      }

      // Check if the update actually affected any rows
      if (updateResult.status === 204) {
        console.log('Update returned 204 - checking if data actually changed...');
      }

      // Now fetch the updated record
      const { data: updatedService, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !updatedService) {
        console.error('Error fetching updated service:', fetchError);
        throw new Error(`Update may have succeeded but couldn't fetch updated service: ${fetchError?.message}`);
      }

      console.log('Successfully updated and fetched service:', updatedService);
      return updatedService;
    } catch (error) {
      console.error('Error updating service in Supabase:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return isSupabaseConfigured() && supabase !== null;
  }
}

export const supabaseDataManager = new SupabaseDataManager();
