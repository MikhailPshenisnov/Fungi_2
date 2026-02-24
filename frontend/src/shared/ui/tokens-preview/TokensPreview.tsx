import { useMemo } from 'react';
import { Typography } from '@shared/ui';
import styles from './TokensPreview.module.css';

type TokenItem = {
  token: string;
  role: string;
};

const surfaceTokens: TokenItem[] = [
  { token: '--color-bg-default', role: 'Background / default' },
  { token: '--color-bg-subtle', role: 'Background / subtle' },
  { token: '--color-bg-muted', role: 'Background / muted' },
  { token: '--color-surface-default', role: 'Surface / default' },
  { token: '--color-surface-elevated', role: 'Surface / elevated' },
  { token: '--color-surface-inverse', role: 'Surface / inverse' }
];

const textTokens: TokenItem[] = [
  { token: '--color-text-primary', role: 'Text / primary' },
  { token: '--color-text-secondary', role: 'Text / secondary' },
  { token: '--color-text-tertiary', role: 'Text / tertiary' },
  { token: '--color-text-disabled', role: 'Text / disabled' },
  { token: '--color-text-inverse', role: 'Text / inverse' },
  { token: '--color-text-on-brand', role: 'Text / on-brand' }
];

const actionTokens: TokenItem[] = [
  { token: '--color-action-primary-bg', role: 'Primary bg' },
  { token: '--color-action-primary-on-bg', role: 'Primary on-bg' },
  { token: '--color-action-primary-bg-hover', role: 'Primary hover' },
  { token: '--color-action-primary-bg-active', role: 'Primary active' },
  { token: '--color-action-primary-focus-ring', role: 'Primary focus-ring' },
  { token: '--color-action-ghost-bg', role: 'Ghost bg' },
  { token: '--color-action-ghost-on-bg', role: 'Ghost on-bg' },
  { token: '--color-action-ghost-bg-hover', role: 'Ghost hover' },
  { token: '--color-action-ghost-focus-ring', role: 'Ghost focus-ring' }
];

const statusTokens: TokenItem[] = [
  { token: '--color-status-success-bg', role: 'Success bg' },
  { token: '--color-status-success-on-bg', role: 'Success on-bg' },
  { token: '--color-status-warning-bg', role: 'Warning bg' },
  { token: '--color-status-warning-on-bg', role: 'Warning on-bg' },
  { token: '--color-status-error-bg', role: 'Error bg' },
  { token: '--color-status-error-on-bg', role: 'Error on-bg' },
  { token: '--color-status-info-bg', role: 'Info bg' },
  { token: '--color-status-info-on-bg', role: 'Info on-bg' },
  { token: '--color-status-error-strong', role: 'Error strong' }
];

const borderOverlayTokens: TokenItem[] = [
  { token: '--color-border-default', role: 'Border default' },
  { token: '--color-border-subtle', role: 'Border subtle' },
  { token: '--color-border-strong', role: 'Border strong' },
  { token: '--color-border-focus', role: 'Border focus' },
  { token: '--color-overlay-scrim', role: 'Overlay scrim' },
  { token: '--color-overlay-backdrop', role: 'Overlay backdrop' }
];

type ContrastPair = {
  name: string;
  bgToken: string;
  textToken: string;
};

const contrastPairs: ContrastPair[] = [
  {
    name: 'Primary action',
    bgToken: '--color-action-primary-bg',
    textToken: '--color-action-primary-on-bg'
  },
  {
    name: 'Ghost action',
    bgToken: '--color-action-ghost-bg',
    textToken: '--color-action-ghost-on-bg'
  },
  {
    name: 'Success status',
    bgToken: '--color-status-success-bg',
    textToken: '--color-status-success-on-bg'
  },
  {
    name: 'Warning status',
    bgToken: '--color-status-warning-bg',
    textToken: '--color-status-warning-on-bg'
  },
  {
    name: 'Error status',
    bgToken: '--color-status-error-bg',
    textToken: '--color-status-error-on-bg'
  },
  {
    name: 'Info status',
    bgToken: '--color-status-info-bg',
    textToken: '--color-status-info-on-bg'
  },
  {
    name: 'Surface default + text primary',
    bgToken: '--color-surface-default',
    textToken: '--color-text-primary'
  },
  {
    name: 'Surface inverse + text inverse',
    bgToken: '--color-surface-inverse',
    textToken: '--color-text-inverse'
  }
];

type Rgba = { r: number; g: number; b: number; a: number };

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, value));
}

