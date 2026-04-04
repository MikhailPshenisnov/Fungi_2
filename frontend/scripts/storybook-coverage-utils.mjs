import fs from 'node:fs';
import path from 'node:path';

const SHARED_UI_CATEGORY_NAMES = ['primitives', 'composites'];
const UI_SCOPE_CONFIGS = [
  { scopeKey: 'shared-ui', scopeLabel: 'shared/ui', type: 'shared-ui', relativeRoot: 'src/shared/ui' },
  { scopeKey: 'pages', scopeLabel: 'pages', type: 'layer-ui', relativeRoot: 'src/pages' },
  { scopeKey: 'widgets', scopeLabel: 'widgets', type: 'layer-ui', relativeRoot: 'src/widgets' },
  { scopeKey: 'features', scopeLabel: 'features', type: 'layer-ui', relativeRoot: 'src/features' },
  { scopeKey: 'entities', scopeLabel: 'entities', type: 'layer-ui', relativeRoot: 'src/entities' }
];

export function findFrontendRoot(startDir = process.cwd()) {
  let currentDir = path.resolve(startDir);

  while (true) {
    const hasPackageJson = fs.existsSync(path.join(currentDir, 'package.json'));
    const hasSourceTree = fs.existsSync(path.join(currentDir, 'src'));
    const hasStorybookConfig = fs.existsSync(path.join(currentDir, '.storybook'));
    if (hasPackageJson && hasSourceTree && hasStorybookConfig) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error('Unable to locate frontend root. Run this script from frontend/ or its subdirectories.');
    }

    currentDir = parentDir;
  }
}

export function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

export function toRepoRelativePath(repoRoot, absolutePath) {
  return toPosixPath(path.relative(repoRoot, absolutePath));
}

function listDirectories(baseDir) {
  if (!fs.existsSync(baseDir)) return [];

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => path.join(baseDir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

function listFiles(baseDir) {
  if (!fs.existsSync(baseDir)) return [];

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function isComponentFile(fileName) {
  return fileName.endsWith('.tsx') && !fileName.endsWith('.stories.tsx') && fileName !== 'index.tsx';
}

function isStoryFile(fileName) {
  return fileName.endsWith('.stories.tsx');
}

function collectComponentsInDirectory(directoryPath, repoRoot) {
  const files = listFiles(directoryPath);
  const componentFileNames = files.filter(isComponentFile);
  const storyFileNames = files.filter(isStoryFile);
  const hasStories = storyFileNames.length > 0;
  const firstComponentName = componentFileNames.length > 0 ? path.basename(componentFileNames[0], '.tsx') : null;
  const suggestedStoryFileName = firstComponentName ? `${firstComponentName}.stories.tsx` : 'Component.stories.tsx';
  const suggestedStoryPath = path.join(directoryPath, suggestedStoryFileName);

  const components = componentFileNames.map((componentFileName) => {
    const componentName = path.basename(componentFileName, '.tsx');
    const componentPath = path.join(directoryPath, componentFileName);

    return {
      componentName,
      componentFileName,
      componentPath,
      componentPathFromRepo: toRepoRelativePath(repoRoot, componentPath)
    };
  });

  return {
    components,
    storyFileNames,
    hasStories,
    suggestedStoryFileName,
    suggestedStoryPath,
    suggestedStoryPathFromRepo: toRepoRelativePath(repoRoot, suggestedStoryPath)
  };
}

function findUiDirectories(layerRoot) {
  if (!fs.existsSync(layerRoot)) return [];

  const uiDirectories = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) {
        continue;
      }

      const nextDir = path.join(currentDir, entry.name);
      if (entry.name === 'ui') {
        uiDirectories.push(nextDir);
      }

      walk(nextDir);
    }
  }

  walk(layerRoot);
  uiDirectories.sort((a, b) => a.localeCompare(b));
  return uiDirectories;
}

function buildScopeSummary({
  scopeKey,
  scopeLabel,
  directories
}) {
  const requiredDirectories = directories.length;
  const coveredDirectories = directories.filter((directory) => directory.hasStories).length;
  const missingDirectories = requiredDirectories - coveredDirectories;
  const requiredComponents = directories.reduce((acc, directory) => acc + directory.requiredComponents, 0);
  const coveredComponents = directories.reduce((acc, directory) => acc + (directory.hasStories ? directory.requiredComponents : 0), 0);
  const missingComponents = requiredComponents - coveredComponents;

  return {
    scopeKey,
    scopeLabel,
    directories,
    requiredDirectories,
    coveredDirectories,
    missingDirectories,
    uiDirectoryCount: directories.length,
    requiredComponents,
    coveredComponents,
    missingComponents
  };
}

