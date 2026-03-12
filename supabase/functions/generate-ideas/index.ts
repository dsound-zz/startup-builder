// Simple Edge Function template
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { project_id, context } = await req.json();
    
    // For now, return mock data - will be replaced with actual API call
    const mockIdeas = [
      {
        title: "AI-Powered Market Research Platform",
        problem: "Startups struggle with comprehensive market research and competitor analysis",
        solution: "AI-driven platform that automatically analyzes markets, competitors, and trends",
        target_audience: "Entrepreneurs, startup founders, market researchers",
        unique_value_proposition: "Real-time market intelligence with predictive analytics",
        market_size: "$15B+ market research industry",
        revenue_model: "Subscription SaaS with enterprise pricing"
      },
      {
        title: "Automated Customer Validation Tool",
        problem: "Founders waste time manually validating startup ideas with potential customers",
        solution: "Platform that automates customer interviews and provides validation metrics",
        target_audience: "Early-stage startups, product managers",
        unique_value_proposition: "AI-powered customer discovery with automated insights",
        market_size: "Growing validation-as-a-service market",
        revenue_model: "Pay-per-validation and monthly subscriptions"
      },
      {
        title: "Startup Funding Matchmaker",
        problem: "Startups struggle to find the right investors for their specific industry and stage",
               solution: "AI-powered platform that matches startups with ideal investors",
        target_audience: "Seed-stage startups, angel investors, VCs",
        unique_value_proposition: "Intelligent matching based on industry, stage, and founder background",
        market_size: "Global venture capital market",
        revenue_model: "Success-based fees and premium matching services"
      }
    ];

    // Return mock ideas
    return new Response(
      JSON.stringify({ ideas: mockIdeas }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate ideas" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}