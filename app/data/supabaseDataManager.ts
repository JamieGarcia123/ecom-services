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

  isConfigured(): boolean {
    return isSupabaseConfigured() && supabase !== null;
  }
}

export const supabaseDataManager = new SupabaseDataManager();
