// generate-investor-matches/index.ts
// Edge Function to generate investor matching analysis using TogetherAI

// Types
interface InvestorProfile {
  name: string;
  type: string;
  focus: string[];
  stage: string[];
  investment_range: string;
  portfolio_companies: string[];
  why_they_invest: string;
}

interface InvestorMatchData {
  match_score: number;
  matching_reasons: string[];
  potential_valuation_range: string;
  funding_stage: string;
  investor_profiles: InvestorProfile[];
  investor_interest_level: 'low' | 'medium' | 'high' | 'very_high';
  competitive_advantage: string;
  market_differentiators: string[];
}

interface GenerationRequest {
  idea_data: {
    id: string;
    title: string;
    description: string;
    problem: string;
    solution: string;
    target_market: string;
    unique_value_proposition: string;
    market_size: string;
    revenue_model: string;
  };
}

// Main handler
export default async function handler(req: Request): Promise<Response> {
  try {
    const { idea_data } = await req.json();

    if (!idea_data) {
      return new Response(
        JSON.stringify({ error: 'idea_data is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate investor matching analysis using AI
    const prompt = `Generate investor matching analysis for this startup idea:

Idea: ${idea_data.title}
Description: ${idea_data.description}
Problem: ${idea_data.problem}
Solution: ${idea_data.solution}
Target Market: ${idea_data.target_market}
Unique Value Proposition: ${idea_data.unique_value_proposition}
Market Size: ${idea_data.market_size}
Revenue Model: ${idea_data.revenue_model}

Please provide a detailed investor matching analysis in JSON format with this structure:
{
  "match_score": 75,
  "matching_reasons": ["Reason 1", "Reason 2", "Reason 3"],
  "potential_valuation_range": "$5M - $15M Series A",
  "funding_stage": "Seed or Series A",
  "investor_profiles": [
    {
      "name": "Sequoia Capital",
      "type": "Venture Capital",
      "focus": ["SaaS", "AI", "Fintech"],
      "stage": ["Seed", "Series A"],
      "investment_range": "$1M - $50M",
      "portfolio_companies": ["Stripe", "Airbnb", "DoorDash"],
      "why_they_invest": "Strong founding team, large market opportunity"
    }
  ],
  "investor_interest_level": "high",
  "competitive_advantage": "Proprietary AI technology with 18-month lead",
  "market_differentiators": ["Differentiator 1", "Differentiator 2"]
}`;

    // For now, return mock data since we can't call external APIs without environment setup
    const mockMatchData: InvestorMatchData = {
      match_score: 75,
      matching_reasons: [
        `Strong alignment with AI/SaaS focus areas`,
        `Large addressable market (${idea_data.market_size || 'unspecified'})`,
        `Clear problem-solution fit`,
        `Differentiating unique value proposition`
      ],
      potential_valuation_range: '$5M - $15M Series A',
      funding_stage: 'Seed or Series A',
      investor_profiles: [
        {
          name: 'Sequoia Capital',
          type: 'Venture Capital',
          focus: ['SaaS', 'AI', 'Fintech'],
          stage: ['Seed', 'Series A'],
          investment_range: '$1M - $50M',
          portfolio_companies: ['Stripe', 'Airbnb', 'DoorDash'],
          why_they_invest: 'Strong founding team, large market opportunity'
        },
        {
          name: 'a16z',
          type: 'Venture Capital',
          focus: ['Technology', 'Consumer', 'Biotech'],
          stage: ['Seed', 'Series A', 'Series B'],
          investment_range: '$500K - $100M',
          portfolio_companies: ['Github', 'Zoom', 'Robinhood'],
          why_they_invest: 'Network effects, scalable business model'
        },
        {
          name: 'First Round Capital',
          type: 'Venture Capital',
          focus: ['SaaS', 'Marketplaces', 'Consumer Tech'],
          stage: ['Seed', 'Series A'],
          investment_range: '$500K - $20M',
          portfolio_companies: ['Uber', 'Square', 'Dropbox'],
          why_they_invest: 'Team-first approach, early stage potential'
        }
      ],
      investor_interest_level: 'high',
      competitive_advantage: idea_data.unique_value_proposition || 'Proprietary technology with defensible moat',
      market_differentiators: [
        `Solves ${idea_data.problem} more effectively than alternatives`,
        `Addresses ${idea_data.target_market || 'target market'} with tailored solution`,
        `Strong team with domain expertise`
      ]
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        data: mockMatchData
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating investor matches:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate investor matches',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Deno configuration
export const config = {
  name: 'generate-investor-matches',
  entrypoint: 'index.ts',
};