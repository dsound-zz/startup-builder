// Simple Edge Function template

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
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

Return a JSON object with the following structure:
{
  "ideas": [
    {
      "title": "string",
      "problem": "string",
      "solution": "string",
      "target_audience": "string",
      "unique_value_proposition": "string",
      "market_size": "string",
      "revenue_model": "string"
    }
  ]
}

Return ONLY the JSON object, no markdown, no code fences, no additional text.`;

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
      
      // Use OpenAI-compatible endpoint for TogetherAI
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",  // Using faster, more reliable model
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.7,
          top_k: 50,
          repetition_penalty: 1
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`TogetherAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const ideasContent = data.choices[0].message.content;
      
      // Clean up AI response - strip markdown code fences if present
      let cleanContent = ideasContent.trim();
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      
      const ideasData = JSON.parse(cleanContent);
      
      // Handle both array format and {ideas: [...]} format
      const ideas = Array.isArray(ideasData) ? ideasData : (ideasData.ideas || []);

      console.log(`Successfully generated ${ideas.length} ideas from TogetherAI`);

      return new Response(
        JSON.stringify({ ideas }),
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
})