import fs from 'node:fs';
import path from 'node:path';
import { collectStorybookCoverage, toPosixPath } from './storybook-coverage-utils.mjs';

const writeMode = process.argv.includes('--write');

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

function printMissingStories(missingItems) {
  console.error('Missing stories:');
  for (const item of missingItems) {
    const components = item.componentPathsFromRepo.map((componentPath) => `\`${componentPath}\``).join(', ');
    console.error(
      `- [${item.scopeLabel}] ${item.directoryPathFromRepo} -> ${item.expectedStoryPathFromRepo} (components: ${components})`
    );
  }
}

function createSharedUiDraftStories(frontendRoot, missingItems) {
  const sharedItems = missingItems.filter((item) => item.scopeKey === 'shared-ui');
  const createdPaths = [];

  for (const item of sharedItems) {
    if (fs.existsSync(item.expectedStoryPath)) {
      continue;
    }

    if (!item.category) {
      continue;
    }

    const componentName = item.componentNames[0];
    if (!componentName) {
      continue;
    }

    fs.writeFileSync(
      item.expectedStoryPath,
      createDraftStoryTemplate(componentName, item.category),
      'utf8'
    );

    createdPaths.push(toPosixPath(path.relative(frontendRoot, item.expectedStoryPath)));
  }

  return createdPaths;
}

let coverage = collectStorybookCoverage();

if (coverage.missingItems.length === 0) {
  console.log('All required Storybook stories are present.');
  process.exit(0);
}

let createdDraftStories = [];

if (writeMode) {
  createdDraftStories = createSharedUiDraftStories(coverage.frontendRoot, coverage.missingItems);

  if (createdDraftStories.length > 0) {
    console.log('Created draft stories:');
    for (const createdPath of createdDraftStories) {
      console.log(`- ${createdPath}`);
    }
  }

  coverage = collectStorybookCoverage(coverage.frontendRoot);

  if (coverage.missingItems.length === 0) {
    console.log(`Total missing stories fixed: ${createdDraftStories.length}`);
    process.exit(0);
  }
}

printMissingStories(coverage.missingItems);

if (writeMode) {
  console.error('Only shared/ui draft stories are auto-generated in --write mode.');
}

console.error('Run: npm run stories:sync (for shared/ui draft generation) and add missing stories manually.');
process.exit(1);
