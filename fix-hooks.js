const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, 'apps', 'web', 'lib', 'hooks');
const files = [
  'use-tech-stack.ts',
  'use-ideas.ts',
  'use-business-plan.ts',
  'use-investor-matches.ts'
];

for (const file of files) {
  const filePath = path.join(hooksDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let code = fs.readFileSync(filePath, 'utf8');

  // We are looking for something like:
  // const { data: varData, error: varError } = await supabase.functions.invoke('func-name', {
  //   body: { ... }
  // })
  
  // Let's replace line by line or with a regex
  code = code.replace(/const\s+\{\s*data:\s*([\w]+)\s*(?:,\s*error:\s*([\w]+)\s*)?\}\s*=\s*await\s+supabase\.functions\.invoke\('([^']+)',\s*\{\s*body:\s*(\{[^}]+\})\s*\}\)/g, 
    function(match, dataVar, errorVar, funcName, bodyJson) {
      errorVar = errorVar || 'error';
      return `const response = await fetch('/api/${funcName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(${bodyJson})
      });
      
      let ${dataVar}, ${errorVar} = null;
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        ${errorVar} = new Error(\`Failed to call ${funcName}: \${errData.error || response.statusText}\`);
      } else {
        const resJson = await response.json();
        // Some endpoints return { data: ... }, others return { ... } directly
        ${dataVar} = resJson.data !== undefined ? resJson.data : resJson;
      }`;
    }
  );

  fs.writeFileSync(filePath, code);
  console.log(`Fixed ${file}`);
}
