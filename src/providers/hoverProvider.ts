/**
 * HoverProvider - Provides hover information for ANSI codes
 */
import * as vscode from 'vscode';
import { getAnsiCodeAtPosition } from '../utils';

export class AnsiHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | undefined {
    const ansiInfo = getAnsiCodeAtPosition(document, position);
    if (!ansiInfo) {
      return;
    }

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`**ANSI Color Code**: \`${ansiInfo.code}\`\n\n`);
    markdown.appendMarkdown(`**Color**: ${ansiInfo.colorName}\n\n`);
    markdown.appendMarkdown(`**Hex Value**: \`${ansiInfo.hexColor}\`\n\n`);
    markdown.appendMarkdown(`---\n\n`);
    markdown.appendMarkdown(
      `💡 **Tip**: Click the color swatch to open native color picker`
    );

    return new vscode.Hover(markdown, ansiInfo.range);
  }
}
