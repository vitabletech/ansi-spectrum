/**
 * Constants and configurations for ANSI Color Viewer extension
 */

// ANSI color code mapping to hex colors
export const ANSI_COLOR_MAP: Record<string, string> = {
  // Standard colors (30-37)
  '30': '#000000', // Black
  '31': '#ff0000', // Red
  '32': '#00ff00', // Green
  '33': '#ffff00', // Yellow
  '34': '#0000ff', // Blue
  '35': '#ff00ff', // Magenta
  '36': '#00ffff', // Cyan
  '37': '#ffffff', // White

  // Background colors (40-47)
  '40': '#000000', // BG Black
  '41': '#ff0000', // BG Red
  '42': '#00ff00', // BG Green
  '43': '#ffff00', // BG Yellow
  '44': '#0000ff', // BG Blue
  '45': '#ff00ff', // BG Magenta
  '46': '#00ffff', // BG Cyan
  '47': '#ffffff', // BG White

  // Bright colors (90-97)
  '90': '#808080', // Bright Black (Dark Gray)
  '91': '#ff6b6b', // Bright Red
  '92': '#4ecdc4', // Bright Green
  '93': '#ffe66d', // Bright Yellow
  '94': '#4dabf7', // Bright Blue
  '95': '#da77f2', // Bright Magenta
  '96': '#74c0fc', // Bright Cyan
  '97': '#ffffff', // Bright White
};

// Color name mappings for the color picker
export const COLOR_NAMES: Record<string, string> = {
  '30': 'Black',
  '31': 'Red',
  '32': 'Green',
  '33': 'Yellow',
  '34': 'Blue',
  '35': 'Magenta',
  '36': 'Cyan',
  '37': 'White',
  '40': 'BG Black',
  '41': 'BG Red',
  '42': 'BG Green',
  '43': 'BG Yellow',
  '44': 'BG Blue',
  '45': 'BG Magenta',
  '46': 'BG Cyan',
  '47': 'BG White',
  '90': 'Bright Black',
  '91': 'Bright Red',
  '92': 'Bright Green',
  '93': 'Bright Yellow',
  '94': 'Bright Blue',
  '95': 'Bright Magenta',
  '96': 'Bright Cyan',
  '97': 'Bright White',
};

// Regex pattern to match ANSI escape sequences
// Matches: \033[31m, \033[0;31m, \033[1;30m, \x1b[31m, etc.
export const ANSI_COLOR_REGEX = /\\(?:033|x1b)\[(?:(\d+);)?(\d+)m/g;

// Extension commands
export const COMMANDS = {
  PICK_COLOR: 'ansi-color-viewer.pickColor',
} as const;
