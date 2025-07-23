#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the Vite manifest to get the correct asset file names
const manifestPath = path.join(__dirname, 'build/client/.vite/manifest.json');
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

// Generate the HTML
const entryFile = entryClient ? entryClient.file : 'assets/entry.client.js';
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Holistic Wellness Services</title>
    <meta name="description" content="Discover our comprehensive range of holistic wellness services including reiki healing, yoga sessions, nutrition guidance, and more." />
    <link rel="icon" href="/ecom_template/favicon.ico" />
    ${cssFile ? `<link rel="stylesheet" href="/ecom_template/${cssFile}">` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/ecom_template/${entryFile}"></script>
  </body>
</html>`;

// Write the HTML file
fs.writeFileSync(path.join(__dirname, 'build/client/index.html'), html);
console.log('Generated index.html with assets:', { entryFile, cssFile });
