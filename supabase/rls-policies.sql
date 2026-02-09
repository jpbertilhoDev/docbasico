-- Row Level Security Policies for Admin Dashboard
-- Execute this after creating the tables

-- Enable RLS on posts table (if not already enabled)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
DROP POLICY IF EXISTS "Admins can insert posts" ON posts;
DROP POLICY IF EXISTS "Admins can update posts" ON posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON posts;

-- Policy: Authenticated users can view all posts (for admin dashboard)
CREATE POLICY "Admins can view all posts" ON posts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert posts
CREATE POLICY "Admins can insert posts" ON posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update posts
CREATE POLICY "Admins can update posts" ON posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete posts
CREATE POLICY "Admins can delete posts" ON posts
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

-- Policy: Authenticated users can manage categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Note: The public policies for viewing published posts and categories
-- are already defined in schema.sql and will work alongside these admin policies

