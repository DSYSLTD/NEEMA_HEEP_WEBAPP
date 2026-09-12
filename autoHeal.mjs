import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's attempt to fix the `</div>` collapse by a simpler heuristic:
  // If the parsing fails with unclosed `div`, maybe we can just use an LLM or Babel? No.
  
  // Actually, we can just look for instances where the indentation JUMPS abruptly.
  // But wait, the collapse removed `</div>\n </div>`.
  // The first `</div>` remained, the second was removed.
  // We can look at the output of `tsc` to find EXACTLY which files need fixing.
  
  // A much simpler fix: The original regex was:
  // content.replace(/<\/div>\s*<\/div>/g, '</div>')
  // This means it took two consecutive divs and made them one.
  // It only operated ONCE globally. It matched non-overlapping pairs.
  // So any `</div>\s*</div>` became `</div>`.
  // Could we figure out where we did this? No, it's irreversible text loss.
});
console.log("Script loaded");
