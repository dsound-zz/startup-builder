-- Create market_analyses table
CREATE TABLE public.market_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    -- Market sizing
    total_addressable_market TEXT,
    serviceable_addressable_market TEXT,
    serviceable_obtainable_market TEXT,
    
    -- Competition
    competitors JSONB DEFAULT '[]'::jsonb,
    competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high', 'very_high')),
    competitive_advantages JSONB DEFAULT '[]'::jsonb,
    
    -- Growth & trends
    market_growth_rate TEXT,
    market_trends JSONB DEFAULT '[]'::jsonb,
    emerging_opportunities JSONB DEFAULT '[]'::jsonb,
    
    -- Risks
    market_risks JSONB DEFAULT '[]'::jsonb,
    regulatory_considerations TEXT,
    
    -- Scoring
    market_score INTEGER CHECK (market_score >= 0 AND market_score <= 100),
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.market_analyses ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX market_analyses_idea_id_idx ON public.market_analyses(idea_id);
CREATE INDEX market_analyses_project_id_idx ON public.market_analyses(project_id);
CREATE INDEX market_analyses_created_at_idx ON public.market_analyses(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can view market analyses for their projects"
    ON public.market_analyses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = market_analyses.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create market analyses for their projects"
    ON public.market_analyses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = market_analyses.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update market analyses for their projects"
    ON public.market_analyses FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = market_analyses.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete market analyses for their projects"
    ON public.market_analyses FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = market_analyses.project_id
            AND projects.user_id = auth.uid()
        )
    );