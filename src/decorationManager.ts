/**
 * DecorationManager - Handles text decorations for ANSI codes
 */
import * as vscode from 'vscode';
import { ANSI_COLOR_MAP, ANSI_COLOR_REGEX } from './constants';
import { DecorationGroup } from './types';

export class DecorationManager {
  private decorationTypes: Record<string, vscode.TextEditorDecorationType> = {};

  /**
   * Create or get decoration type for a specific color
   */
  private getDecorationTypeForColor(
    colorCode: string
  ): vscode.TextEditorDecorationType {
    if (!this.decorationTypes[colorCode]) {
      const hexColor = ANSI_COLOR_MAP[colorCode];
      if (hexColor) {
        this.decorationTypes[colorCode] =
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
    return this.decorationTypes[colorCode];
  }

  /**
   * Find all ANSI codes in document and group by color
   */
  private findAnsiCodes(document: vscode.TextDocument): DecorationGroup {
    const text = document.getText();
    const decorationsByColor: DecorationGroup = {};

    // Find all ANSI color codes in the document
    let match;
    ANSI_COLOR_REGEX.lastIndex = 0; // Reset regex state

    while ((match = ANSI_COLOR_REGEX.exec(text)) !== null) {
      const colorCode = match[2];

      // Check if we have a mapping for this color code
      if (ANSI_COLOR_MAP[colorCode]) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);

        // Group ranges by color code
        if (!decorationsByColor[colorCode]) {
          decorationsByColor[colorCode] = [];
        }
        decorationsByColor[colorCode].push(range);
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

    // Apply decorations for each color
    Object.keys(ANSI_COLOR_MAP).forEach((colorCode) => {
      const decorationType = this.getDecorationTypeForColor(colorCode);
      if (decorationType) {
        const ranges = decorationsByColor[colorCode] || [];
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