function collectSharedUiScope(frontendRoot, repoRoot) {
  const sharedUiRoot = path.join(frontendRoot, 'src/shared/ui');
  const directories = [];

  for (const category of SHARED_UI_CATEGORY_NAMES) {
    const categoryRoot = path.join(sharedUiRoot, category);
    for (const componentDir of listDirectories(categoryRoot)) {
      const collected = collectComponentsInDirectory(componentDir, repoRoot);
      if (collected.components.length === 0) {
        continue;
      }

      directories.push({
        scopeKey: 'shared-ui',
        scopeLabel: 'shared/ui',
        category,
        directoryPath: componentDir,
        directoryPathFromRepo: toRepoRelativePath(repoRoot, componentDir),
        components: collected.components,
        storyFileNames: collected.storyFileNames,
        hasStories: collected.hasStories,
        suggestedStoryFileName: collected.suggestedStoryFileName,
        suggestedStoryPath: collected.suggestedStoryPath,
        suggestedStoryPathFromRepo: collected.suggestedStoryPathFromRepo,
        requiredComponents: collected.components.length
      });
    }
  }

  directories.sort((a, b) => a.directoryPathFromRepo.localeCompare(b.directoryPathFromRepo));
  return buildScopeSummary({
    scopeKey: 'shared-ui',
    scopeLabel: 'shared/ui',
    directories
  });
}

function collectLayerUiScope(frontendRoot, repoRoot, scopeConfig) {
  const layerRoot = path.join(frontendRoot, scopeConfig.relativeRoot);
  const uiDirs = findUiDirectories(layerRoot);
  const directories = [];

  for (const uiDir of uiDirs) {
    const collected = collectComponentsInDirectory(uiDir, repoRoot);
    if (collected.components.length === 0) {
      continue;
    }

    directories.push({
      scopeKey: scopeConfig.scopeKey,
      scopeLabel: scopeConfig.scopeLabel,
      category: null,
      directoryPath: uiDir,
      directoryPathFromRepo: toRepoRelativePath(repoRoot, uiDir),
      components: collected.components,
      storyFileNames: collected.storyFileNames,
      hasStories: collected.hasStories,
      suggestedStoryFileName: collected.suggestedStoryFileName,
      suggestedStoryPath: collected.suggestedStoryPath,
      suggestedStoryPathFromRepo: collected.suggestedStoryPathFromRepo,
      requiredComponents: collected.components.length
    });
  }

  directories.sort((a, b) => a.directoryPathFromRepo.localeCompare(b.directoryPathFromRepo));
  return buildScopeSummary({
    scopeKey: scopeConfig.scopeKey,
    scopeLabel: scopeConfig.scopeLabel,
    directories
  });
}

export function collectStorybookCoverage(startDir = process.cwd()) {
  const frontendRoot = findFrontendRoot(startDir);
  const repoRoot = path.resolve(frontendRoot, '..');

  const scopes = UI_SCOPE_CONFIGS.map((scopeConfig) =>
    scopeConfig.type === 'shared-ui'
      ? collectSharedUiScope(frontendRoot, repoRoot)
      : collectLayerUiScope(frontendRoot, repoRoot, scopeConfig)
  );

  const missingItems = [];
  for (const scope of scopes) {
    for (const directory of scope.directories) {
      if (directory.hasStories) {
        continue;
      }

      missingItems.push({
        scopeKey: scope.scopeKey,
        scopeLabel: scope.scopeLabel,
        category: directory.category,
        directoryPath: directory.directoryPath,
        directoryPathFromRepo: directory.directoryPathFromRepo,
        componentNames: directory.components.map((component) => component.componentName),
        componentPathsFromRepo: directory.components.map((component) => component.componentPathFromRepo),
        expectedStoryFileName: directory.suggestedStoryFileName,
        expectedStoryPath: directory.suggestedStoryPath,
        expectedStoryPathFromRepo: directory.suggestedStoryPathFromRepo
      });
    }
  }

  missingItems.sort((a, b) => {
    const byScope = a.scopeLabel.localeCompare(b.scopeLabel);
    if (byScope !== 0) return byScope;
    return a.directoryPathFromRepo.localeCompare(b.directoryPathFromRepo);
  });

  const totals = scopes.reduce(
    (acc, scope) => ({
      uiDirectoryCount: acc.uiDirectoryCount + scope.uiDirectoryCount,
      requiredDirectories: acc.requiredDirectories + scope.requiredDirectories,
      coveredDirectories: acc.coveredDirectories + scope.coveredDirectories,
      missingDirectories: acc.missingDirectories + scope.missingDirectories,
      requiredComponents: acc.requiredComponents + scope.requiredComponents,
      coveredComponents: acc.coveredComponents + scope.coveredComponents,
      missingComponents: acc.missingComponents + scope.missingComponents
    }),
    {
      uiDirectoryCount: 0,
      requiredDirectories: 0,
      coveredDirectories: 0,
      missingDirectories: 0,
      requiredComponents: 0,
      coveredComponents: 0,
      missingComponents: 0
    }
  );

  return {
    frontendRoot,
    repoRoot,
    scopes,
    missingItems,
    totals
  };
}
