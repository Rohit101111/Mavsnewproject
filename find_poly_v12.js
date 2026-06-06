import fs from 'fs';
import path from 'path';

function searchDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchDirectory(fullPath);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.jsx') || file.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('v-12') || content.toLowerCase().includes('v12')) {
          console.log(`Found match in: ${fullPath}`);
          // Print matching line
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes('v-12') || line.toLowerCase().includes('v12')) {
              console.log(`  L${idx+1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchDirectory('.');
