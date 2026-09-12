import fs from 'fs';
const files = [
  'src/components/TeamMatchSystem.tsx',
  'src/components/StickyWhatsApp.tsx',
  'src/pages/TalkToUsPage.tsx',
  'src/pages/ContactUs.tsx',
  'src/pages/LoanProductsIndex.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/254700000000/g, '254705759365');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed wa.me links');
