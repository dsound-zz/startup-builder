-- Business Plans Table
-- Stores generated business plans for startup ideas
CREATE TABLE IF NOT EXISTS public.business_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    -- Business Plan Sections
    executive_summary TEXT,
    company_description TEXT,
    market_analysis TEXT,
    organization_structure TEXT,
    product_service_description TEXT,
    marketing_strategy TEXT,
    sales_strategy TEXT,
    financial_projections TEXT,
    funding_requirements TEXT,
    exit_strategy TEXT,
    
    -- Analysis Results
    business_score INTEGER CHECK (business_score >= 0 AND business_score <= 100),
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'very_high')),
    growth_potential TEXT CHECK (growth_potential IN ('low', 'medium', 'high', 'very_high')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read business plans for their own projects
CREATE POLICY "Users can read their own business plans"
    ON public.business_plans
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = business_plans.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Users can insert business plans for their own projects
CREATE POLICY "Users can insert their own business plans"
    ON public.business_plans
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = business_plans.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Users can update their own business plans
CREATE POLICY "Users can update their own business plans"
    ON public.business_plans
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = business_plans.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Users can delete their own business plans
CREATE POLICY "Users can delete their own business plans"
    ON public.business_plans
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = business_plans.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_business_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_business_plans_updated_at
    BEFORE UPDATE ON public.business_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_business_plans_updated_at();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_plans_idea_id ON public.business_plans(idea_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_project_id ON public.business_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_created_at ON public.business_plans(created_at);