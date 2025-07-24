# Supabase Setup Instructions

## 1. Create a Free Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Note your:
   - Project URL (like: https://your-project.supabase.co)
   - Public API Key (anon key)

## 2. Create the Services Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100),
  provider VARCHAR(255),
  duration VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO services (name, description, price, image, category, provider, duration) VALUES
('Reiki Healing', 'One-on-one energy healing session with certified practitioners. Restore balance and promote natural healing through gentle touch therapy.', 75.00, '/images/reiki-healing.jpg', 'Healing Therapies', 'Wellness Center', '60 minutes'),
('Nutrition Consultation', 'Professional dietary guidance and meal planning. Work with certified nutritionists to improve your health and wellness.', 120.00, '/images/nutritional-guidance.jpg', 'Nutrition & Wellness', 'Holistic Health Clinic', '90 minutes'),
('Massage Therapy', 'Relaxing therapeutic massage sessions. Reduce stress and muscle tension with our licensed massage therapists.', 150.00, '/images/massage-therapy.jpg', 'Healing Therapies', 'Therapeutic Touch', '75 minutes'),
('Yoga Classes', 'Group and private yoga sessions for all skill levels. Improve flexibility, strength, and mindfulness.', 75.00, '/images/yoga-sessions.jpg', 'Mind & Body', 'Zen Studio', '60 minutes'),
('Life Coaching', 'Professional guidance to help you achieve personal and professional goals. Transform your life today.', 150.00, '/images/life-coaching.jpg', 'Personal Development', 'Life Transformation Center', '90 minutes'),
('Meditation Sessions', 'Guided meditation sessions to reduce stress and improve mental clarity. Perfect for beginners and experienced practitioners.', 50.00, '/images/meditation-service.jpg', 'Mind & Body', 'Mindfulness Center', '45 minutes');

-- Enable Row Level Security (optional but recommended)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON services
FOR SELECT USING (true);

-- Create policy to allow authenticated insert (for adding services)
CREATE POLICY "Allow authenticated insert" ON services
FOR INSERT WITH CHECK (true);
```

## 3. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 4. GitHub Pages Environment Variables

In your GitHub repository:
1. Go to Settings > Secrets and variables > Actions
2. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Benefits

✅ **Free forever** (up to 500MB database)
✅ **Works with GitHub Pages** (static hosting)
✅ **Real database** with full CRUD operations
✅ **Automatic API** generation
✅ **Real-time updates** (optional)
✅ **Built-in authentication** (if needed later)
✅ **Global CDN** for fast performance
