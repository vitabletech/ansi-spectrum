/**
 * Utility functions for ANSI Color Viewer extension
 */
import * as vscode from 'vscode';
import {
  ANSI_COLOR_MAP,
  COLOR_NAMES,
  ANSI_COLOR_REGEX,
  ANSI_256_COLORS,
} from './constants';
import { AnsiColorInfo, ColorMatch } from './types';

/**
 * Calculate the distance between two hex colors
 */
export function colorDistance(hex1: string, hex2: string): number {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);

  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);

  return Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  );
}

/**
 * Convert VS Code Color to hex string
 */
export function colorToHex(color: vscode.Color): string {
  const r = Math.round(color.red * 255);
  const g = Math.round(color.green * 255);
  const b = Math.round(color.blue * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert hex color to VS Code Color
 */
export function hexToColor(hex: string): vscode.Color {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new vscode.Color(r, g, b, 1);
}

/**
 * Find the closest ANSI color code for a given hex color
 */
export function findClosestAnsiColor(hexColor: string): string {
  let closestCode = '37'; // default to white
  let minDistance = Infinity;

  for (const [code, hex] of Object.entries(ANSI_COLOR_MAP)) {
    const distance = colorDistance(hexColor, hex);
    if (distance < minDistance) {
      minDistance = distance;
      closestCode = code;
    }
  }

  return closestCode;
}

/**
 * Parse ANSI color code and extract components - Enhanced for all formats
 */
export function parseAnsiCode(ansiCode: string): ColorMatch | null {
  // Try different regex patterns

  // True color RGB: \033[38;2;r;g;b;m or \033[48;2;r;g;b;m
  let match = ansiCode.match(/\\(?:033|x1b|e)\[(?:38|48);2;(\d+);(\d+);(\d+)m/);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    return {
      fullMatch: match[0],
      colorCode: 'rgb',
      attribute: hexColor, // Store hex color in attribute field
      startIndex: 0,
      endIndex: match[0].length,
    };
  }

  // 256-color: \033[38;5;n;m or \033[48;5;n;m
  match = ansiCode.match(/\\(?:033|x1b|e)\[(?:38|48);5;(\d+)m/);
  if (match) {
    const colorIndex = parseInt(match[1]);
    return {
      fullMatch: match[0],
      colorCode: '256',
      attribute: colorIndex.toString(),
      startIndex: 0,
      endIndex: match[0].length,
    };
  }

  // Standard colors with multiple attributes: \033[1;4;31m
  match = ansiCode.match(/\\(?:033|x1b|e)\[(?:(\d+);)*(\d+)m/);
  if (match) {
    return {
      fullMatch: match[0],
      colorCode: match[2],
      attribute: match[1],
      startIndex: 0,
      endIndex: match[0].length,
    };
  }

  return null;
}

/**
 * Get color hex value from any ANSI format
 */
export function getColorFromAnsiCode(ansiCode: string): string | null {
  const parsed = parseAnsiCode(ansiCode);
  if (!parsed) {
    return null;
  }

  // Handle RGB true color
  if (parsed.colorCode === 'rgb' && parsed.attribute) {
    return parsed.attribute; // Already a hex color
  }

  // Handle 256-color palette
  if (parsed.colorCode === '256' && parsed.attribute) {
    const index = parseInt(parsed.attribute);
    if (index >= 0 && index < ANSI_256_COLORS.length) {
      return ANSI_256_COLORS[index];
    }
  }

  // Handle standard colors
  return ANSI_COLOR_MAP[parsed.colorCode] || null;
}

/**
 * Convert RGB values to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Find ANSI code at specific position in document
 */
export function getAnsiCodeAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): AnsiColorInfo | null {
  const line = document.lineAt(position.line);
  const text = line.text;

  // Reset regex and find all matches in the line
  ANSI_COLOR_REGEX.lastIndex = 0;
  let match;

  while ((match = ANSI_COLOR_REGEX.exec(text)) !== null) {
    const startPos = new vscode.Position(position.line, match.index);
    const endPos = new vscode.Position(
      position.line,
      match.index + match[0].length
    );
    const range = new vscode.Range(startPos, endPos);

    // Check if cursor is within this ANSI code
    if (range.contains(position)) {
      const colorCode = match[2];
      const hexColor = ANSI_COLOR_MAP[colorCode];
      const colorName = COLOR_NAMES[colorCode];

      if (hexColor && colorName) {
        return {
          code: match[0],
          range,
          colorCode,
          hexColor,
          colorName,
        };
      }
    }
  }

  return null;
}

/**
 * Create a new ANSI code with the same format but different color
 */
export function replaceAnsiColor(
  originalCode: string,
  newColorCode: string
): string {
  const match = parseAnsiCode(originalCode);
  if (!match) {
    return `\\033[${newColorCode}m`;
  }

  if (match.attribute) {
    // Has attribute prefix (like 0; or 1;)
    return originalCode.replace(/(\d+)m$/, `${newColorCode}m`);
  } else {
    // Simple format
    return originalCode.replace(/(\d+)m$/, `${newColorCode}m`);
  }
}
