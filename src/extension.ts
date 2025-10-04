// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// ANSI color code mapping to hex colors
const ANSI_COLOR_MAP: { [key: string]: string } = {
	// Standard colors (30-37)
	'30': '#000000', // Black
	'31': '#ff0000', // Red
	'32': '#00ff00', // Green
	'33': '#ffff00', // Yellow
	'34': '#0000ff', // Blue
	'35': '#ff00ff', // Magenta
	'36': '#00ffff', // Cyan
	'37': '#ffffff', // White
	
	// Background colors (40-47)
	'40': '#000000', // BG Black
	'41': '#ff0000', // BG Red
	'42': '#00ff00', // BG Green
	'43': '#ffff00', // BG Yellow
	'44': '#0000ff', // BG Blue
	'45': '#ff00ff', // BG Magenta
	'46': '#00ffff', // BG Cyan
	'47': '#ffffff', // BG White
	
	// Bright colors (90-97)
	'90': '#808080', // Bright Black (Dark Gray)
	'91': '#ff6b6b', // Bright Red
	'92': '#4ecdc4', // Bright Green
	'93': '#ffe66d', // Bright Yellow
	'94': '#4dabf7', // Bright Blue
	'95': '#da77f2', // Bright Magenta
	'96': '#74c0fc', // Bright Cyan
	'97': '#ffffff'  // Bright White
};

// Color name mappings for the color picker
const COLOR_NAMES: { [key: string]: string } = {
	'30': 'Black', '31': 'Red', '32': 'Green', '33': 'Yellow',
	'34': 'Blue', '35': 'Magenta', '36': 'Cyan', '37': 'White',
	'40': 'BG Black', '41': 'BG Red', '42': 'BG Green', '43': 'BG Yellow',
	'44': 'BG Blue', '45': 'BG Magenta', '46': 'BG Cyan', '47': 'BG White',
	'90': 'Bright Black', '91': 'Bright Red', '92': 'Bright Green', '93': 'Bright Yellow',
	'94': 'Bright Blue', '95': 'Bright Magenta', '96': 'Bright Cyan', '97': 'Bright White'
};

