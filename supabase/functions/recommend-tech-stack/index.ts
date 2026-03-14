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
    const { project_id, idea_id, idea_details } = await req.json();
    
    // Generate tech stack recommendations using TogetherAI
    const apiKey = Deno.env.get("TOGETHER_API_KEY");
    if (!apiKey) {
      throw new Error("TOGETHER_API_KEY environment variable is not set");
    }

    const prompt = `Recommend a complete tech stack for a startup idea:

Idea Details:
${JSON.stringify(idea_details, null, 2)}

Please provide recommendations in JSON format with this structure:
{
  "frontend_framework": {
    "recommendation": "string",
    "confidence": "number",
    "reasoning": "string",
    "alternatives": ["string"]
  },
  "backend_framework": {
    "recommendation": "string",
    "confidence": "number",
    "reasoning": "string",
    "alternatives": ["string"]
  },
  "database": {
    "recommendation": "string",
    "confidence": "number",
    "reasoning": "string",
    "alternatives": ["string"]
  },
  "infrastructure": {
    "recommendation": "string",
    "confidence": "number",
    "reasoning": "string",
    "alternatives": ["string"]
  },
  "tools": {
    "recommendation": ["string"],
    "confidence": "number",
    "reasoning": "string"
  },
  "confidence_score": "number",
  "complexity_level": "string",
  "estimated_cost": "string",
  "timeline_estimate": "string"
}

Focus on modern, startup-friendly technologies that are easy to scale.`;

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
          max_tokens: 2500,
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`TogetherAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const recommendationContent = data.choices[0].message.content;
      const techStackRecommendation = JSON.parse(recommendationContent);

      return new Response(
        JSON.stringify(techStackRecommendation),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error) {
      console.error("TogetherAI API error:", error);
      // Fallback to mock data if AI call fails
      const mockRecommendation = {
        frontend_framework: {
          recommendation: "Next.js",
          confidence: 85,
          reasoning: "Perfect for startup MVPs with built-in SSR, API routes, and excellent developer experience",
          alternatives: ["React + Vite", "SvelteKit", "Nuxt.js"]
        },
        backend_framework: {
          recommendation: "Node.js + Express",
          confidence: 78,
          reasoning: "Fast development, large ecosystem, perfect for API-first startups",
          alternatives: ["Python + FastAPI", "Go + Gin", "Ruby on Rails"]
        },
        database: {
          recommendation: "PostgreSQL",
          confidence: 92,
          reasoning: "Reliable, scalable, perfect for structured startup data with Supabase integration",
          alternatives: ["MongoDB", "Supabase", "PlanetScale"]
        },
        infrastructure: {
          recommendation: "Vercel + Supabase",
          confidence: 88,
          reasoning: "Zero-config deployment, global CDN, perfect for startup scale",
          alternatives: ["Netlify + Supabase", "AWS Amplify", "Railway"]
        },
        tools: {
          recommendation: ["Tailwind CSS", "TypeScript", "Prisma", "Stripe"],
          confidence: 82,
          reasoning: "Modern development stack with type safety, styling utilities, and payment integration"
        },
        confidence_score: 85,
        complexity_level: "intermediate",
        estimated_cost: "$50-200/month (scales with usage)",
        timeline_estimate: "2-4 weeks for MVP"
      };
      
      return new Response(
        JSON.stringify(mockRecommendation),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate tech stack recommendations" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}