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
    const { idea_id, idea_data } = await req.json();
    
    // Mock validation scoring
    const validationScore = Math.floor(Math.random() * 40) + 60; // 60-100 score
    
    const validationResult = {
      score: validationScore,
      strengths: [
        "Strong market opportunity",
        "Clear target audience",
        "Innovative solution approach"
      ],
      weaknesses: [
        "High competition in this space",
        "Complex implementation required",
        "Customer acquisition challenges"
      ],
      recommendations: [
        "Focus on niche market first",
        "Validate with target customers",
        "Consider MVP approach"
      ],
      market_analysis: {
        total_addressable_market: "$2.5B",
        growth_rate: "15% CAGR",
        competition_level: "High",
        market_trends: ["AI integration", "Mobile-first", "Subscription models"]
      }
    };

    // Return validation result
    return new Response(
      JSON.stringify(validationResult),
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
      JSON.stringify({ error: "Failed to validate idea" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}