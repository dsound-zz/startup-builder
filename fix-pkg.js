const fs = require('fs');
const pkgPath = 'apps/web/package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Delete the typo key and merge it correctly into devDependencies
const typoReqs = pkg["dev极ependencies"];
if (typoReqs) {
  for (const [k, v] of Object.entries(typoReqs)) {
    pkg.devDependencies[k] = v;
  }
  delete pkg["dev极ependencies"];
}

// Remove Tailwind v4 and explicitly use v3
delete pkg.devDependencies['@tailwindcss/postcss'];
pkg.devDependencies['tailwindcss'] = '^3.4.17';
pkg.devDependencies['postcss'] = '^8.4.35';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// Also revert postcss.config.js
fs.writeFileSync('apps/web/postcss.config.js', `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`);
