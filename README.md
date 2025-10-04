# ANSI Color Viewer

A VS Code extension that highlights ANSI escape color codes with their actual colors, making it easier to visualize color-coded text in your files.

## Features

- **Real-time ANSI Color Detection**: Automatically detects ANSI escape sequences like `\033[31m` (Red), `\033[32m` (Green), etc.
- **Visual Color Highlighting**: Highlights the ANSI codes themselves with their corresponding colors
- **Comprehensive Color Support**: Supports all standard ANSI colors (30-37):
  - 30 → Black (#000000)
  - 31 → Red (#ff0000)
  - 32 → Green (#00ff00)
  - 33 → Yellow (#ffff00)
  - 34 → Blue (#0000ff)
  - 35 → Magenta (#ff00ff)
  - 36 → Cyan (#00ffff)
  - 37 → White (#ffffff)
- **Dynamic Updates**: Automatically updates highlighting when:
  - You switch between editors
  - Document content changes
  - New files are opened

## Usage

1. Install the extension
2. Open any file containing ANSI escape codes
3. The extension will automatically highlight the ANSI codes with their corresponding colors

### Example

In a file containing:

```
\033[31mThis is red text\033[0m
\033[32mThis is green text\033[0m
\033[34mThis is blue text\033[0m
```

The ANSI codes (`\033[31m`, `\033[32m`, `\033[34m`) will be highlighted in red, green, and blue respectively.

## Supported ANSI Formats

The extension recognizes both:

- `\033[31m` (simple color code)
- `\033[0;31m` (color code with attributes)

## Requirements

- VS Code 1.104.0 or higher

## Extension Settings

This extension currently does not contribute any VS Code settings. It works automatically without configuration.

## Known Issues

- Currently only supports foreground colors (30-37 range)
- Background colors and extended color formats are not yet supported

## Development

The extension uses a modern, modular architecture for better maintainability:

### Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` to launch a new VS Code window with the extension loaded
5. Open the `test-ansi-colors.txt` file to see the extension in action

### Project Structure

- `src/extension.ts` - Main entry point
- `src/constants.ts` - Color mappings and configurations
- `src/utils.ts` - Utility functions for color operations
- `src/colorManager.ts` - Color picker and selection logic
- `src/decorationManager.ts` - Text decoration management
- `src/providers/` - VS Code language service providers

### Available Scripts

- `npm run compile` - Build the extension
- `npm run watch` - Build in watch mode for development
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Release Notes

### 0.0.1

Initial release of ANSI Color Viewer

- Basic ANSI color code detection (30-37)
- Real-time highlighting with actual colors
- Support for both simple and attribute-based ANSI codes

---

**Enjoy visualizing your ANSI colors!**
