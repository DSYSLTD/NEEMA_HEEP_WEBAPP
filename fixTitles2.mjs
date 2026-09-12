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

  // 1. Remove ANY and ALL nested weird wrappers that we created around the text.
  // The core text is between `<span className="text-[#32CD32] font-black tracking-[0.2em] text-[10px] sm:text-xs uppercase block">` and `</span>`
  // We want to replace ANY surrounding `<div className="inline-flex items-center gap-3...` stuff with just one clean wrapper.
  
  // A regular expression that finds our standard replacement:
  const standardReplacementRegex = /<div className="inline-flex items-center gap-3 justify-center mb-4">\s*<span className="w-8 h-1 bg-\[#32CD32\] rounded-full"><\/span>\s*<span className="text-\[#32CD32\] font-black tracking-\[0\.2em\] text-\[10px\] sm:text-xs uppercase block">([^<]+)<\/span>\s*<span className="w-8 h-1 bg-\[#32CD32\] rounded-full"><\/span>\s*<\/div>/g;

  // Wait, let's reverse the bad replaces first.
  content = content.replace(/<div className="inline-flex[^>]*>\s*<span className="w-8 h-1 bg-\[#32CD32\] rounded-full"><\/span>\s*(<span className="text-\[#32CD32\][^>]+>[^<]+<\/span>)\s*<span className="w-8 h-1 bg-\[#32CD32\] rounded-full"><\/span>\s*<\/div>/g, '$1');
  
  content = content.replace(/<div className="inline-flex[^>]*>\s*<span className="w-8 h-1 bg-\[#32CD32\] rounded-full"><\/span>\s*(<span className="text-\[#32CD32\][^>]+>[^<]+<\/span>)\s*<\/div>/g, '$1');
  
  // also handle the case from our script:
  content = content.replace(/<div className="inline-flex items-center gap-3 justify-center mb-4">\s*<span className="w-8 h-1 bg-\[#32CD32\] rounded-full"><\/span>\s*<span className="text-\[#32CD32\] font-black tracking-\[0\.2em\] text-\[10px\] sm:text-xs uppercase block">([^<]+)<\/span>\s*<span className="w-8 h-1 bg-\[#32CD32\] rounded-full"><\/span>\s*<\/div>/g, '<span className="text-[#32CD32] font-black tracking-[0.2em] text-[10px] sm:text-xs uppercase block">$1</span>');

  // Now ALL our strings are back to `<span className="text-[#32CD32] ... block">TEXT</span>`
  // Wait, what about `<p className="text-[#32CD32] uppercase tracking-[0.2em] ...>TEXT</p>` ? 
  // Let's replace those with standard spans.
  content = content.replace(/<p className="text-\[#32CD32\][^>]*tracking-\[0\.2em\][^>]*>([^<]+)<\/p>/g, '<span className="text-[#32CD32] font-black tracking-[0.2em] text-[10px] sm:text-xs uppercase block">$1</span>');
  
  // AND the original spans
  content = content.replace(/<span className="text-\[#32CD32\] font-black tracking-\[0\.2em\][^>]*>([^<]+)<\/span>/g, '<span className="text-[#32CD32] font-black tracking-[0.2em] text-xs uppercase block">$1</span>');

  // Now ANY element that matches `<span className="text-[#32CD32] font-black tracking-[0.2em] text-xs uppercase block">([^<]+)</span>`
  // will be wrapped in the correct wrapper.
  
  const replaceFn = (match, text) => {
    return `<div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#32CD32] rounded-full"></span>
              <span className="text-[#32CD32] font-black tracking-[0.2em] text-xs uppercase block">${text}</span>
              <span className="w-8 h-1 bg-[#32CD32] rounded-full"></span>
            </div>`;
  };

  content = content.replace(/<span className="text-\[#32CD32\] font-black tracking-\[0\.2em\] text-\[10px\] sm:text-xs uppercase block">([^<]+)<\/span>/g, '<span className="text-[#32CD32] font-black tracking-[0.2em] text-xs uppercase block">$1</span>');

  content = content.replace(/<span className="text-\[#32CD32\] font-black tracking-\[0\.2em\] text-xs uppercase block">([^<]+)<\/span>/g, replaceFn);


  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
  }
});
