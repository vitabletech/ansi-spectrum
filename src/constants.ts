/**
 * Constants and configurations for ANSI Spectrum extension
 * Ultimate Visualization - Comprehensive support for all ANSI color formats used globally
 */

// ANSI color code mapping to hex colors - Extended for global compatibility
export const ANSI_COLOR_MAP: Record<string, string> = {
  // Standard colors (30-37) - Basic 8 colors
  '30': '#000000', // Black
  '31': '#cd0000', // Red (more accurate terminal red)
  '32': '#00cd00', // Green
  '33': '#cdcd00', // Yellow
  '34': '#0000ee', // Blue
  '35': '#cd00cd', // Magenta
  '36': '#00cdcd', // Cyan
  '37': '#e5e5e5', // White (more accurate terminal white)

  // Background colors (40-47) - Basic 8 background colors
  '40': '#000000', // BG Black
  '41': '#cd0000', // BG Red
  '42': '#00cd00', // BG Green
  '43': '#cdcd00', // BG Yellow
  '44': '#0000ee', // BG Blue
  '45': '#cd00cd', // BG Magenta
  '46': '#00cdcd', // BG Cyan
  '47': '#e5e5e5', // BG White

  // Bright colors (90-97) - High intensity colors
  '90': '#7f7f7f', // Bright Black (Dark Gray)
  '91': '#ff0000', // Bright Red
  '92': '#00ff00', // Bright Green
  '93': '#ffff00', // Bright Yellow
  '94': '#5c5cff', // Bright Blue
  '95': '#ff00ff', // Bright Magenta
  '96': '#00ffff', // Bright Cyan
  '97': '#ffffff', // Bright White

  // Bright background colors (100-107) - High intensity backgrounds
  '100': '#7f7f7f', // Bright BG Black
  '101': '#ff0000', // Bright BG Red
  '102': '#00ff00', // Bright BG Green
  '103': '#ffff00', // Bright BG Yellow
  '104': '#5c5cff', // Bright BG Blue
  '105': '#ff00ff', // Bright BG Magenta
  '106': '#00ffff', // Bright BG Cyan
  '107': '#ffffff', // Bright BG White

  // Reset codes
  '0': '#ffffff', // Reset to default
  '39': '#ffffff', // Default foreground
  '49': '#000000', // Default background
};

// 256-color palette (used with 38;5;n and 48;5;n)
export const ANSI_256_COLORS: string[] = [
  // Standard 16 colors (0-15)
  '#000000',
  '#800000',
  '#008000',
  '#808000',
  '#000080',
  '#800080',
  '#008080',
  '#c0c0c0',
  '#808080',
  '#ff0000',
  '#00ff00',
  '#ffff00',
  '#0000ff',
  '#ff00ff',
  '#00ffff',
  '#ffffff',

  // 216 colors (16-231) - 6x6x6 color cube
  ...((): string[] => {
    const colors: string[] = [];
    const values = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff];
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          const red = values[r].toString(16).padStart(2, '0');
          const green = values[g].toString(16).padStart(2, '0');
          const blue = values[b].toString(16).padStart(2, '0');
          colors.push(`#${red}${green}${blue}`);
        }
      }
    }
    return colors;
  })(),

  // Grayscale colors (232-255)
  ...((): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < 24; i++) {
      const gray = Math.round(8 + i * 10)
        .toString(16)
        .padStart(2, '0');
      colors.push(`#${gray}${gray}${gray}`);
    }
    return colors;
  })(),
];

