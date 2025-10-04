# ANSI Spectrum

� **Ultimate Visualization**

_The most comprehensive ANSI escape sequence visualization extension for VS Code_

Transform your development experience with complete ANSI escape sequence visualization. ANSI Spectrum not only highlights ANSI color codes with their actual colors but also provides native color picker integration and supports all modern ANSI formats used in terminal applications, logs, and documentation.

![Demo](https://raw.githubusercontent.com/vitabletech/ansi-spectrum/main/images/image.gif)

## 🚀 Key Features

### 🎯 **Native Color Picker Integration**

- **Click-to-Edit Colors**: Click on any colored square to open VS Code's native color picker
- **Intelligent Color Conversion**: Automatically converts your color selection back to the appropriate ANSI format
- **Format Preservation**: Maintains your original escape sequence style (\033, \x1b, \e)

### 🌈 **Comprehensive ANSI Format Support**

- **Basic Colors (30-37, 40-47)**: Standard 8 foreground and background colors
- **Bright Colors (90-97, 100-107)**: High-intensity color variants
- **256-Color Palette**: Full support for `\033[38;5;n` and `\033[48;5;n` formats
- **True RGB Colors**: 24-bit color support with `\033[38;2;r;g;b` format
- **Complex Sequences**: Handles colors with attributes like `\033[1;31m` (bold red)

### 🔍 **Smart Visual Indicators**

- **Real-time Detection**: Instantly highlights ANSI codes as you type
- **Accurate Color Rendering**: Shows exact colors as they would appear in terminals
- **Hover Information**: Detailed color information on hover
- **Global Compatibility**: Works with all common ANSI escape sequence variations

### ⚡ **Developer-Friendly Features**

- **Zero Configuration**: Works out of the box
- **Performance Optimized**: Efficient regex processing with no duplicate detection
- **Multi-Format Support**: Handles escaped (`\033`) and raw (`\x1b`) sequences
- **Dynamic Updates**: Real-time highlighting as you edit

## 🏆 Why Choose ANSI Spectrum?

### **For Log Analysis & Debugging**

- Instantly understand colored terminal output in log files
- Visualize application logging with color-coded severity levels
- Debug ANSI-colored CLI tools and scripts

### **For Documentation & Examples**

- Create clear documentation for terminal applications
- Visualize README examples with colored output
- Demonstrate CLI tool functionality with accurate colors

### **For Development & Testing**

- Test ANSI color implementations in your applications
- Validate color output across different formats (basic, 256-color, RGB)
- Quick color adjustments with the integrated color picker

### **Superior to Alternatives**

- ✅ **Most Comprehensive**: Supports ALL ANSI formats (basic, 256-color, RGB)
- ✅ **Native Integration**: Uses VS Code's built-in color picker system
- ✅ **Format Intelligent**: Preserves your original escape sequence style
- ✅ **Performance Focused**: Optimized regex processing with smart deduplication
- ✅ **Zero Setup**: Works immediately without configuration

## Usage

1. Install the extension
2. Open any file containing ANSI escape codes
3. The extension will automatically highlight the ANSI codes with their corresponding colors

### 📝 Examples

**Basic Colors:**

```bash
\033[31mRed text\033[0m
\033[32mGreen text\033[0m
\033[34mBlue text\033[0m
```

**Colors with Attributes:**

```bash
\033[1;31mBold red text\033[0m
\033[4;32mUnderlined green\033[0m
```

**256-Color Palette:**

```bash
\033[38;5;196mBright red (196)\033[0m
\033[48;5;46mGreen background (46)\033[0m
```

**True RGB Colors:**

```bash
\033[38;2;255;100;50mCustom orange\033[0m
\033[48;2;0;150;255mCustom blue background\033[0m
```

**Interactive Color Editing:**

1. 🎨 **Colored squares** appear next to each ANSI sequence
2. 🖱️ **Click** on any square to open the color picker
3. 🎯 **Select** your desired color
4. ✨ **Watch** the ANSI code update automatically!

## 📋 Supported ANSI Formats

### **Escape Sequence Prefixes**

- `\033[` - Octal notation (most common)
- `\x1b[` - Hexadecimal notation
- `\e[` - Shell-specific notation
- Raw ESC character sequences

### **Color Format Types**

- **Basic Colors**: `\033[31m` (foreground), `\033[41m` (background)
- **Bright Colors**: `\033[91m` (bright foreground), `\033[101m` (bright background)
- **With Attributes**: `\033[1;31m`, `\033[4;32m`, `\033[0;1;33m`
- **256-Color**: `\033[38;5;196m` (foreground), `\033[48;5;46m` (background)
- **True RGB**: `\033[38;2;255;0;0m` (foreground), `\033[48;2;0;255;0m` (background)

### **Supported Color Ranges**

- **Standard (30-37, 40-47)**: 16 basic colors
- **Bright (90-97, 100-107)**: 16 high-intensity colors
- **256-Color Palette**: Complete 256-color support
- **24-bit RGB**: Full true color spectrum

## Requirements

- VS Code 1.104.0 or higher

## Extension Settings

This extension currently does not contribute any VS Code settings. It works automatically without configuration.

## ✅ Current Status

**Fully Implemented:**

- ✅ All ANSI color formats (basic, 256-color, RGB)
- ✅ Foreground and background colors
- ✅ Native color picker integration
- ✅ Smart format preservation
- ✅ Performance optimized processing
- ✅ Global escape sequence compatibility

**Roadmap:**

- 🔄 Additional text styling attributes
- 🔄 Color palette themes
- 🔄 Batch color operations

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

## 📈 Release Notes

### 0.0.1

**🎉 ANSI Spectrum - Ultimate Visualization Release**

**Core Features:**

- ✨ Complete ANSI color format support (basic, 256-color, RGB)
- 🎨 Native VS Code color picker integration
- 🔍 Real-time color visualization
- ⚡ Performance-optimized processing
- 🌐 Global escape sequence compatibility

**Technical Highlights:**

- Modular TypeScript architecture
- Smart duplicate detection prevention
- Format-preserving color conversions
- Comprehensive regex pattern matching
- Zero-configuration setup

---

**🌈 Experience the Ultimate ANSI Visualization with ANSI Spectrum!**
