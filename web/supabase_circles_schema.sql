-- Add Circles and Spotlight tables

-- 1. CIRCLES TABLE
CREATE TABLE IF NOT EXISTS public.circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  style TEXT, -- Optional style requirement
  country TEXT, -- Optional location requirement
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Circles are viewable by members" ON public.circles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.circle_members 
      WHERE circle_id = circles.id AND user_id = auth.uid() AND status = 'ACTIVE'
    ) OR owner_user_id = auth.uid()
  );

CREATE POLICY "Authenticated users can create circles" ON public.circles
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can update their circles" ON public.circles
  FOR UPDATE USING (auth.uid() = owner_user_id);

-- 2. CIRCLE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.circle_members (
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('OWNER', 'MEMBER')),
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INVITED')),
  invited_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  PRIMARY KEY (circle_id, user_id)
);

ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Members can see their own memberships and memberships in circles they belong to
CREATE POLICY "Members see relevant memberships" ON public.circle_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.circle_members m 
      WHERE m.circle_id = circle_members.circle_id AND m.user_id = auth.uid() AND m.status = 'ACTIVE'
    )
  );

CREATE POLICY "Owners/Members can invite" ON public.circle_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.circle_members m 
      WHERE m.circle_id = circle_id AND m.user_id = auth.uid() AND m.status = 'ACTIVE'
    ) OR EXISTS (
      SELECT 1 FROM public.circles c 
      WHERE c.id = circle_id AND c.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can accept invites" ON public.circle_members
  FOR UPDATE USING (user_id = auth.uid());

-- 3. SPOTLIGHT ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.spotlight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  added_by_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT,
  UNIQUE(circle_id, post_id)
);

ALTER TABLE public.spotlight_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spotlights are viewable by circle members" ON public.spotlight_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.circle_members 
      WHERE circle_id = spotlight_entries.circle_id AND user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

CREATE POLICY "Members can add to spotlight" ON public.spotlight_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.circle_members 
      WHERE circle_id = spotlight_entries.circle_id AND user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

CREATE POLICY "Members can remove from spotlight" ON public.spotlight_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.circle_members 
      WHERE circle_id = spotlight_entries.circle_id AND user_id = auth.uid() AND status = 'ACTIVE'
    )
  );