// Regex pattern to match ANSI escape sequences in various formats
// Matches: \033[31m, \033[0;31m, \033[1;30m, \x1b[31m, etc.
const ANSI_COLOR_REGEX = /\\(?:033|x1b)\[(?:(\d+);)?(\d+)m/g;

// Store decoration types for each color
const colorDecorationTypes: { [key: string]: vscode.TextEditorDecorationType } = {};

// Function to create or get decoration type for a specific color
function getDecorationTypeForColor(colorCode: string): vscode.TextEditorDecorationType {
	if (!colorDecorationTypes[colorCode]) {
		const hexColor = ANSI_COLOR_MAP[colorCode];
		if (hexColor) {
			colorDecorationTypes[colorCode] = vscode.window.createTextEditorDecorationType({
				color: hexColor
			});
		}
	}
	return colorDecorationTypes[colorCode];
}

// Function to apply decorations to the active text editor
function updateDecorations(editor: vscode.TextEditor) {
	if (!editor) {
		return;
	}

	const text = editor.document.getText();
	const decorationsByColor: { [key: string]: vscode.Range[] } = {};

	// Find all ANSI color codes in the document
	let match;
	ANSI_COLOR_REGEX.lastIndex = 0; // Reset regex state
	
	console.log('Searching for ANSI codes in:', editor.document.fileName);
	
	while ((match = ANSI_COLOR_REGEX.exec(text)) !== null) {
		console.log('Found match:', match[0], 'Groups:', match[1], match[2]);
		
		// Extract the color code (the second capture group)
		const colorCode = match[2];
		
		// Check if we have a mapping for this color code
		if (ANSI_COLOR_MAP[colorCode]) {
			console.log('Mapping found for color code:', colorCode, '→', ANSI_COLOR_MAP[colorCode]);
			
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			const range = new vscode.Range(startPos, endPos);
			
			// Group ranges by color code
			if (!decorationsByColor[colorCode]) {
				decorationsByColor[colorCode] = [];
			}
			decorationsByColor[colorCode].push(range);
		} else {
			console.log('No mapping found for color code:', colorCode);
		}
	}

	console.log('Decorations to apply:', decorationsByColor);

	// Apply decorations for each color
	Object.keys(ANSI_COLOR_MAP).forEach(colorCode => {
		const decorationType = getDecorationTypeForColor(colorCode);
		if (decorationType) {
			const ranges = decorationsByColor[colorCode] || [];
			editor.setDecorations(decorationType, ranges);
		}
	});
}

// Function to find ANSI code at cursor position
function getAnsiCodeAtPosition(document: vscode.TextDocument, position: vscode.Position): { code: string, range: vscode.Range } | null {
	const line = document.lineAt(position.line);
	const text = line.text;
	
	// Reset regex and find all matches in the line
	ANSI_COLOR_REGEX.lastIndex = 0;
	let match;
	
	while ((match = ANSI_COLOR_REGEX.exec(text)) !== null) {
		const startPos = new vscode.Position(position.line, match.index);
		const endPos = new vscode.Position(position.line, match.index + match[0].length);
		const range = new vscode.Range(startPos, endPos);
		
		// Check if cursor is within this ANSI code
		if (range.contains(position)) {
			return { code: match[0], range };
		}
	}
	
	return null;
}

// Function to show color picker
async function showColorPicker(editor: vscode.TextEditor, ansiInfo: { code: string, range: vscode.Range }) {
	// Extract current color code
	const match = ansiInfo.code.match(/\\(?:033|x1b)\[(?:(\d+);)?(\d+)m/);
	if (!match) {
		return;
	}
	
	const currentColorCode = match[2];
	
	// Create quick pick items for all available colors
	const colorItems: vscode.QuickPickItem[] = Object.keys(ANSI_COLOR_MAP).map(code => ({
		label: `\\033[${code}m`,
		description: COLOR_NAMES[code],
		detail: `Color: ${ANSI_COLOR_MAP[code]}`,
		picked: code === currentColorCode
	}));
	
	const selectedItem = await vscode.window.showQuickPick(colorItems, {
		placeHolder: 'Select a new ANSI color',
		matchOnDescription: true,
		matchOnDetail: true
	});
	
	if (selectedItem) {
		// Extract the color code from the selected item
		const newCode = selectedItem.label.match(/\\033\[(\d+)m/)?.[1];
		if (newCode) {
			// Create the new ANSI code maintaining the same format as original
			let newAnsiCode: string;
			if (ansiInfo.code.includes(';')) {
				// Maintain attribute format like \033[0;31m
				const attr = match[1] || '0';
				newAnsiCode = ansiInfo.code.replace(/(\d+)m$/, `${newCode}m`);
			} else {
				// Simple format like \033[31m
				newAnsiCode = ansiInfo.code.replace(/(\d+)m$/, `${newCode}m`);
			}
			
			// Replace the text
			await editor.edit(editBuilder => {
				editBuilder.replace(ansiInfo.range, newAnsiCode);
			});
			
			// Trigger decoration update
			updateDecorations(editor);
		}
	}
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('ANSI Color Viewer extension is now active!');

	// Apply decorations to the currently active editor
	if (vscode.window.activeTextEditor) {
		updateDecorations(vscode.window.activeTextEditor);
	}

	// Listen for active editor changes
	const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDecorations(editor);
		}
	});

	// Listen for document content changes
	const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && event.document === activeEditor.document) {
			updateDecorations(activeEditor);
		}
	});

	// Register the color picker command
	const pickColorCommand = vscode.commands.registerCommand('ansi-color-viewer.pickColor', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found');
			return;
		}
		
		const position = editor.selection.active;
		const ansiInfo = getAnsiCodeAtPosition(editor.document, position);
		
		if (ansiInfo) {
			await showColorPicker(editor, ansiInfo);
		} else {
			vscode.window.showInformationMessage('Cursor is not on an ANSI color code. Place cursor on a code like \\033[31m');
		}
	});

	// Register hover provider
	const hoverProvider = vscode.languages.registerHoverProvider('*', {
		provideHover(document, position) {
			const ansiInfo = getAnsiCodeAtPosition(document, position);
			if (!ansiInfo) {
				return;
			}
			
			// Extract color code
			const match = ansiInfo.code.match(/\\(?:033|x1b)\[(?:(\d+);)?(\d+)m/);
			if (!match) {
				return;
			}
			
			const colorCode = match[2];
			const colorName = COLOR_NAMES[colorCode];
			const hexColor = ANSI_COLOR_MAP[colorCode];
			
			if (!colorName || !hexColor) {
				return;
			}
			
			const markdown = new vscode.MarkdownString();
			markdown.appendMarkdown(`**ANSI Color Code**: \`${ansiInfo.code}\`\n\n`);
			markdown.appendMarkdown(`**Color**: ${colorName}\n\n`);
			markdown.appendMarkdown(`**Hex Value**: \`${hexColor}\`\n\n`);
			markdown.appendMarkdown(`---\n\n`);
			markdown.appendMarkdown(`💡 **Tip**: Right-click and select "Pick ANSI Color" to change this color`);
			
			return new vscode.Hover(markdown, ansiInfo.range);
		}
	});

	// Add disposables to context subscriptions for proper cleanup
	context.subscriptions.push(onDidChangeActiveTextEditor);
	context.subscriptions.push(onDidChangeTextDocument);
	context.subscriptions.push(pickColorCommand);
	context.subscriptions.push(hoverProvider);
	
	// Add all decoration types to context subscriptions for cleanup
	context.subscriptions.push(...Object.values(colorDecorationTypes));
}

// This method is called when your extension is deactivated
export function deactivate() {
	// Dispose of all decoration types
	Object.values(colorDecorationTypes).forEach(decorationType => {
		decorationType.dispose();
	});
}
