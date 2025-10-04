/**
 * ColorManager - Handles all color-related operations
 */
import * as vscode from 'vscode';
import { ANSI_COLOR_MAP, COLOR_NAMES } from './constants';
import { AnsiColorInfo } from './types';
import { getAnsiCodeAtPosition, replaceAnsiColor } from './utils';

export class ColorManager {
  private decorationManager?: import('./decorationManager').DecorationManager;

  /**
   * Set the decoration manager for triggering updates
   */
  setDecorationManager(
    decorationManager: import('./decorationManager').DecorationManager
  ): void {
    this.decorationManager = decorationManager;
  }

  /**
   * Show color picker dialog for ANSI code selection
   */
  async showColorPicker(
    editor: vscode.TextEditor,
    ansiInfo: AnsiColorInfo
  ): Promise<void> {
    // Create quick pick items for all available colors
    const colorItems: vscode.QuickPickItem[] = Object.keys(ANSI_COLOR_MAP).map(
      (code) => ({
        label: `\\033[${code}m`,
        description: COLOR_NAMES[code],
        detail: `Color: ${ANSI_COLOR_MAP[code]}`,
        picked: code === ansiInfo.colorCode,
      })
    );

    const selectedItem = await vscode.window.showQuickPick(colorItems, {
      placeHolder: 'Select a new ANSI color',
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (selectedItem) {
      const newCode = selectedItem.label.match(/\\033\[(\d+)m/)?.[1];
      if (newCode) {
        const newAnsiCode = replaceAnsiColor(ansiInfo.code, newCode);

        await editor.edit((editBuilder) => {
          editBuilder.replace(ansiInfo.range, newAnsiCode);
        });

        // Trigger decoration update
        if (this.decorationManager) {
          this.decorationManager.updateDecorations(editor);
        }
      }
    }
  }

  /**
   * Handle color picker command
   */
  async handlePickColorCommand(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const position = editor.selection.active;
    const ansiInfo = getAnsiCodeAtPosition(editor.document, position);

    if (ansiInfo) {
      await this.showColorPicker(editor, ansiInfo);
    } else {
      vscode.window.showInformationMessage(
        'Cursor is not on an ANSI color code. Place cursor on a code like \\033[31m'
      );
    }
  }
}
