import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const uiRoot = path.join(root, 'src/shared/ui');
const rootIndexPath = path.join(uiRoot, 'index.ts');
const categories = ['primitives', 'composites'];

function listComponentDirs(categoryDir) {
  if (!fs.existsSync(categoryDir)) return [];
  return fs
    .readdirSync(categoryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(categoryDir, name, 'index.ts')))
    .sort((a, b) => a.localeCompare(b));
}

let changed = false;

for (const category of categories) {
  const categoryDir = path.join(uiRoot, category);
  fs.mkdirSync(categoryDir, { recursive: true });

  const categoryIndexPath = path.join(categoryDir, 'index.ts');
  const lines = listComponentDirs(categoryDir).map((name) => `export * from './${name}';`);
  const next = `${lines.join('\n')}\n`;
  const prev = fs.existsSync(categoryIndexPath) ? fs.readFileSync(categoryIndexPath, 'utf8') : '';

  if (prev !== next) {
    fs.writeFileSync(categoryIndexPath, next, 'utf8');
    changed = true;
    console.log(`Updated shared/ui/${category}/index.ts`);
  }
}

const rootLines = categories.map((category) => `export * from './${category}';`);
const rootNext = `${rootLines.join('\n')}\n`;
const rootPrev = fs.existsSync(rootIndexPath) ? fs.readFileSync(rootIndexPath, 'utf8') : '';

if (rootPrev !== rootNext) {
  fs.writeFileSync(rootIndexPath, rootNext, 'utf8');
  changed = true;
  console.log('Updated shared/ui/index.ts');
}

if (!changed) {
  console.log('shared/ui index files are up to date.');
}
