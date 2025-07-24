import { createClient } from '@supabase/supabase-js';
import type { Item } from "../components/ItemCard";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database interfaces
export interface DatabaseService extends Omit<Item, 'id'> {
  id?: number;
  created_at?: string;
  updated_at?: string;
  provider_id?: number;
  category_id?: number;
  active?: boolean;
}

export interface DatabaseProvider {
  id?: number;
  name: string;
  email: string;
  bio?: string;
  specialties?: string[];
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Supabase data access layer
export class SupabaseDataManager {
  // Service methods
  async getAllServices(): Promise<Item[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformService);
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  async getServiceById(id: number): Promise<Item | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

      if (error) throw error;
      return data ? this.transformService(data) : null;
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  }

  async getServicesByProvider(providerId: number): Promise<Item[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformService);
    } catch (error) {
      console.error('Error fetching provider services:', error);
      return [];
    }
  }

  async addService(service: Omit<Item, 'id'>, providerId: number): Promise<Item | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([{
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          image: service.image,
          source: service.source,
          provider_id: providerId,
          active: true
        }])
        .select()
        .single();

      if (error) throw error;
      return this.transformService(data);
    } catch (error) {
      console.error('Error adding service:', error);
      return null;
    }
  }

  async updateService(id: number, updates: Partial<Item>): Promise<Item | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.transformService(data);
    } catch (error) {
      console.error('Error updating service:', error);
      return null;
    }
  }

  async deleteService(id: number): Promise<boolean> {
    try {
      // Soft delete - mark as inactive
      const { error } = await supabase
        .from('services')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  }

  // Provider methods
  async getProviderByEmail(email: string): Promise<DatabaseProvider | null> {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching provider:', error);
      return null;
    }
  }

  async createProvider(provider: Omit<DatabaseProvider, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseProvider | null> {
    try {
      const { data, error } = await supabase
        .from('providers')
        .insert([provider])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating provider:', error);
      return null;
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, providerData: Omit<DatabaseProvider, 'id' | 'email' | 'created_at' | 'updated_at'>) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create provider profile
        await this.createProvider({
          ...providerData,
          email,
        });
      }

      return authData;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Helper methods
  private transformService(data: any): Item {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      image: data.image,
      source: data.source,
    };
  }
}

// Export singleton instance
export const supabaseDataManager = new SupabaseDataManager();

// SQL to create tables (run in Supabase SQL editor)
export const createTablesSQL = `
-- Enable Row Level Security
CREATE TABLE IF NOT EXISTS providers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  image TEXT,
  source TEXT,
  provider_id BIGINT REFERENCES providers(id),
  category_id BIGINT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public services are viewable by everyone" ON services
  FOR SELECT USING (active = true);

CREATE POLICY "Providers can view their own services" ON services
  FOR ALL USING (auth.uid() = (SELECT auth.uid() FROM providers WHERE id = provider_id));

CREATE POLICY "Providers can manage their own services" ON services
  FOR ALL USING (provider_id IN (SELECT id FROM providers WHERE email = auth.email()));

-- Insert sample data
INSERT INTO categories (name, description) VALUES
  ('Healing Therapies', 'Energy work, massage, and therapeutic treatments'),
  ('Mind & Body', 'Yoga, meditation, and mindfulness practices'),
  ('Nutrition', 'Dietary guidance and holistic nutrition'),
  ('Life Coaching', 'Personal development and life transformation');
`;
