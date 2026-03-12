// Simple Edge Function template
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers:    corsHeaders });
  }

  try {
    const { project_id, idea_id, idea_details } = await req.json();
    
    // Mock tech stack recommendations
    const techStackRecommendation = {
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

    // Return tech stack recommendation
    return new Response(
      JSON.stringify(techStackRecommendation),
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
      JSON.stringify({ error: "Failed to generate tech stack recommendation" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}