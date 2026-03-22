const fs = require('fs');
const path = require('path');

const functionsDir = path.join(__dirname, 'supabase', 'functions');
const apiDir = path.join(__dirname, 'apps', 'web', 'app', 'api');

const functions = [
  'recommend-tech-stack',
  'generate-ideas',
  'validate-idea',
  'generate-business-plan',
  'generate-investor-matches'
];

for (const fn of functions) {
  const indexTsPath = path.join(functionsDir, fn, 'index.ts');
  if (!fs.existsSync(indexTsPath)) {
    console.log(`Skipping ${fn}, not found.`);
    continue;
  }
  
  let content = fs.readFileSync(indexTsPath, 'utf8');
  
  // Basic replacements
  content = content.replace(/import { corsHeaders } from '..\/_shared\/cors.ts'/g, '');
  content = content.replace(/declare const Deno: any;/g, '');
  content = content.replace(/Deno\.env\.get\(/g, 'process.env.');
  content = content.replace(/Deno\.serve\(async \(req: Request\) => {/g, 'import { NextResponse } from "next/server";\n\nexport async function POST(req: Request) {\n  try {\n');
  
  // Replace response blocks
  // new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }) 
  // -> NextResponse.json(data)
  content = content.replace(/return new Response\([\s\n]*JSON\.stringify\((.*?)\),[\s\n]*\{[\s\n]*status: 200.*?\}[\s\n]*\);?/sg, 'return NextResponse.json($1);');
  
  // new Response(JSON.stringify({ error: ... }), { status: 500, headers: ... })
  // -> NextResponse.json({ error: ... }, { status: 500 })
  content = content.replace(/return new Response\([\s\n]*JSON\.stringify\((.*?)\),[\s\n]*\{[\s\n]*status: (\d+).*?\}[\s\n]*\);?/sg, 'return NextResponse.json($1, { status: $2 });');
  
  // Any leftover cors headers
  content = content.replace(/if \(req\.method === "OPTIONS"\)[^{]*{[^}]*}/g, '');
  content = content.replace(/const corsHeaders = [^;]*;/g, '');
  // Deno.env.get("TOGETHER_API_KEY") becomes process.env.TOGETHER_API_KEY
  content = content.replace(/process\.env\."(.*)"\)/g, 'process.env.$1');

  // close the try block at the end
  content = content.replace(/}\)[\n\s]*$/g, '} catch (error) {\n    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });\n  }\n}');

  const destDir = path.join(apiDir, fn);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'route.ts'), content);
  console.log(`Converted ${fn}`);
}
