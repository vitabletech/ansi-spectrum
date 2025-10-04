/**
 * DecorationManager - Handles text decorations for ANSI codes
 */
import * as vscode from 'vscode';
import { ANSI_COLOR_MAP, ANSI_COLOR_REGEX } from './constants';
import { DecorationGroup } from './types';

export class DecorationManager {
  private decorationTypes: Record<string, vscode.TextEditorDecorationType> = {};

  /**
   * Safely extract color code from regex match with fallbacks
   */
  private extractColorCodeSafely(match: RegExpExecArray): string | null {
    // Try different capture groups that might contain the color code
    for (let i = match.length - 1; i >= 1; i--) {
      if (match[i] && match[i].match(/^\d+$/)) {
        return match[i];
      }
    }
    return null;
  }

  /**
   * Create or get decoration type for a specific color - Enhanced for all formats
   */
  private getDecorationTypeForColor(
    colorKey: string
  ): vscode.TextEditorDecorationType {
    if (!this.decorationTypes[colorKey]) {
      // colorKey might be a hex color directly or an ANSI code
      let hexColor: string;

      if (colorKey.startsWith('#')) {
        // Already a hex color
        hexColor = colorKey;
      } else {
        // Look up in ANSI_COLOR_MAP
        hexColor = ANSI_COLOR_MAP[colorKey];
      }

      if (hexColor) {
        this.decorationTypes[colorKey] =
          vscode.window.createTextEditorDecorationType({
            color: hexColor,
            before: {
              contentText: '●',
              color: hexColor,
              margin: '0 4px 0 0',
            },
          });
      }
    }
    return this.decorationTypes[colorKey];
  }

  /**
   * Find all ANSI codes in document and group by color - Enhanced for all formats
   */
  private findAnsiCodes(document: vscode.TextDocument): DecorationGroup {
    const text = document.getText();
    const decorationsByColor: DecorationGroup = {};

    // Import utilities to handle complex ANSI codes
    const { parseAnsiCode, getColorFromAnsiCode } = require('./utils');

    // Find all ANSI color codes in the document using comprehensive regex
    let match;
    ANSI_COLOR_REGEX.lastIndex = 0; // Reset regex state

    while ((match = ANSI_COLOR_REGEX.exec(text)) !== null) {
      try {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);

        // Get the actual color for this ANSI code
        const hexColor = getColorFromAnsiCode(match[0]);

        if (hexColor) {
          // Use hex color as key for grouping
          const colorKey = hexColor;

          if (!decorationsByColor[colorKey]) {
            decorationsByColor[colorKey] = [];
          }
          decorationsByColor[colorKey].push(range);
        } else {
          // Fallback to standard parsing for compatibility
          const colorCode = this.extractColorCodeSafely(match);
          if (colorCode && ANSI_COLOR_MAP[colorCode]) {
            if (!decorationsByColor[colorCode]) {
              decorationsByColor[colorCode] = [];
            }
            decorationsByColor[colorCode].push(range);
          }
        }
      } catch (error) {
        // Silently skip invalid ANSI codes
        console.warn(
          `Failed to parse ANSI code at position ${match.index}:`,
          error
        );
        continue;
      }
    }

    return decorationsByColor;
  }

  /**
   * Apply decorations to the active text editor
   */
  updateDecorations(editor: vscode.TextEditor): void {
    if (!editor) {
      return;
    }

    console.log('Updating decorations for:', editor.document.fileName);

    const decorationsByColor = this.findAnsiCodes(editor.document);

    // Clear existing decorations first
    Object.values(this.decorationTypes).forEach((decoration) => {
      editor.setDecorations(decoration, []);
    });

    // Apply decorations for each color found
    Object.keys(decorationsByColor).forEach((colorKey) => {
      const decorationType = this.getDecorationTypeForColor(colorKey);
      if (decorationType) {
        const ranges = decorationsByColor[colorKey] || [];
        editor.setDecorations(decorationType, ranges);
      }
    });

    console.log('Applied decorations:', Object.keys(decorationsByColor));
  }

  /**
   * Get all decoration types for cleanup
   */
  getAllDecorationTypes(): vscode.TextEditorDecorationType[] {
    return Object.values(this.decorationTypes);
  }

  /**
   * Dispose all decoration types
   */
  dispose(): void {
    Object.values(this.decorationTypes).forEach((decorationType) => {
      decorationType.dispose();
    });
    this.decorationTypes = {};
  }
}
