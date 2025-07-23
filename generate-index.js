#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the Vite manifest to get the correct asset file names
const manifestPath = path.join(__dirname, 'build/client/.vite/manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('Manifest file not found at:', manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Find the entry point files
const entryClient = Object.values(manifest).find(entry => 
  entry.src && entry.src.includes('entry.client')
);

const rootEntry = Object.values(manifest).find(entry => 
  entry.src && entry.src.includes('root.tsx')
);

// Get the CSS file
const cssFile = rootEntry?.css?.[0] || Object.values(manifest)
  .flatMap(entry => entry.css || [])
  .find(css => css.includes('root'));

console.log('Entry client file:', entryClient?.file);
console.log('Root CSS file:', cssFile);

// Generate the HTML
const entryFile = entryClient ? entryClient.file : 'assets/entry.client.js';
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Holistic Wellness Services</title>
    <meta name="description" content="Discover our comprehensive range of holistic wellness services including reiki healing, yoga sessions, nutrition guidance, and more." />
    ${cssFile ? `<link rel="stylesheet" href="/ecom-services/${cssFile}">` : ''}
    <script type="text/javascript">
      // Handle client-side routing for GitHub Pages
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/ecom-services/${entryFile}"></script>
  </body>
</html>`;

// Write the index.html file
const indexPath = path.join(__dirname, 'build/client/index.html');
fs.writeFileSync(indexPath, html);

// Copy 404.html and .nojekyll files if they exist
const copyFiles = ['404.html', '.nojekyll'];
copyFiles.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(__dirname, 'build/client', file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to build directory`);
  } else {
    console.log(`${file} not found in root directory`);
  }
});

console.log('Generated index.html with proper asset references');
