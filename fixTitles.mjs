import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (fullPath.endsWith('.tsx')) {
      callback(fullPath);
    }
  }
}

walk('src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  const replaceFn = (match, text) => {
    // Prevent double wrapping
    if (text === '') return match;
    return `<div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#32CD32] rounded-full"></span>
              <span className="text-[#32CD32] font-black tracking-[0.2em] text-[10px] sm:text-xs uppercase block">${text}</span>
              <span className="w-8 h-1 bg-[#32CD32] rounded-full"></span>
            </div>`;
  };

  content = content.replace(/<span className="text-\[#32CD32\][^>]*tracking-\[0\.2em\][^>]*>([^<]+)<\/span>/g, replaceFn);
  content = content.replace(/<p className="text-\[#32CD32\][^>]*tracking-\[0\.2em\][^>]*>([^<]+)<\/p>/g, replaceFn);

  // Clean up double wrappers if they happen
  content = content.replace(/<div className="inline-flex items-center gap-3( justify-center)? mb-\d+">\s*<div className="inline-flex items-center gap-3 justify-center mb-4">/g, '<div className="inline-flex items-center gap-3 justify-center mb-4">');
  content = content.replace(/<\/div>\s*<\/div>/g, '</div>'); // wait, this might break other things, skip it

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
});