// Color name mappings for the color picker - Extended
export const COLOR_NAMES: Record<string, string> = {
  // Standard colors (30-37)
  '30': 'Black',
  '31': 'Red',
  '32': 'Green',
  '33': 'Yellow',
  '34': 'Blue',
  '35': 'Magenta',
  '36': 'Cyan',
  '37': 'White',

  // Background colors (40-47)
  '40': 'BG Black',
  '41': 'BG Red',
  '42': 'BG Green',
  '43': 'BG Yellow',
  '44': 'BG Blue',
  '45': 'BG Magenta',
  '46': 'BG Cyan',
  '47': 'BG White',

  // Bright colors (90-97)
  '90': 'Bright Black',
  '91': 'Bright Red',
  '92': 'Bright Green',
  '93': 'Bright Yellow',
  '94': 'Bright Blue',
  '95': 'Bright Magenta',
  '96': 'Bright Cyan',
  '97': 'Bright White',

  // Bright background colors (100-107)
  '100': 'Bright BG Black',
  '101': 'Bright BG Red',
  '102': 'Bright BG Green',
  '103': 'Bright BG Yellow',
  '104': 'Bright BG Blue',
  '105': 'Bright BG Magenta',
  '106': 'Bright BG Cyan',
  '107': 'Bright BG White',

  // Reset codes
  '0': 'Reset',
  '39': 'Default Foreground',
  '49': 'Default Background',
};

// Comprehensive regex patterns for all ANSI escape sequence formats
export const ANSI_REGEX_PATTERNS = {
  // Basic colors: \033[31m, \x1b[31m, \e[31m
  BASIC: /\\(?:033|x1b|e)\[(\d+)m/g,

  // Colors with attributes: \033[1;31m, \033[0;1;31m
  WITH_ATTRIBUTES: /\\(?:033|x1b|e)\[(?:\d+;)*(\d+)m/g,

  // 256-color foreground: \033[38;5;196m
  COLOR_256_FG: /\\(?:033|x1b|e)\[38;5;(\d+)m/g,

  // 256-color background: \033[48;5;196m
  COLOR_256_BG: /\\(?:033|x1b|e)\[48;5;(\d+)m/g,

  // True color (RGB) foreground: \033[38;2;255;0;0m
  TRUE_COLOR_FG: /\\(?:033|x1b|e)\[38;2;(\d+);(\d+);(\d+)m/g,

  // True color (RGB) background: \033[48;2;255;0;0m
  TRUE_COLOR_BG: /\\(?:033|x1b|e)\[48;2;(\d+);(\d+);(\d+)m/g,

  // Combined pattern for all ANSI codes (for general matching)
  ALL: /\\(?:033|x1b|e)\[(?:(?:38|48);(?:5;(\d+)|2;(\d+);(\d+);(\d+))|(?:\d+;)*(\d+))m/g,

  // Actual ESC character (not escaped): \x1b[31m
  REAL_ESC:
    /\x1b\[(?:(?:38|48);(?:5;(\d+)|2;(\d+);(\d+);(\d+))|(?:\d+;)*(\d+))m/g,
};

// Main regex for backward compatibility
export const ANSI_COLOR_REGEX = ANSI_REGEX_PATTERNS.ALL;

// ANSI attribute codes (for styling)
export const ANSI_ATTRIBUTES: Record<string, string> = {
  '0': 'Reset',
  '1': 'Bold',
  '2': 'Dim',
  '3': 'Italic',
  '4': 'Underline',
  '5': 'Blink',
  '7': 'Reverse',
  '8': 'Hidden',
  '9': 'Strikethrough',
  '21': 'Bold Off',
  '22': 'Normal Intensity',
  '23': 'Italic Off',
  '24': 'Underline Off',
  '25': 'Blink Off',
  '27': 'Reverse Off',
  '28': 'Reveal',
  '29': 'Strikethrough Off',
};

// Common ANSI escape sequence prefixes used globally
export const ESCAPE_PREFIXES = [
  '\\033[', // Octal notation (most common)
  '\\x1b[', // Hexadecimal notation
  '\\e[', // Some shells/languages
  '\x1b[', // Actual ESC character
] as const;

// Extension commands
export const COMMANDS = {
  PICK_COLOR: 'ansi-spectrum.pickColor',
} as const;
