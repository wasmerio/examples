-- Migration Instructions:
-- 1. Run these commands in your Supabase SQL Editor:
-- ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;
-- ALTER TABLE public.comments ADD COLUMN guest_name VARCHAR(255);
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- LIKES POLICIES
-- Anyone can see the likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes FOR SELECT 
USING (true);

-- Authenticated users can like a post
CREATE POLICY "Users can insert their own likes" 
ON public.likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can unlike (delete) their own likes
CREATE POLICY "Users can delete their own likes" 
ON public.likes FOR DELETE 
USING (auth.uid() = user_id);


-- COMMENTS POLICIES
-- Anyone can read comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

-- Users and Guests can comment
CREATE POLICY "Anyone can insert comments" 
ON public.comments FOR INSERT 
WITH CHECK (
  (auth.role() = 'authenticated' AND auth.uid() = user_id) OR
  (auth.role() = 'anon' AND user_id IS NULL AND guest_name IS NOT NULL)
);

-- Users can edit their own comments
CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments OR Admins can delete any comment
CREATE POLICY "Users or Admins can delete comments" 
ON public.comments FOR DELETE 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- PROFILES POLICIES
-- Profiles are viewable by the owner (This avoids infinite recursion)
CREATE POLICY "Profiles are viewable by owner"
ON public.profiles FOR SELECT
USING (auth.uid() = id);


-- BOOKMARKS POLICIES (Private)
-- Only the owner can see their bookmarks
CREATE POLICY "Bookmarks are private" 
ON public.bookmarks FOR SELECT 
USING (auth.uid() = user_id);

-- Authenticated users can bookmark
CREATE POLICY "Users can insert their own bookmarks" 
ON public.bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks FOR DELETE 
USING (auth.uid() = user_id);
