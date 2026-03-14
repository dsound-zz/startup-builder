-- Investor Matches Table
-- Stores investor matching results for startup ideas
CREATE TABLE IF NOT EXISTS public.investor_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    -- Match Analysis
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    matching_reasons TEXT[],
    potential_valuation_range TEXT,
    funding_stage TEXT,
    
    -- Investor Profiles
    investor_profiles JSONB DEFAULT '[]'::jsonb,
    
    -- Analysis Results
    investor_interest_level TEXT CHECK (investor_interest_level IN ('low', 'medium', 'high', 'very_high')),
    competitive_advantage TEXT,
    market_differentiators TEXT[],
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.investor_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read investor matches for their own projects
CREATE POLICY "Users can read their own investor matches"
    ON public.investor_matches
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = investor_matches.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Users can insert investor matches for their own projects
CREATE POLICY "Users can insert their own investor matches"
    ON public.investor_matches
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = investor_matches.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Users can update their own investor matches
CREATE POLICY "Users can update their own investor matches"
    ON public.investor_matches
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = investor_matches.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Users can delete their own investor matches
CREATE POLICY "Users can delete their own investor matches"
    ON public.investor_matches
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = investor_matches.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_investor_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_investor_matches_updated_at
    BEFORE UPDATE ON public.investor_matches
    FOR EACH ROW
    EXECUTE FUNCTION update_investor_matches_updated_at();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investor_matches_idea_id ON public.investor_matches(idea_id);
CREATE INDEX IF NOT EXISTS idx_investor_matches_project_id ON public.investor_matches(project_id);
CREATE INDEX IF NOT EXISTS idx_investor_matches_created_at ON public.investor_matches(created_at);