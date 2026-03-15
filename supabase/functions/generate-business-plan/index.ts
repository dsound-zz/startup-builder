// generate-business-plan/index.ts
// Edge Function to generate a comprehensive business plan using TogetherAI

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types
interface BusinessPlanData {
  executive_summary: string;
  company_description: string;
  market_analysis: string;
  organization_structure: string;
  product_service_description: string;
  marketing_strategy: string;
  sales_strategy: string;
  financial_projections: string;
  funding_requirements: string;
  exit_strategy: string;
  business_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'very_high';
  growth_potential: 'low' | 'medium' | 'high' | 'very_high';
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
  };
}

// Configuration
const TOGETHER_AI_MODEL = 'meta-llama/Llama-3.3-70B-Instruct-Turbo';

// Helper function to call TogetherAI
async function callTogetherAI(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('TOGETHER_API_KEY');
  if (!apiKey) {
    throw new Error('TOGETHER_API_KEY environment variable is not set');
  }
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TOGETHER_AI_MODEL,
      messages: [
        {
          role: 'system',
          content: "You are an expert business plan consultant. Provide detailed, professional business plan sections."
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`TogetherAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// Helper function to extract JSON from text
function extractJson(text: string): BusinessPlanData {
  try {
    // Try to find JSON in the text
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonStr = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    // If JSON extraction fails, create a basic response
  }
  
  // Default response if parsing fails
  return {
    executive_summary: text,
    company_description: '',
    market_analysis: '',
    organization_structure: '',
    product_service_description: '',
    marketing_strategy: '',
    sales_strategy: '',
    financial_projections: '',
    funding_requirements: '',
    exit_strategy: '',
    business_score: 50,
    risk_level: 'medium',
    growth_potential: 'medium',
  };
}

// Main handler
Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { idea_data } = await req.json();

    if (!idea_data) {
      return new Response(
        JSON.stringify({ error: 'idea_data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate business plan sections using AI
    const prompt = `Generate a comprehensive business plan for this startup idea:

Idea: ${idea_data.title}
Description: ${idea_data.description}
Problem: ${idea_data.problem}
Solution: ${idea_data.solution}
Target Market: ${idea_data.target_market}
Unique Value Proposition: ${idea_data.unique_value_proposition}

Please provide a detailed business plan in JSON format with this structure:
{
  "executive_summary": "A compelling summary of the business opportunity",
  "company_description": "Description of the company and its mission",
  "market_analysis": "Analysis of the target market and industry",
  "organization_structure": "Proposed organizational structure",
  "product_service_description": "Detailed description of products/services",
  "marketing_strategy": "Marketing and customer acquisition strategy",
  "sales_strategy": "Sales approach and process",
  "financial_projections": "3-5 year financial projections",
  "funding_requirements": "Funding needed and use of funds",
  "exit_strategy": "Potential exit strategies for investors",
  "business_score": 75,
  "risk_level": "low|medium|high|very_high",
  "growth_potential": "low|medium|high|very_high"
}`;

    const businessPlanText = await callTogetherAI(prompt);
    const businessPlanData = extractJson(businessPlanText);

    return new Response(
      JSON.stringify({
        success: true,
        data: businessPlanData
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating business plan:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate business plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})