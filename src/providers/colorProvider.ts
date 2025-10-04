/**
 * ColorProvider - Provides native color picker integration
 */
import * as vscode from 'vscode';
import {
  ANSI_COLOR_MAP,
  ANSI_REGEX_PATTERNS,
  ANSI_256_COLORS,
} from '../constants';
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
    const processedRanges = new Set<string>(); // Track processed ranges to avoid duplicates
    const text = document.getText();

    // Use a single comprehensive approach to avoid overlapping matches
    this.processAllAnsiColors(text, document, colors, processedRanges);

    return colors;
  }

  private processAllAnsiColors(
    text: string,
    document: vscode.TextDocument,
    colors: vscode.ColorInformation[],
    processedRanges: Set<string>
  ): void {
    // Process all ANSI patterns in order of specificity (most specific first)

    // 1. True color patterns (most specific)
    this.processTrueColors(text, document, colors, processedRanges);

    // 2. 256-color patterns
    this.process256Colors(text, document, colors, processedRanges);

    // 3. Basic color patterns (least specific, but process both basic and with-attributes together)
    this.processBasicColors(text, document, colors, processedRanges);
  }

  private processBasicColors(
    text: string,
    document: vscode.TextDocument,
    colors: vscode.ColorInformation[],
    processedRanges: Set<string>
  ): void {
    // Use the WITH_ATTRIBUTES pattern as it covers both basic and attributed colors
    // This avoids duplicate matches between basic and with-attributes patterns
    const pattern = new RegExp(ANSI_REGEX_PATTERNS.WITH_ATTRIBUTES.source, 'g');

    let match;
    pattern.lastIndex = 0;

    while ((match = pattern.exec(text)) !== null) {
      const colorCode = match[1]; // Color code is in first capture group
      const rangeKey = `${match.index}-${match.index + match[0].length}`;

      // Skip if already processed
      if (processedRanges.has(rangeKey)) {
        continue;
      }

      if (ANSI_COLOR_MAP[colorCode]) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);

        const hexColor = ANSI_COLOR_MAP[colorCode];
        const color = hexToColor(hexColor);
        colors.push(new vscode.ColorInformation(range, color));
        processedRanges.add(rangeKey);
      }
    }
  }

  private process256Colors(
    text: string,
    document: vscode.TextDocument,
    colors: vscode.ColorInformation[],
    processedRanges: Set<string>
  ): void {
    // Process 256-color ANSI codes
    const patterns = [
      new RegExp(ANSI_REGEX_PATTERNS.COLOR_256_FG.source, 'g'),
      new RegExp(ANSI_REGEX_PATTERNS.COLOR_256_BG.source, 'g'),
    ];

    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(text)) !== null) {
        const colorIndex = parseInt(match[1], 10);
        const rangeKey = `${match.index}-${match.index + match[0].length}`;

        // Skip if already processed
        if (processedRanges.has(rangeKey)) {
          continue;
        }

        if (colorIndex >= 0 && colorIndex < ANSI_256_COLORS.length) {
          const startPos = document.positionAt(match.index);
          const endPos = document.positionAt(match.index + match[0].length);
          const range = new vscode.Range(startPos, endPos);

          const hexColor = ANSI_256_COLORS[colorIndex];
          const color = hexToColor(hexColor);
          colors.push(new vscode.ColorInformation(range, color));
          processedRanges.add(rangeKey);
        }
      }
    }
  }

  private processTrueColors(
    text: string,
    document: vscode.TextDocument,
    colors: vscode.ColorInformation[],
    processedRanges: Set<string>
  ): void {
    // Process true color (RGB) ANSI codes
    const patterns = [
      new RegExp(ANSI_REGEX_PATTERNS.TRUE_COLOR_FG.source, 'g'),
      new RegExp(ANSI_REGEX_PATTERNS.TRUE_COLOR_BG.source, 'g'),
    ];

    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(text)) !== null) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const rangeKey = `${match.index}-${match.index + match[0].length}`;

        // Skip if already processed
        if (processedRanges.has(rangeKey)) {
          continue;
        }

        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
          const startPos = document.positionAt(match.index);
          const endPos = document.positionAt(match.index + match[0].length);
          const range = new vscode.Range(startPos, endPos);

          // Convert RGB to VS Code Color
          const color = new vscode.Color(r / 255, g / 255, b / 255, 1.0);
          colors.push(new vscode.ColorInformation(range, color));
          processedRanges.add(rangeKey);
        }
      }
    }
  }

  /**
   * Provide color presentations when user selects a color
   */
  provideColorPresentations(
    color: vscode.Color,
    context: { document: vscode.TextDocument; range: vscode.Range }
  ): vscode.ColorPresentation[] {
    const originalText = context.document.getText(context.range);
    const presentations: vscode.ColorPresentation[] = [];

    // Determine the type of ANSI sequence and create appropriate replacement
    const colorType = this.detectColorType(originalText);

    switch (colorType.type) {
      case 'basic':
      case 'with_attributes':
        presentations.push(
          ...this.createBasicColorPresentations(
            color,
            originalText,
            context.range
          )
        );
        break;
      case '256_color':
        presentations.push(
          ...this.create256ColorPresentations(
            color,
            originalText,
            context.range,
            colorType.isForeground
          )
        );
        break;
      case 'true_color':
        presentations.push(
          ...this.createTrueColorPresentations(
            color,
            originalText,
            context.range,
            colorType.isForeground
          )
        );
        break;
      default:
        // Fallback to basic format
        presentations.push(
          ...this.createBasicColorPresentations(
            color,
            originalText,
            context.range
          )
        );
    }

    return presentations;
  }

  private detectColorType(text: string): {
    type: string;
    isForeground?: boolean;
  } {
    if (new RegExp(ANSI_REGEX_PATTERNS.TRUE_COLOR_FG.source).test(text)) {
      return { type: 'true_color', isForeground: true };
    }
    if (new RegExp(ANSI_REGEX_PATTERNS.TRUE_COLOR_BG.source).test(text)) {
      return { type: 'true_color', isForeground: false };
    }
    if (new RegExp(ANSI_REGEX_PATTERNS.COLOR_256_FG.source).test(text)) {
      return { type: '256_color', isForeground: true };
    }
    if (new RegExp(ANSI_REGEX_PATTERNS.COLOR_256_BG.source).test(text)) {
      return { type: '256_color', isForeground: false };
    }
    if (new RegExp(ANSI_REGEX_PATTERNS.WITH_ATTRIBUTES.source).test(text)) {
      return { type: 'with_attributes' };
    }
    return { type: 'basic' };
  }

  private createBasicColorPresentations(
    color: vscode.Color,
    originalText: string,
    range: vscode.Range
  ): vscode.ColorPresentation[] {
    const hexColor = colorToHex(color);
    const closestCode = findClosestAnsiColor(hexColor);

    // Try to preserve the original format structure
    let newText: string;
    if (originalText.includes(';')) {
      // Has attributes, replace only the last number
      newText = originalText.replace(/(\d+)m$/, `${closestCode}m`);
    } else {
      // Simple format
      newText = originalText.replace(/(\d+)m$/, `${closestCode}m`);
    }

    const presentation = new vscode.ColorPresentation(newText);
    presentation.textEdit = new vscode.TextEdit(range, newText);
    return [presentation];
  }

  private create256ColorPresentations(
    color: vscode.Color,
    originalText: string,
    range: vscode.Range,
    isForeground: boolean = true
  ): vscode.ColorPresentation[] {
    const presentations: vscode.ColorPresentation[] = [];

    // Convert to RGB and find closest 256-color index
    const r = Math.round(color.red * 255);
    const g = Math.round(color.green * 255);
    const b = Math.round(color.blue * 255);

    // Find closest color in 256-color palette
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < ANSI_256_COLORS.length; i++) {
      const hexColor = ANSI_256_COLORS[i];
      const paletteR = parseInt(hexColor.slice(1, 3), 16);
      const paletteG = parseInt(hexColor.slice(3, 5), 16);
      const paletteB = parseInt(hexColor.slice(5, 7), 16);

      const distance = Math.sqrt(
        Math.pow(r - paletteR, 2) +
          Math.pow(g - paletteG, 2) +
          Math.pow(b - paletteB, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    // Extract the escape prefix from original text
    const escapePrefix =
      originalText.match(/^\\(?:033|x1b|e)\[/)?.[0] || '\\033[';
    const colorTypeCode = isForeground ? '38' : '48';
    const newText = `${escapePrefix}${colorTypeCode};5;${closestIndex}m`;

    const presentation = new vscode.ColorPresentation(newText);
    presentation.textEdit = new vscode.TextEdit(range, newText);
    presentations.push(presentation);

    return presentations;
  }

  private createTrueColorPresentations(
    color: vscode.Color,
    originalText: string,
    range: vscode.Range,
    isForeground: boolean = true
  ): vscode.ColorPresentation[] {
    const r = Math.round(color.red * 255);
    const g = Math.round(color.green * 255);
    const b = Math.round(color.blue * 255);

    // Extract the escape prefix from original text
    const escapePrefix =
      originalText.match(/^\\(?:033|x1b|e)\[/)?.[0] || '\\033[';
    const colorTypeCode = isForeground ? '38' : '48';
    const newText = `${escapePrefix}${colorTypeCode};2;${r};${g};${b}m`;

    const presentation = new vscode.ColorPresentation(newText);
    presentation.textEdit = new vscode.TextEdit(range, newText);
    return [presentation];
  }
}