function parseHex(hex: string): Rgba | null {
  const source = hex.trim().replace('#', '');
  if (source.length === 3) {
    const r = parseInt(source[0] + source[0], 16);
    const g = parseInt(source[1] + source[1], 16);
    const b = parseInt(source[2] + source[2], 16);
    return { r, g, b, a: 1 };
  }
  if (source.length === 6) {
    const r = parseInt(source.slice(0, 2), 16);
    const g = parseInt(source.slice(2, 4), 16);
    const b = parseInt(source.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }
  return null;
}

function parseRgb(input: string): Rgba | null {
  const normalized = input
    .trim()
    .replace(/^rgba?\(/i, '')
    .replace(/\)$/g, '')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s*,\s*/g, ' ')
    .trim();

  const parts = normalized.split(/\s+/);
  if (parts.length < 3) return null;

  const slashIndex = parts.indexOf('/');
  const rgbParts = slashIndex >= 0 ? parts.slice(0, slashIndex) : parts.slice(0, 3);
  const alphaPart = slashIndex >= 0 ? parts[slashIndex + 1] : parts[3];
  if (rgbParts.length < 3) return null;

  const r = Number(rgbParts[0]);
  const g = Number(rgbParts[1]);
  const b = Number(rgbParts[2]);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;

  let a = 1;
  if (alphaPart !== undefined) {
    const parsed = Number(alphaPart.replace('%', ''));
    if (Number.isNaN(parsed)) return null;
    a = alphaPart.includes('%') ? parsed / 100 : parsed;
  }

  return {
    r: clampChannel(r),
    g: clampChannel(g),
    b: clampChannel(b),
    a: Math.max(0, Math.min(1, a))
  };
}

function parseColorSrgb(input: string): Rgba | null {
  const match = input
    .trim()
    .match(/^color\(\s*srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i);
  if (!match) return null;

  const r = clampChannel(Number(match[1]) * 255);
  const g = clampChannel(Number(match[2]) * 255);
  const b = clampChannel(Number(match[3]) * 255);

  let a = 1;
  if (match[4] !== undefined) {
    const alphaRaw = match[4];
    const parsed = Number(alphaRaw.replace('%', ''));
    if (Number.isNaN(parsed)) return null;
    a = alphaRaw.includes('%') ? parsed / 100 : parsed;
  }

  return { r, g, b, a: Math.max(0, Math.min(1, a)) };
}

function parseColor(input: string): Rgba | null {
  if (input.startsWith('#')) return parseHex(input);
  if (input.toLowerCase().startsWith('color(')) return parseColorSrgb(input);
  return parseRgb(input);
}

function resolveTokenColor(tokenName: string): string {
  if (typeof window === 'undefined') return '';
  const probe = document.createElement('span');
  probe.style.color = `var(${tokenName})`;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  return resolved;
}

function toLinear(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: Rgba): number {
  return 0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b);
}

function blendOverWhite(color: Rgba): Rgba {
  if (color.a >= 1) return color;
  return {
    r: color.r * color.a + 255 * (1 - color.a),
    g: color.g * color.a + 255 * (1 - color.a),
    b: color.b * color.a + 255 * (1 - color.a),
    a: 1
  };
}

