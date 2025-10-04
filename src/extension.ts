// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// ANSI color code mapping to hex colors
const ANSI_COLOR_MAP: { [key: string]: string } = {
	'30': '#000000', // Black
	'31': '#ff0000', // Red
	'32': '#00ff00', // Green
	'33': '#ffff00', // Yellow
	'34': '#0000ff', // Blue
	'35': '#ff00ff', // Magenta
	'36': '#00ffff', // Cyan
	'37': '#ffffff', // White
	'90': '#808080', // Bright Black (Dark Gray)
	'91': '#ff6b6b', // Bright Red
	'92': '#4ecdc4', // Bright Green
	'93': '#ffe66d', // Bright Yellow
	'94': '#4dabf7', // Bright Blue
	'95': '#da77f2', // Bright Magenta
	'96': '#74c0fc', // Bright Cyan
	'97': '#ffffff'  // Bright White
};

// Regex pattern to match ANSI escape sequences in various formats
// Matches: \033[31m, \033[0;31m, \x1b[31m, \x1b[0;31m, etc.
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

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('ANSI Color Viewer extension is now active!');
	
	// Test the regex pattern with different formats
	const testString1 = 'Red text: \\033[0;31mThis should be red\\033[0m';
	const testString2 = 'Red text: \\x1b[0;31mThis should be red\\x1b[0m';
	const testString3 = '\\033[31mSimple red\\033[0m';
	console.log('Regex test 1 - input:', testString1);
	console.log('Regex test 1 - matches:', testString1.match(ANSI_COLOR_REGEX));
	console.log('Regex test 2 - input:', testString2);
	console.log('Regex test 2 - matches:', testString2.match(ANSI_COLOR_REGEX));
	console.log('Regex test 3 - input:', testString3);
	console.log('Regex test 3 - matches:', testString3.match(ANSI_COLOR_REGEX));

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

	// Add disposables to context subscriptions for proper cleanup
	context.subscriptions.push(onDidChangeActiveTextEditor);
	context.subscriptions.push(onDidChangeTextDocument);
	
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
