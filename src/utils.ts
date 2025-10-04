/**
 * Utility functions for ANSI Color Viewer extension
 */
import * as vscode from 'vscode';
import { ANSI_COLOR_MAP, COLOR_NAMES, ANSI_COLOR_REGEX } from './constants';
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
 * Parse ANSI color code and extract components
 */
export function parseAnsiCode(ansiCode: string): ColorMatch | null {
  const match = ansiCode.match(/\\(?:033|x1b)\[(?:(\d+);)?(\d+)m/);
  if (!match) {
    return null;
  }

  return {
    fullMatch: match[0],
    colorCode: match[2],
    attribute: match[1],
    startIndex: 0,
    endIndex: match[0].length,
  };
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
