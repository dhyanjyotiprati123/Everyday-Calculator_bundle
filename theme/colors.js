// Design tokens — the single source of truth for colour.
// Consumed by tailwind.config.js (class names such as `bg-surface`, `text-ink`)
// and directly by components that need raw values (icons, gradients).
// Names are semantic so a dark palette can be swapped in later without
// touching components.

const colors = {
  background: '#F7F8FA',
  backgroundTop: '#EFF2FB',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F4F7',
  border: '#E7EAF0',

  textPrimary: '#18202A',
  // Darkened from #697586 so small text keeps >= 4.5:1 on pastel tints.
  textSecondary: '#5B6576',
  // Decorative glyphs (chevrons, inactive icons) only — never body text.
  textMuted: '#8A94A6',

  primary: '#6078D8',
  // Use for primary-coloured text; plain `primary` is for icons and fills.
  primaryDark: '#4A5FBA',
  primarySoft: '#E9EDFF',

  // Validation errors (6.6:1 on white).
  danger: '#B42318',
  dangerSoft: '#FDECEA',
  // Gains and savings in results (4.8:1 on white).
  success: '#2E8064',
};

// Breakdown-bar segments, in order. Each is >= 3:1 on white; legends always
// repeat the label and value so colour is never the only cue.
const chartColors = ['#6078D8', '#D47A44', '#3B9A78'];

// Category accents: `soft` fills icon chips, `ink` is the icon colour on top
// of it (each pair is >= 3.8:1).
const accents = {
  blue: { soft: '#E9EDFF', ink: '#4A5FBA' },
  peach: { soft: '#FCE9DD', ink: '#B4612F' },
  mint: { soft: '#DFF4EC', ink: '#2E8064' },
  sky: { soft: '#E1F0FA', ink: '#2F70A6' },
  yellow: { soft: '#F8F0D7', ink: '#8C6A12' },
  lavender: { soft: '#EAE7FA', ink: '#6A57C2' },
};

module.exports = { colors, accents, chartColors };
