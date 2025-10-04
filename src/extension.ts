/**
 * ANSI Color Viewer Extension
 * Main entry point for the VS Code extension
 */
import * as vscode from 'vscode';
import { COMMANDS } from './constants';
import { ColorManager } from './colorManager';
import { DecorationManager } from './decorationManager';
import { AnsiHoverProvider, AnsiColorProvider } from './providers';

/**
 * Extension activation entry point
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('ANSI Color Viewer extension is now active!');

  // Initialize managers
  const decorationManager = new DecorationManager();
  const colorManager = new ColorManager();

  // Connect managers
  colorManager.setDecorationManager(decorationManager);

  // Apply decorations to the currently active editor
  if (vscode.window.activeTextEditor) {
    decorationManager.updateDecorations(vscode.window.activeTextEditor);
  }

  // Listen for active editor changes
  const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor) {
        decorationManager.updateDecorations(editor);
      }
    }
  );

  // Listen for document content changes
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor && event.document === activeEditor.document) {
        decorationManager.updateDecorations(activeEditor);
      }
    }
  );

  // Register the color picker command
  const pickColorCommand = vscode.commands.registerCommand(
    COMMANDS.PICK_COLOR,
    () => colorManager.handlePickColorCommand()
  );

  // Register providers
  const hoverProvider = vscode.languages.registerHoverProvider(
    '*',
    new AnsiHoverProvider()
  );

  const colorProvider = vscode.languages.registerColorProvider(
    '*',
    new AnsiColorProvider()
  );

  // Add disposables to context subscriptions for proper cleanup
  context.subscriptions.push(
    onDidChangeActiveTextEditor,
    onDidChangeTextDocument,
    pickColorCommand,
    hoverProvider,
    colorProvider,
    ...decorationManager.getAllDecorationTypes()
  );

  // Store managers for cleanup
  context.subscriptions.push({
    dispose: () => decorationManager.dispose(),
  });
}

/**
 * Extension deactivation
 */
export function deactivate(): void {
  console.log('ANSI Color Viewer extension deactivated');
}
