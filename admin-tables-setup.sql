-- =====================================================
-- MUNGGAHWAE - ADMIN TABLES SETUP
-- Admin System & Role Management
-- =====================================================

-- =====================================================
-- 1. CREATE ADMIN TABLES
-- =====================================================

-- Admin users table (extends users table)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin', -- super_admin, admin, moderator, staff
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  UNIQUE(user_id)
);

-- Admin roles table (for role definitions)
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin permissions table (for permission definitions)
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL, -- mountains, bookings, users, etc.
  action VARCHAR(50) NOT NULL, -- create, read, update, delete
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity logs table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin sessions table (for admin login tracking)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin dashboard settings table
CREATE TABLE IF NOT EXISTS public.admin_dashboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(admin_user_id, setting_key)
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);

-- Admin roles indexes
CREATE INDEX IF NOT EXISTS idx_admin_roles_name ON public.admin_roles(name);
CREATE INDEX IF NOT EXISTS idx_admin_roles_is_system_role ON public.admin_roles(is_system_role);

-- Admin permissions indexes
CREATE INDEX IF NOT EXISTS idx_admin_permissions_resource ON public.admin_permissions(resource);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_action ON public.admin_permissions(action);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_name ON public.admin_permissions(name);

-- Admin activity logs indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON public.admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action ON public.admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_resource_type ON public.admin_activity_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at);

-- Admin sessions indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON public.admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_session_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES
-- =====================================================

-- =====================================================
-- ADMIN USERS TABLE POLICIES
-- =====================================================

-- Super admins can view all admin users
CREATE POLICY "Super admins can view all admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
  );

-- Admins can view other admins (but not super admins)
CREATE POLICY "Admins can view other admins" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role IN ('admin', 'super_admin')
      AND au.is_active = true
    )
  );

-- Super admins can manage all admin users
CREATE POLICY "Super admins can manage all admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
  );

-- Admins can update their own profile
CREATE POLICY "Admins can update own profile" ON public.admin_users
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
  );

-- =====================================================
-- ADMIN ROLES TABLE POLICIES
-- =====================================================

-- Everyone can view roles (for UI purposes)
CREATE POLICY "Everyone can view admin roles" ON public.admin_roles
  FOR SELECT USING (true);

-- Only super admins can manage roles
CREATE POLICY "Only super admins can manage admin roles" ON public.admin_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
  );

-- =====================================================
-- ADMIN PERMISSIONS TABLE POLICIES
-- =====================================================

-- Everyone can view permissions (for UI purposes)
CREATE POLICY "Everyone can view admin permissions" ON public.admin_permissions
  FOR SELECT USING (true);

-- Only super admins can manage permissions
CREATE POLICY "Only super admins can manage admin permissions" ON public.admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
  );

-- =====================================================
-- ADMIN ACTIVITY LOGS TABLE POLICIES
-- =====================================================

-- Admins can view activity logs
CREATE POLICY "Admins can view activity logs" ON public.admin_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.role IN ('admin', 'super_admin')
      AND au.is_active = true
    )
  );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs" ON public.admin_activity_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- ADMIN SESSIONS TABLE POLICIES
-- =====================================================

