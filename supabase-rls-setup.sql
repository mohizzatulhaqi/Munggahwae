-- =====================================================
-- MUNGGAHWAE - SUPABASE RLS SETUP
-- Row Level Security Configuration
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mountains table
CREATE TABLE IF NOT EXISTS public.mountains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  province VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  hero_image_url TEXT,
  quota_per_day INTEGER NOT NULL DEFAULT 100,
  price_per_person INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trails table
CREATE TABLE IF NOT EXISTS public.trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mountain_id UUID REFERENCES public.mountains(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20),
  estimated_duration_hours INTEGER,
  max_altitude INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking terms table
CREATE TABLE IF NOT EXISTS public.booking_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mountain_id UUID REFERENCES public.mountains(id) ON DELETE CASCADE,
  term_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  mountain_id UUID REFERENCES public.mountains(id) ON DELETE CASCADE,
  trail_id UUID REFERENCES public.trails(id),
  
  -- Tanggal pendakian
  tanggal_masuk DATE NOT NULL,
  tanggal_keluar DATE NOT NULL,
  
  -- Informasi pemesanan
  jumlah_pemesan INTEGER NOT NULL,
  total_harga INTEGER NOT NULL,
  
  -- Status pemesanan
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  
  -- Informasi tambahan
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint untuk memastikan tanggal keluar >= tanggal masuk
  CONSTRAINT check_dates CHECK (tanggal_keluar >= tanggal_masuk)
);

-- Booking members table
CREATE TABLE IF NOT EXISTS public.booking_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pemesanan_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  -- Data pribadi
  email VARCHAR(255) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  no_identitas VARCHAR(20) NOT NULL,
  kewarganegaraan VARCHAR(50) DEFAULT 'Indonesia',
  jenis_kelamin VARCHAR(10),
  
  -- Data tambahan
  tempat_lahir VARCHAR(255),
  tanggal_lahir DATE,
  file_ktp TEXT,
  
  -- Role dalam pendakian
  is_companion BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mountain gallery table
CREATE TABLE IF NOT EXISTS public.mountain_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mountain_id UUID REFERENCES public.mountains(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily quotas table
CREATE TABLE IF NOT EXISTS public.daily_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mountain_id UUID REFERENCES public.mountains(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_quota INTEGER NOT NULL,
  booked_quota INTEGER DEFAULT 0,
  available_quota INTEGER GENERATED ALWAYS AS (total_quota - booked_quota) STORED,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mountain_id, date)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking logs table
CREATE TABLE IF NOT EXISTS public.booking_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Mountains indexes
CREATE INDEX IF NOT EXISTS idx_mountains_province ON public.mountains(province);
CREATE INDEX IF NOT EXISTS idx_mountains_status ON public.mountains(status);
CREATE INDEX IF NOT EXISTS idx_mountains_name ON public.mountains(name);

-- Trails indexes
CREATE INDEX IF NOT EXISTS idx_trails_mountain_id ON public.trails(mountain_id);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mountain_id ON public.bookings(mountain_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tanggal_masuk ON public.bookings(tanggal_masuk);
CREATE INDEX IF NOT EXISTS idx_bookings_tanggal_keluar ON public.bookings(tanggal_keluar);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);

-- Booking members indexes
CREATE INDEX IF NOT EXISTS idx_booking_members_pemesanan_id ON public.booking_members(pemesanan_id);

-- Daily quotas indexes
CREATE INDEX IF NOT EXISTS idx_daily_quotas_mountain_date ON public.daily_quotas(mountain_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_quotas_date ON public.daily_quotas(date);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mountains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mountain_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES
-- =====================================================

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- MOUNTAINS TABLE POLICIES
-- =====================================================

-- Everyone can view mountains
CREATE POLICY "Mountains are viewable by everyone" ON public.mountains
  FOR SELECT USING (true);

-- Only admins can insert mountains
CREATE POLICY "Only admins can insert mountains" ON public.mountains
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Only admins can update mountains
CREATE POLICY "Only admins can update mountains" ON public.mountains
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Only admins can delete mountains
CREATE POLICY "Only admins can delete mountains" ON public.mountains
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- TRAILS TABLE POLICIES
-- =====================================================

-- Everyone can view trails
CREATE POLICY "Trails are viewable by everyone" ON public.trails
  FOR SELECT USING (true);

-- Only admins can manage trails
CREATE POLICY "Only admins can manage trails" ON public.trails
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- BOOKING TERMS TABLE POLICIES
-- =====================================================

-- Everyone can view booking terms
CREATE POLICY "Booking terms are viewable by everyone" ON public.booking_terms
  FOR SELECT USING (true);

-- Only admins can manage booking terms
CREATE POLICY "Only admins can manage booking terms" ON public.booking_terms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (if not confirmed)
CREATE POLICY "Users can update own pending bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = user_id AND 
    status IN ('pending', 'draft')
  );

-- Users can cancel their own bookings
CREATE POLICY "Users can cancel own bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = user_id AND 
    status IN ('pending', 'confirmed')
  );

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Admins can update all bookings
CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- BOOKING MEMBERS TABLE POLICIES
-- =====================================================

