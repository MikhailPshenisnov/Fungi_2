function quoteForShell(value) {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function toFrontendRelative(value) {
  return value.replace(/^frontend\//, '');
}

module.exports = {
  'frontend/**/*.{ts,tsx,js,jsx}': (files) => {
    const targets = files.map(toFrontendRelative).map(quoteForShell).join(' ');
    return targets.length > 0 ? [`cd frontend && npx eslint --fix --max-warnings=0 ${targets}`] : [];
  },
  'frontend/**/*.css': (files) => {
    const targets = files.map(toFrontendRelative).map(quoteForShell).join(' ');
    return targets.length > 0
      ? [`cd frontend && npx stylelint --fix --ignore-pattern src/shared/assets/styles/tokens.css ${targets}`]
      : [];
  },
  '*.{md,yml,yaml,json}': (files) => {
    const targets = files.map(quoteForShell).join(' ');
    return targets.length > 0 ? [`npx prettier --write ${targets}`] : [];
  }
};
