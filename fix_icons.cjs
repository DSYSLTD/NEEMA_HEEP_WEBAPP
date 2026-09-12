const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern for subtitle changes:
    const pillRegex = /className=\"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-\[#004D40\]\/5 border border-\[#004D40\]\/10 text-\[#004D40\] text-xs font-bold tracking-widest uppercase mb-6\">\s*(<span className=\"w-2 h-2 rounded-full bg-\[#32CD32\]\" \/>|<[A-Za-z]+ className=\"[^\"]*w-4 h-4 text-\[#32CD32\]\" \/>)\s*([^<]+)\s*<\/(div|motion\.div)>/g;
    
    content = content.replace(pillRegex, (match, icon, text, tag) => {
        return `className="inline-flex items-center gap-3 justify-center mb-6">
            <span className="w-8 h-1 bg-[#32CD32] rounded-full"></span>
            <span className="text-[#32CD32] font-black tracking-[0.2em] text-xs uppercase block">${text.trim()}</span>
            <span className="w-8 h-1 bg-[#32CD32] rounded-full"></span>
          </${tag}>`;
    });

    // Pattern for icon icons only:
    // Regex matches <IconName className="w-... h-... text-[#32CD32|#004D40]" />
    // We update text-[#32CD32] or text-[#004D40] to text-[#D4AF37] IF it's an icon.
    // We guess it's an icon if the component name starts with uppercase and contains w- and h- classes.
    const iconRegex = /<([A-Z][a-zA-Z0-9]*)\s+([^>]*className="[^"]*w-[0-9][^"]*h-[0-9][^"]*)text-\[#(32CD32|004D40)\]([^"]*"[^>]*)>/g;
    
    content = content.replace(iconRegex, (match, tag, beforeClass, color, afterClass) => {
        return `<${tag} ${beforeClass}text-[#D4AF37]${afterClass}>`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated file:', file);
    }
});
