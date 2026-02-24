import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const tokensFile = path.join(srcDir, 'shared/assets/styles/tokens.css');

const codeExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const skippedDirs = new Set(['node_modules', 'dist', 'storybook-static']);

const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skippedDirs.has(entry.name)) {
        walk(path.join(dir, entry.name));
      }
      continue;
    }

    const ext = path.extname(entry.name);
    if (!codeExts.has(ext)) continue;

    const fullPath = path.join(dir, entry.name);
    const rel = path.relative(root, fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');

    const rules = [
      {
        name: 'raw color literal',
        pattern: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g,
        allowIn: [tokensFile]
      },
      {
        name: 'primitive token usage outside tokens.css',
        pattern: /var\(--ref-[a-z0-9-]+\)/g,
        allowIn: [tokensFile]
      },
      {
        name: 'legacy semantic alias usage',
        pattern: /var\(--color-(primary|accent|bg|surface|text|muted|border|success|warning|error|info)\)/g,
        allowIn: []
      }
    ];

    for (const rule of rules) {
      if (rule.allowIn.includes(fullPath)) continue;
      const matches = [...content.matchAll(rule.pattern)];
      for (const match of matches) {
        const offset = match.index ?? 0;
        const before = content.slice(0, offset);
        const line = before.split('\n').length;
        violations.push(`${rel}:${line} -> ${rule.name}: ${match[0]}`);
      }
    }
  }
}

walk(srcDir);

if (fs.existsSync(tokensFile)) {
  const tokensContent = fs.readFileSync(tokensFile, 'utf8');
  const semanticTokenRule = /(--color-[a-z0-9-]+)\s*:\s*([^;]+);/g;
  const rawColorRule = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;

  for (const match of tokensContent.matchAll(semanticTokenRule)) {
    const [, tokenName, tokenValue] = match;
    if (!tokenName || !tokenValue) continue;
    if (!rawColorRule.test(tokenValue)) continue;

    const offset = match.index ?? 0;
    const line = tokensContent.slice(0, offset).split('\n').length;
    violations.push(
      `${path.relative(root, tokensFile)}:${line} -> semantic token must not contain raw color literal: ${tokenName}`
    );
  }
}

if (violations.length > 0) {
  console.error('Design token checks failed:');
  for (const item of violations) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('Design token checks passed.');
