import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const uiRoot = path.join(root, 'src/shared/ui');
const writeMode = process.argv.includes('--write');
const categories = ['primitives', 'composites'];

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function createDraftStoryTemplate(componentName, category) {
  const categoryTitle = category === 'primitives' ? 'Primitives' : 'Composites';
  return `import type { Meta, StoryObj } from '@storybook/react-vite';
import { ${componentName} } from './${componentName}';

const meta = {
  title: 'Draft/Shared/UI/${categoryTitle}/${componentName}',
  component: ${componentName},
  tags: ['wip']
} satisfies Meta<typeof ${componentName}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`;
}

function listComponentDirs(baseDir) {
  if (!fs.existsSync(baseDir)) return [];
  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => path.join(baseDir, entry.name));
}

const missing = [];
const created = [];

for (const category of categories) {
  const categoryDir = path.join(uiRoot, category);
  for (const componentDir of listComponentDirs(categoryDir)) {
    const files = fs.readdirSync(componentDir);
    const hasStory = files.some((file) => file.endsWith('.stories.tsx'));
    if (hasStory) continue;

    const componentFile = files.find(
      (file) => file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && file !== 'index.tsx'
    );

    if (!componentFile) continue;

    const componentName = path.basename(componentFile, '.tsx');
    const storyPath = path.join(componentDir, `${componentName}.stories.tsx`);
    const folderName = path.basename(componentDir);
    const expectedFolder = toKebabCase(componentName);

    missing.push({ componentName, category, storyPath, componentDir, folderName, expectedFolder });
  }
}

if (missing.length === 0) {
  console.log('All shared/ui components have stories.');
  process.exit(0);
}

if (writeMode) {
  for (const item of missing) {
    if (fs.existsSync(item.storyPath)) continue;
    fs.writeFileSync(item.storyPath, createDraftStoryTemplate(item.componentName, item.category), 'utf8');
    created.push(path.relative(root, item.storyPath));
  }

  if (created.length > 0) {
    console.log('Created draft stories:');
    for (const file of created) console.log(`- ${file}`);
  }

  console.log(`Total missing stories fixed: ${created.length}`);
  process.exit(0);
}

console.error('Missing stories for shared/ui components:');
for (const item of missing) {
  const relDir = path.relative(root, item.componentDir);
  const note = item.folderName !== item.expectedFolder ? ' (folder naming differs from component)' : '';
  console.error(`- ${relDir}${note}`);
}
console.error('Run: npm run stories:sync');
process.exit(1);
