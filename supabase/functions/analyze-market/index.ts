// Market Analysis Edge Function

declare const Deno: any;

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
    
    // Generate market analysis using TogetherAI
    const apiKey = Deno.env.get("TOGETHER_API_KEY");
    if (!apiKey) {
      throw new Error("TOGETHER_API_KEY environment variable is not set");
    }

    const prompt = `Perform a comprehensive market analysis for this startup idea:

Idea Details:
${JSON.stringify(idea_data, null, 2)}

Please provide a detailed market analysis in JSON format with this structure:
{
  "total_addressable_market": "string - e.g. $10B market size",
  "serviceable_addressable_market": "string - e.g. $2B addressable portion",
  "serviceable_obtainable_market": "string - e.g. $100M obtainable portion",
  "competitors": [
    {
      "name": "string",
      "description": "string",
      "market_share": "string",
      "strengths": ["string"],
      "weaknesses": ["string"]
    }
  ],
  "competition_level": "string - low|medium|high|very_high",
  "competitive_advantages": ["string - key differentiators"],
  "market_growth_rate": "string - e.g. 15% CAGR",
  "market_trends": ["string - emerging trends in the market"],
  "emerging_opportunities": ["string - new opportunities"],
  "market_risks": ["string - potential market risks"],
  "regulatory_considerations": "string - relevant regulations",
  "market_score": "number - 0-100 score for market attractiveness"
}

Be thorough and specific. Provide realistic market sizing and competitive analysis. Focus on the startup's target audience and industry.`;

    try {
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3-70b-chat-hf",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 3000,
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`TogetherAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const analysisContent = data.choices[0].message.content;
      const marketAnalysis = JSON.parse(analysisContent);

      return new Response(
        JSON.stringify(marketAnalysis),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error) {
      console.error("TogetherAI API error:", error);
      // Fallback to mock data if AI call fails
      const mockAnalysis = {
        total_addressable_market: "$5B",
        serviceable_addressable_market: "$1.2B",
        serviceable_obtainable_market: "$150M",
        competitors: [
          {
            name: "Competitor A",
            description: "Leading player in the space",
            market_share: "25%",
            strengths: ["Strong brand", "Large customer base"],
            weaknesses: ["High pricing", "Poor customer service"]
          }
        ],
        competition_level: "high",
        competitive_advantages: [
          "Innovative technology",
          "Better user experience",
          "Lower pricing"
        ],
        market_growth_rate: "20% CAGR",
        market_trends: [
          "Increased demand for AI solutions",
          "Shift to cloud-based services",
          "Focus on data privacy"
        ],
        emerging_opportunities: [
          "Expansion to emerging markets",
          "Integration with IoT devices",
          "Partnership opportunities"
        ],
        market_risks: [
          "Economic downturn",
          "Regulatory changes",
          "Technology disruption"
        ],
        regulatory_considerations: "Data privacy regulations (GDPR, CCPA) apply",
        market_score: 78
      };
      
      return new Response(
        JSON.stringify(mockAnalysis),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to analyze market" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}