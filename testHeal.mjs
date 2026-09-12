import fs from 'fs';

let content = fs.readFileSync('src/components/TrustBadges.tsx', 'utf8');
const openCount = (content.match(/<div(?:[\s>].*?)?>/gs) || []).filter(m => !m.endsWith('/>')).length;
const closeCount = (content.match(/<\/div>/g) || []).length;

const missing = openCount - closeCount;
console.log("Missing:", missing);

if (missing > 0) {
    let replaced = false;
    content = content.replace(/<\/section>/, (match) => {
        replaced = true;
        let inject = '';
        for(let i=0; i<missing; i++) inject += '      </div>\n';
        return inject + match;
    });
    if(replaced) fs.writeFileSync('src/components/TrustBadges.tsx', content);
}
