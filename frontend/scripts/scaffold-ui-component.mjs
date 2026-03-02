import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const uiRoot = path.join(root, 'src/shared/ui');
const categories = new Set(['primitives', 'composites']);

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const nameArg = args.find((arg) => !arg.startsWith('--'));
  const draft = args.includes('--draft') || args.includes('--wip') || !args.includes('--ready');

  const categoryArg = args.find((arg) => arg.startsWith('--category='));
  const categoryValue = categoryArg ? categoryArg.split('=')[1] : args.includes('--composite') ? 'composites' : 'primitives';

  if (!nameArg) {
    console.error(
      'Usage: npm run scaffold:ui -- <ComponentName> [--draft|--ready] [--category=primitives|composites|--composite]'
    );
    process.exit(1);
  }

  if (!categories.has(categoryValue)) {
    console.error(`Invalid category: ${categoryValue}. Allowed: primitives, composites`);
    process.exit(1);
  }

  return { nameArg, draft, category: categoryValue };
}

function writeFileSafe(filePath, content) {
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function createComponentTemplate(componentName) {
  return `import styles from './${componentName}.module.css';

export function ${componentName}() {
  return <div className={styles.root}>${componentName}</div>;
}
`;
}

function createCssTemplate() {
  return `.root {
  display: block;
}
`;
}

function createStoryTemplate(componentName, draft, category) {
  const categoryTitle = category === 'primitives' ? 'Primitives' : 'Composites';
  const titlePrefix = draft ? 'Draft/Shared/UI' : 'Shared/UI';
  const tagsLine = draft ? "  tags: ['wip'],\n" : '';

  return `import type { Meta, StoryObj } from '@storybook/react-vite';
import { ${componentName} } from './${componentName}';

const meta = {
  title: '${titlePrefix}/${categoryTitle}/${componentName}',
  component: ${componentName},
${tagsLine}} satisfies Meta<typeof ${componentName}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`;
}

function createLocalIndexTemplate(componentName) {
  return `export { ${componentName} } from './${componentName}';\n`;
}

const { nameArg, draft, category } = parseArgs(process.argv);
const componentName = toPascalCase(nameArg);
const folderName = toKebabCase(nameArg);

if (!componentName || !folderName) {
  console.error('Invalid component name');
  process.exit(1);
}

const componentDir = path.join(uiRoot, category, folderName);
fs.mkdirSync(componentDir, { recursive: true });

const componentPath = path.join(componentDir, `${componentName}.tsx`);
const cssPath = path.join(componentDir, `${componentName}.module.css`);
const storyPath = path.join(componentDir, `${componentName}.stories.tsx`);
const localIndexPath = path.join(componentDir, 'index.ts');

const created = [];
if (writeFileSafe(componentPath, createComponentTemplate(componentName))) created.push(path.relative(root, componentPath));
if (writeFileSafe(cssPath, createCssTemplate())) created.push(path.relative(root, cssPath));
if (writeFileSafe(storyPath, createStoryTemplate(componentName, draft, category))) created.push(path.relative(root, storyPath));
if (writeFileSafe(localIndexPath, createLocalIndexTemplate(componentName))) created.push(path.relative(root, localIndexPath));

if (created.length === 0) {
  console.log(`No files created. Component '${componentName}' already exists.`);
} else {
  console.log('Created files:');
  for (const file of created) {
    console.log(`- ${file}`);
  }
  console.log(`Category: ${category}`);
  console.log(`Story status: ${draft ? 'draft (wip)' : 'ready'}`);
}

const syncResult = spawnSync('node', ['scripts/sync-shared-ui-index.mjs'], {
  cwd: root,
  stdio: 'inherit'
});

if (syncResult.status !== 0) {
  process.exit(syncResult.status ?? 1);
}