-- Users can view members of their own bookings
CREATE POLICY "Users can view booking members" ON public.booking_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_members.pemesanan_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- Users can manage members of their own bookings
CREATE POLICY "Users can manage booking members" ON public.booking_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_members.pemesanan_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- =====================================================
-- MOUNTAIN GALLERY TABLE POLICIES
-- =====================================================

-- Everyone can view mountain gallery
CREATE POLICY "Mountain gallery is viewable by everyone" ON public.mountain_gallery
  FOR SELECT USING (true);

-- Only admins can manage mountain gallery
CREATE POLICY "Only admins can manage mountain gallery" ON public.mountain_gallery
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- DAILY QUOTAS TABLE POLICIES
-- =====================================================

-- Everyone can view daily quotas
CREATE POLICY "Daily quotas are viewable by everyone" ON public.daily_quotas
  FOR SELECT USING (true);

-- Only admins can manage daily quotas
CREATE POLICY "Only admins can manage daily quotas" ON public.daily_quotas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can insert notifications for users
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- ADMIN USERS TABLE POLICIES
-- =====================================================

-- Only super admins can view admin users
CREATE POLICY "Only super admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role = 'super_admin'
    )
  );

-- Only super admins can manage admin users
CREATE POLICY "Only super admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role = 'super_admin'
    )
  );

-- =====================================================
-- BOOKING LOGS TABLE POLICIES
-- =====================================================

-- Only admins can view booking logs
CREATE POLICY "Only admins can view booking logs" ON public.booking_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- System can insert booking logs
CREATE POLICY "System can insert booking logs" ON public.booking_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 5. CREATE FUNCTIONS FOR AUTOMATION
-- =====================================================

-- Function to automatically create user profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, nama_lengkap, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nama_lengkap', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mountains_updated_at
  BEFORE UPDATE ON public.mountains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 6. CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for mountain details with trail count
CREATE OR REPLACE VIEW public.mountain_details AS
SELECT 
  m.*,
  COUNT(t.id) as trail_count,
  COUNT(bg.id) as gallery_count
FROM public.mountains m
LEFT JOIN public.trails t ON m.id = t.mountain_id
LEFT JOIN public.mountain_gallery bg ON m.id = bg.mountain_id
GROUP BY m.id;

-- View for booking details with mountain info
CREATE OR REPLACE VIEW public.booking_details AS
SELECT 
  b.*,
  m.name as mountain_name,
  m.location as mountain_location,
  u.nama_lengkap as user_name,
  u.email as user_email
FROM public.bookings b
JOIN public.mountains m ON b.mountain_id = m.id
JOIN public.users u ON b.user_id = u.id;

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.mountains TO anon, authenticated;
GRANT SELECT ON public.trails TO anon, authenticated;
GRANT SELECT ON public.booking_terms TO anon, authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.booking_members TO authenticated;
GRANT SELECT ON public.mountain_gallery TO anon, authenticated;
GRANT SELECT ON public.daily_quotas TO anon, authenticated;
GRANT ALL ON public.notifications TO authenticated;

-- Grant permissions on views
GRANT SELECT ON public.mountain_details TO anon, authenticated;
GRANT SELECT ON public.booking_details TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- You can now run this script in your Supabase SQL editor
-- Make sure to replace any placeholder values with your actual data 