function contrastRatio(colorA: Rgba, colorB: Rgba): number {
  const a = blendOverWhite(colorA);
  const b = blendOverWhite(colorB);
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function passLabel(pass: boolean): string {
  return pass ? 'PASS' : 'FAIL';
}

function TokenGrid({ items }: { items: TokenItem[] }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.token} className={styles.swatch}>
          <div className={styles.swatchPreview} style={{ background: `var(${item.token})` }} />
          <div className={styles.swatchMeta}>
            <span className={styles.tokenName}>{item.token}</span>
            <span className={styles.tokenRole}>{item.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TokensPreview() {
  const contrastResults = useMemo(() => {
    return contrastPairs.map((pair) => {
      const bgResolved = resolveTokenColor(pair.bgToken);
      const textResolved = resolveTokenColor(pair.textToken);
      const bg = parseColor(bgResolved);
      const text = parseColor(textResolved);
      if (!bg || !text) {
        return {
          ...pair,
          ratio: null as number | null,
          aaNormal: false,
          aaLarge: false,
          aaaNormal: false,
          aaaLarge: false
        };
      }
      const ratio = contrastRatio(bg, text);
      return {
        ...pair,
        ratio,
        aaNormal: ratio >= 4.5,
        aaLarge: ratio >= 3,
        aaaNormal: ratio >= 7,
        aaaLarge: ratio >= 4.5
      };
    });
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Color tokens</h2>
        <Typography variant="bodyS">Семантика: роли + слоты + состояния. Компоненты используют только `--color-*`.</Typography>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Background & Surface</h3>
        <TokenGrid items={surfaceTokens} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Text</h3>
        <TokenGrid items={textTokens} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Actions</h3>
        <TokenGrid items={actionTokens} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Status</h3>
        <TokenGrid items={statusTokens} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Border & Overlay</h3>
        <TokenGrid items={borderOverlayTokens} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>WCAG Contrast checks</h2>
        <Typography variant="bodyS">
          Автоматическая проверка пар `bg + on-bg` по WCAG.
        </Typography>
        <div className={styles.contrastGrid}>
          {contrastResults.map((item) => (
            <article key={item.name} className={styles.contrastCard}>
              <div
                className={styles.contrastPreview}
                style={{ background: `var(${item.bgToken})`, color: `var(${item.textToken})` }}
              >
                Aa
              </div>
              <div className={styles.contrastMeta}>
                <Typography variant="bodyS">{item.name}</Typography>
                <span className={styles.tokenName}>{item.bgToken}</span>
                <span className={styles.tokenName}>{item.textToken}</span>
                <span className={styles.contrastRatio}>
                  Ratio: {item.ratio ? `${item.ratio.toFixed(2)}:1` : 'N/A'}
                </span>
                <div className={styles.badges}>
                  <span className={item.aaNormal ? styles.badgePass : styles.badgeFail}>
                    AA normal {passLabel(item.aaNormal)}
                  </span>
                  <span className={item.aaLarge ? styles.badgePass : styles.badgeFail}>
                    AA large {passLabel(item.aaLarge)}
                  </span>
                  <span className={item.aaaNormal ? styles.badgePass : styles.badgeFail}>
                    AAA normal {passLabel(item.aaaNormal)}
                  </span>
                  <span className={item.aaaLarge ? styles.badgePass : styles.badgeFail}>
                    AAA large {passLabel(item.aaaLarge)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography scale</h2>
        <div className={styles.typoList}>
          <Typography variant="h1">H1 / 40</Typography>
          <Typography variant="h2">H2 / 32</Typography>
          <Typography variant="h3">H3 / 24</Typography>
          <Typography variant="h4">H4 / 20</Typography>
          <Typography variant="h5">H5 / 18</Typography>
          <Typography variant="bodyL">Body L / 18</Typography>
          <Typography variant="body">Body / 16</Typography>
          <Typography variant="bodyS">Body S / 14</Typography>
          <Typography variant="caption">Caption / 13</Typography>
          <Typography variant="meta">Meta / 12</Typography>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Radius, shadows, breakpoints</h2>
        <div className={styles.measureGrid}>
          <div className={styles.measureCard}>
            <Typography variant="bodyS">Radius S</Typography>
            <div className={styles.radiusDemo} style={{ borderRadius: 'var(--radius-s)' }} />
            <div className={styles.measureValue}>var(--radius-s) = 6px</div>
          </div>
          <div className={styles.measureCard}>
            <Typography variant="bodyS">Radius M</Typography>
            <div className={styles.radiusDemo} style={{ borderRadius: 'var(--radius-m)' }} />
            <div className={styles.measureValue}>var(--radius-m) = 10px</div>
          </div>
          <div className={styles.measureCard}>
            <Typography variant="bodyS">Radius L</Typography>
            <div className={styles.radiusDemo} style={{ borderRadius: 'var(--radius-l)' }} />
            <div className={styles.measureValue}>var(--radius-l) = 14px</div>
          </div>
          <div className={styles.measureCard}>
            <Typography variant="bodyS">Shadow base</Typography>
            <div className={styles.shadowBase} />
            <div className={styles.measureValue}>var(--shadow-base)</div>
          </div>
          <div className={styles.measureCard}>
            <Typography variant="bodyS">Shadow hover</Typography>
            <div className={styles.shadowHover} />
            <div className={styles.measureValue}>var(--shadow-hover)</div>
          </div>
          <div className={styles.measureCard}>
            <Typography variant="bodyS">Breakpoints</Typography>
            <div className={styles.measureValue}>sm: 480</div>
            <div className={styles.measureValue}>md: 768</div>
            <div className={styles.measureValue}>lg: 1024</div>
            <div className={styles.measureValue}>xl: 1280</div>
            <div className={styles.measureValue}>2xl: 1440</div>
          </div>
        </div>
      </section>
    </div>
  );
}
