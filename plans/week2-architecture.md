# Week 2: Core AI Features - Architecture Design

## System Architecture

```mermaid
flowchart TD
    UI[Next.js Frontend] -->|invoke| EF[Supabase Edge Functions]
    EF -->|API calls| AI[TogetherAI/DeepSeek]
    EF -->|store| DB[Supabase Database]
    
    subgraph Edge Functions
        EF1[generate-ideas]
        EF2[validate-idea] 
        EF3[recommend-tech-stack]
    end
    
    subgraph Database
        IDEAS[ideas table]
        TECH[tech_stacks table]
        PROJECTS[projects table]
    end
    
    EF1 --> IDEAS
    EF2 --> IDEAS
    EF3 --> TECH
```

## Edge Function Flow

```mermaid
sequenceDiagram
    participant UI as Next.js UI
    participant EF as Edge Function
    participant AI as TogetherAI
    participant DB as Supabase DB
    
    UI->>EF: POST /functions/v1/generate-ideas
    EF->>AI: Call OpenAI-compatible API
    AI-->>EF: Streamed response
    EF-->>UI: SSE streaming
    EF->>DB: Store generated idea
```

## Database Schema Additions

### tech_stacks Table
```sql
CREATE TABLE tech_stacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
    
    -- Recommended technologies
    frontend_framework JSONB,
    backend_framework JSONB,
    database JSONB,
    infrastructure JSONB,
    tools JSONB,
    
    -- Scoring & metadata
    confidence_score INTEGER,
    complexity_level TEXT,
    estimated_cost TEXT,
    timeline_estimate TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

### Edge Functions
- `generate-ideas`: Takes project context, generates startup ideas
- `validate-idea`: Evaluates and scores existing ideas  
- `recommend-tech-stack`: Recommends technical stack based on idea

### Frontend Routes
- `/ideas`: List, generate, and manage ideas
- `/ideas/[id]`: Detailed idea view with validation
- `/tech-stack/[project_id]`: Tech recommendations

## Key Implementation Patterns

- **SSE Streaming**: Real-time AI response streaming
- **TanStack Query**: Consistent data fetching patterns
- **RLS Policies**: Secure data access
- **Edge Function Secrets**: Secure AI API keys
- **TypeScript**: Full type safety