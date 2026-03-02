import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const uiRoot = path.join(root, 'src/shared/ui');
const categories = ['primitives', 'composites'];

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const nameArg = args.find((arg) => !arg.startsWith('--'));
  const yes = args.includes('--yes');
  const categoryArg = args.find((arg) => arg.startsWith('--category='));
  const category = categoryArg ? categoryArg.split('=')[1] : null;

  if (!nameArg) {
    console.error('Usage: npm run remove:ui -- <ComponentNameOrFolder> [--category=primitives|composites] [--yes]');
    process.exit(1);
  }

  if (category !== null && !categories.includes(category)) {
    console.error(`Invalid category: ${category}. Allowed: primitives, composites`);
    process.exit(1);
  }

  return { nameArg, yes, category };
}

const { nameArg, yes, category } = parseArgs(process.argv);
const folderName = toKebabCase(nameArg);

const candidateCategories = category ? [category] : categories;
const matches = candidateCategories
  .map((currentCategory) => ({
    category: currentCategory,
    dir: path.join(uiRoot, currentCategory, folderName)
  }))
  .filter((item) => fs.existsSync(item.dir));

if (matches.length === 0) {
  const target = category ? `src/shared/ui/${category}/${folderName}` : `src/shared/ui/{primitives,composites}/${folderName}`;
  console.error(`Component folder not found: ${target}`);
  process.exit(1);
}

if (matches.length > 1) {
  console.error(
    `Component '${folderName}' exists in multiple categories. Re-run with --category=primitives or --category=composites.`
  );
  process.exit(1);
}

if (!yes) {
  console.error('Refusing to remove without explicit confirmation. Re-run with --yes');
  process.exit(1);
}

const target = matches[0];
fs.rmSync(target.dir, { recursive: true, force: true });
console.log(`Removed: src/shared/ui/${target.category}/${folderName}`);

const syncResult = spawnSync('node', ['scripts/sync-shared-ui-index.mjs'], {
  cwd: root,
  stdio: 'inherit'
});

if (syncResult.status !== 0) {
  process.exit(syncResult.status ?? 1);
}
