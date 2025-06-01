import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src', 'components');
const pagesDir = path.join(__dirname, 'src', 'pages');

// Function to update imports in a file
function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    // Update imports like: import AdBanner from '../../layout/AdBanner';
    const updatedContent = content.replace(
      /import AdBanner from ['"]\.\.\/layout\/AdBanner['"];/g,
      "import AdBanner from '../../components/layout/AdBanner';"
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated imports in ${path.relative(process.cwd(), filePath)}`);
      return 1;
    }
    return 0;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return 0;
  }
}

// Function to process all files in a directory
function processDirectory(directory) {
  let updatedFiles = 0;
  
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      updatedFiles += processDirectory(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      updatedFiles += updateImports(fullPath);
    }
  });
  
  return updatedFiles;
}

// Process both components and pages directories
let totalUpdated = 0;
totalUpdated += processDirectory(componentsDir);
totalUpdated += processDirectory(pagesDir);

console.log(`\n✅ Updated ${totalUpdated} files with correct AdBanner import paths.`);
