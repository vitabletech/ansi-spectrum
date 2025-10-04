/**
 * ColorProvider - Provides native color picker integration
 */
import * as vscode from 'vscode';
import { ANSI_COLOR_MAP, ANSI_COLOR_REGEX } from '../constants';
import {
  colorToHex,
  hexToColor,
  findClosestAnsiColor,
  parseAnsiCode,
} from '../utils';

export class AnsiColorProvider implements vscode.DocumentColorProvider {
  /**
   * Find all color information in the document
   */
  provideDocumentColors(
    document: vscode.TextDocument
  ): vscode.ColorInformation[] {
    const colors: vscode.ColorInformation[] = [];
    const text = document.getText();

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

        // Convert hex color to VS Code Color object
        const hexColor = ANSI_COLOR_MAP[colorCode];
        const color = hexToColor(hexColor);
        colors.push(new vscode.ColorInformation(range, color));
      }
    }

    return colors;
  }

  /**
   * Provide color presentations when user selects a color
   */
  provideColorPresentations(
    color: vscode.Color,
    context: { document: vscode.TextDocument; range: vscode.Range }
  ): vscode.ColorPresentation[] {
    // Convert VS Code Color back to hex
    const hexColor = colorToHex(color);

    // Find the closest ANSI color code
    const closestCode = findClosestAnsiColor(hexColor);

    // Get the original ANSI code format from the document
    const originalText = context.document.getText(context.range);
    const parsedCode = parseAnsiCode(originalText);

    if (parsedCode) {
      let newAnsiCode: string;
      if (parsedCode.attribute) {
        // Has attribute prefix (like 0; or 1;)
        newAnsiCode = originalText.replace(/(\d+)m$/, `${closestCode}m`);
      } else {
        // Simple format
        newAnsiCode = originalText.replace(/(\d+)m$/, `${closestCode}m`);
      }

      const presentation = new vscode.ColorPresentation(newAnsiCode);
      presentation.textEdit = new vscode.TextEdit(context.range, newAnsiCode);
      return [presentation];
    }

    const defaultPresentation = new vscode.ColorPresentation(
      `\\033[${closestCode}m`
    );
    defaultPresentation.textEdit = new vscode.TextEdit(
      context.range,
      `\\033[${closestCode}m`
    );
    return [defaultPresentation];
  }
}
