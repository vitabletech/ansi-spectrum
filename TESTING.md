# 🧪 Testing Guide for ANSI Color Viewer Extension

## Method 1: Launch Extension Development Host (Recommended)

1. **Open VS Code** with your extension project
2. **Press F5** - This launches a new "Extension Development Host" window
3. **In the new window**, open your `colors.sh` file
4. **Check the Developer Console** for debug logs:
   - Go to `Help > Toggle Developer Tools`
   - Look at the Console tab for extension logs

## Method 2: Install Extension Locally

1. **Package the extension**:
   ```bash
   npx vsce package
   ```

2. **Install the .vsix file**:
   ```bash
   code --install-extension ansi-color-viewer-0.0.1.vsix
   ```

## What Should Happen

When you open `colors.sh`, you should see:

- `\033[0;32m` highlighted in **green**
- `\033[0;34m` highlighted in **blue** 
- `\033[0;31m` highlighted in **red**
- `\033[1;33m` highlighted in **bright yellow**
- `\033[0;35m` highlighted in **magenta**
- `\033[0;36m` highlighted in **cyan**
- And more...

## Troubleshooting

### If colors don't appear:

1. **Check Developer Console** - Look for error messages
2. **Reload the Extension Host Window** - Press `Ctrl+R` (Cmd+R on Mac)
3. **Check file is open** - Make sure `colors.sh` is the active editor
4. **Try switching tabs** - Open another file, then switch back to `colors.sh`

### Debug Information

The extension now logs debug information to help troubleshoot:
- What files it's processing
- What ANSI codes it finds
- What colors are being applied

## Test Files

- `colors.sh` - Your shell color definitions
- `test-ansi-colors.txt` - Sample ANSI codes with text

## Expected Results in colors.sh

Your file contains codes like:
- `GREEN='\033[0;32m'` - The `\033[0;32m` should be highlighted in green
- `BRIGHT_YELLOW='\033[1;33m'` - The `\033[1;33m` should be highlighted in bright yellow
- `MAGENTA='\033[0;95m'` - The `\033[0;95m` should be highlighted in bright magenta

The extension highlights the ANSI escape codes themselves, not the variable names or surrounding text.