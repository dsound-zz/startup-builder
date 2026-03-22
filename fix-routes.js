const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'apps', 'web', 'app', 'api');
const routes = [
  'generate-ideas',
  'validate-idea',
  'generate-business-plan',
  'generate-investor-matches',
  'recommend-tech-stack'
];

for (const route of routes) {
  const file = path.join(apiDir, route, 'route.ts');
  if (!fs.existsSync(file)) continue;
  
  let code = fs.readFileSync(file, 'utf8');
  
  // Fix the top part
  //  try {
  //
  //  // Handle CORS
  //  );
  //  }
  //
  //  try {
  code = code.replace(/try\s*\{\s*\/\/\s*Handle\s*CORS\s*\);\s*}\s*try\s*\{/g, 'try {');

  // Also replace weird broken catch blocks at the bottom
  code = code.replace(/\} catch \(error\) \{\n    return NextResponse\.json\(\{ error: "Internal Server Error" \}, \{ status: 500 \}\);\n  \}\n\}/g, '}');

  // generate-business-plan has: process.env.'TOGETHER_API_KEY')
  code = code.replace(/process\.env\.'TOGETHER_API_KEY'\)/g, 'process.env.TOGETHER_API_KEY');

  // and stray `);` or similar based on errors ?
  // app/api/generate-business-plan/route.ts:168:26 - error TS1005: ')' expected.
  //       }, { status: 500 });
  code = code.replace(/return new Response\([\s\n]*JSON\.stringify\(\{\s*error:\s*"Failed to generate business plan"\s*\}\)[\s\n]*\);/g, 'return NextResponse.json({ error: "Failed to generate business plan" }, { status: 500 });');

  fs.writeFileSync(file, code);
  console.log(`Fixed ${route}`);
}
