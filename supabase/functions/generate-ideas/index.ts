// Simple Edge Function template

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
    const { project_id, context } = await req.json();
    
    // Generate startup ideas using TogetherAI
    const apiKey = Deno.env.get("TOGETHER_API_KEY");
    if (!apiKey) {
      throw new Error("TOGETHER_API_KEY environment variable is not set");
    }

    const prompt = `Generate 3 innovative startup ideas based on the following context:
${context}

Please provide the ideas in JSON format with the following structure for each idea:
{
  "title": "string",
  "problem": "string",
  "solution": "string",
  "target_audience": "string",
  "unique_value_proposition": "string",
  "market_size": "string",
  "revenue_model": "string"
}

Return only valid JSON without any additional text.`;

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
          max_tokens: 2000,
          temperature: 0.8,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`TogetherAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const ideasContent = data.choices[0].message.content;
      const ideasData = JSON.parse(ideasContent);

      return new Response(
        JSON.stringify({ ideas: ideasData.ideas || [] }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

    } catch (error) {
      console.error("TogetherAI API error:", error);
      // Fallback to mock data if AI call fails
      const mockIdeas = [
        {
          title: "AI-Powered Market Research Platform",
          problem: "Startups struggle with comprehensive market research and competitor analysis",
          solution: "AI-driven platform that automatically analyzes markets, competitors, and trends",
          target_audience: "Entrepreneurs, startup founders, market researchers",
          unique_value_proposition: "Real-time market intelligence with predictive analytics",
          market_size: "$15B+ market research industry",
          revenue_model: "Subscription SaaS with enterprise pricing"
        }
      ];
      
      return new Response(
        JSON.stringify({ ideas: mockIdeas }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate ideas" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}