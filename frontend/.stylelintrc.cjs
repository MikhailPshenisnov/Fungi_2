module.exports = {
  rules: { 'block-no-empty': true },
  ignoreFiles: ['dist/**', 'storybook-static/**', 'node_modules/**'],
  overrides: [
    {
      files: ['src/**/*.css'],
      rules: {
        'custom-property-pattern': '^(color|font|text|radius|shadow|space|bp)-[a-z0-9-]+$',
        'declaration-property-value-disallowed-list': {
          '/.*/': ['/#([0-9a-fA-F]{3,8})\\b/', '/rgba?\\(/i', '/hsla?\\(/i']
        },
        'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla']
      }
    }
  ]
};