-- Admins can view their own sessions
CREATE POLICY "Admins can view own sessions" ON public.admin_sessions
  FOR SELECT USING (
    admin_user_id IN (
      SELECT id FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Admins can manage their own sessions
CREATE POLICY "Admins can manage own sessions" ON public.admin_sessions
  FOR ALL USING (
    admin_user_id IN (
      SELECT id FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- ADMIN DASHBOARD SETTINGS TABLE POLICIES
-- =====================================================

-- Admins can view their own dashboard settings
CREATE POLICY "Admins can view own dashboard settings" ON public.admin_dashboard_settings
  FOR SELECT USING (
    admin_user_id IN (
      SELECT id FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Admins can manage their own dashboard settings
CREATE POLICY "Admins can manage own dashboard settings" ON public.admin_dashboard_settings
  FOR ALL USING (
    admin_user_id IN (
      SELECT id FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 5. INSERT DEFAULT DATA
-- =====================================================

-- Insert default permissions
INSERT INTO public.admin_permissions (name, display_name, description, resource, action) VALUES
-- Mountains permissions
('mountains.read', 'View Mountains', 'Can view mountain data', 'mountains', 'read'),
('mountains.create', 'Create Mountains', 'Can create new mountains', 'mountains', 'create'),
('mountains.update', 'Update Mountains', 'Can update mountain data', 'mountains', 'update'),
('mountains.delete', 'Delete Mountains', 'Can delete mountains', 'mountains', 'delete'),

-- Bookings permissions
('bookings.read', 'View Bookings', 'Can view all bookings', 'bookings', 'read'),
('bookings.create', 'Create Bookings', 'Can create bookings for users', 'bookings', 'create'),
('bookings.update', 'Update Bookings', 'Can update booking status', 'bookings', 'update'),
('bookings.delete', 'Delete Bookings', 'Can delete bookings', 'bookings', 'delete'),

-- Users permissions
('users.read', 'View Users', 'Can view user data', 'users', 'read'),
('users.create', 'Create Users', 'Can create new users', 'users', 'create'),
('users.update', 'Update Users', 'Can update user data', 'users', 'update'),
('users.delete', 'Delete Users', 'Can delete users', 'users', 'delete'),

-- Admin permissions
('admin.read', 'View Admins', 'Can view admin users', 'admin', 'read'),
('admin.create', 'Create Admins', 'Can create new admin users', 'admin', 'create'),
('admin.update', 'Update Admins', 'Can update admin data', 'admin', 'update'),
('admin.delete', 'Delete Admins', 'Can delete admin users', 'admin', 'delete'),

-- Reports permissions
('reports.read', 'View Reports', 'Can view system reports', 'reports', 'read'),
('reports.export', 'Export Reports', 'Can export reports', 'reports', 'export'),

-- Settings permissions
('settings.read', 'View Settings', 'Can view system settings', 'settings', 'read'),
('settings.update', 'Update Settings', 'Can update system settings', 'settings', 'update')
ON CONFLICT (name) DO NOTHING;

-- Insert default roles
INSERT INTO public.admin_roles (name, display_name, description, permissions, is_system_role) VALUES
-- Super Admin role
('super_admin', 'Super Administrator', 'Full system access with all permissions', 
 '["mountains.read", "mountains.create", "mountains.update", "mountains.delete", "bookings.read", "bookings.create", "bookings.update", "bookings.delete", "users.read", "users.create", "users.update", "users.delete", "admin.read", "admin.create", "admin.update", "admin.delete", "reports.read", "reports.export", "settings.read", "settings.update"]'::jsonb, 
 true),

-- Admin role
('admin', 'Administrator', 'Full access to mountains, bookings, and users', 
 '["mountains.read", "mountains.create", "mountains.update", "mountains.delete", "bookings.read", "bookings.create", "bookings.update", "bookings.delete", "users.read", "users.create", "users.update", "users.delete", "reports.read", "reports.export"]'::jsonb, 
 true),

-- Moderator role
('moderator', 'Moderator', 'Can manage bookings and view mountains', 
 '["mountains.read", "bookings.read", "bookings.update", "users.read", "reports.read"]'::jsonb, 
 true),

-- Staff role
('staff', 'Staff', 'Basic access to view and update bookings', 
 '["mountains.read", "bookings.read", "bookings.update"]'::jsonb, 
 true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 6. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION public.has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_permissions JSONB;
BEGIN
  -- Get user's role
  SELECT role INTO user_role
  FROM public.admin_users
  WHERE user_id = auth.uid() AND is_active = true;
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get role permissions
  SELECT permissions INTO role_permissions
  FROM public.admin_roles
  WHERE name = user_role;
  
  IF role_permissions IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if permission exists in role
  RETURN role_permissions ? permission_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  action_name TEXT,
  resource_type TEXT,
  resource_id UUID DEFAULT NULL,
  old_data JSONB DEFAULT NULL,
  new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user id
  SELECT id INTO admin_user_id
  FROM public.admin_users
  WHERE user_id = auth.uid() AND is_active = true;
  
  -- Insert activity log
  INSERT INTO public.admin_activity_logs (
    admin_user_id, action, resource_type, resource_id, 
    old_data, new_data, ip_address, user_agent
  ) VALUES (
    admin_user_id, action_name, resource_type, resource_id,
    old_data, new_data, 
    inet_client_addr(), current_setting('request.headers')::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create admin user
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email TEXT,
  role_name TEXT DEFAULT 'staff',
  created_by_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
  new_admin_id UUID;
BEGIN
  -- Check if creator has permission
  IF NOT public.has_permission('admin.create') THEN
    RAISE EXCEPTION 'Insufficient permissions to create admin user';
  END IF;
  
  -- Get user id from email
  SELECT id INTO new_user_id
  FROM public.users
  WHERE email = user_email;
  
  IF new_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Check if user is already an admin
  IF EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = new_user_id) THEN
    RAISE EXCEPTION 'User is already an admin';
  END IF;
  
  -- Create admin user
  INSERT INTO public.admin_users (user_id, role, created_by)
  VALUES (new_user_id, role_name, created_by_user_id)
  RETURNING id INTO new_admin_id;
  
  -- Log activity
  PERFORM public.log_admin_activity(
    'admin.create',
    'admin_users',
    new_admin_id,
    NULL,
    jsonb_build_object('user_id', new_user_id, 'role', role_name)
  );
  
  RETURN new_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. CREATE VIEWS FOR ADMIN DASHBOARD
-- =====================================================

-- View for admin users with user details
CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
  au.id as admin_id,
  au.user_id,
  au.role,
  au.permissions,
  au.is_active,
  au.created_at as admin_created_at,
  au.updated_at as admin_updated_at,
  u.nama_lengkap,
  u.email,
  u.phone_number,
  u.avatar_url,
  u.created_at as user_created_at,
  ar.display_name as role_display_name,
  ar.description as role_description
FROM public.admin_users au
JOIN public.users u ON au.user_id = u.id
LEFT JOIN public.admin_roles ar ON au.role = ar.name;

-- View for admin activity with user details
CREATE OR REPLACE VIEW public.admin_activity_view AS
SELECT 
  aal.id,
  aal.action,
  aal.resource_type,
  aal.resource_id,
  aal.old_data,
  aal.new_data,
  aal.ip_address,
  aal.user_agent,
  aal.created_at,
  au.user_id,
  u.nama_lengkap,
  u.email,
  au.role
FROM public.admin_activity_logs aal
LEFT JOIN public.admin_users au ON aal.admin_user_id = au.id
LEFT JOIN public.users u ON au.user_id = u.id
ORDER BY aal.created_at DESC;

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions on admin tables
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.admin_roles TO anon, authenticated;
GRANT SELECT ON public.admin_permissions TO anon, authenticated;
GRANT SELECT ON public.admin_activity_logs TO authenticated;
GRANT ALL ON public.admin_sessions TO authenticated;
GRANT ALL ON public.admin_dashboard_settings TO authenticated;

-- Grant permissions on views
GRANT SELECT ON public.admin_users_view TO authenticated;
GRANT SELECT ON public.admin_activity_view TO authenticated;

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_activity(TEXT, TEXT, UUID, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user(TEXT, TEXT, UUID) TO authenticated;

-- =====================================================
-- 9. CREATE TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_dashboard_settings_updated_at
  BEFORE UPDATE ON public.admin_dashboard_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- To create your first super admin, run:
-- SELECT public.create_admin_user('your-email@example.com', 'super_admin');

-- To check if a user has permission:
-- SELECT public.has_permission('mountains.create');

-- To log admin activity:
-- SELECT public.log_admin_activity('mountain.create', 'mountains', 'mountain-uuid', NULL, '{"name": "Gunung Baru"}'); 