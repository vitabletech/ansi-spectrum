# ANSI Color Picker Test

Test the color picker functionality with different ANSI formats:

## Basic Colors

- Red text: `\033[31mThis is red text\033[0m`
- Green background: `\033[42mThis has green background\033[0m`
- Blue text: `\033[34mThis is blue text\033[0m`

## Colors with Attributes

- Bold red: `\033[1;31mThis is bold red\033[0m`
- Underline green: `\033[4;32mThis is underlined green\033[0m`
- Multiple attributes: `\033[1;4;33mBold underlined yellow\033[0m`

## 256-Color Format

- Foreground 256-color: `\033[38;5;196mBright red (196)\033[0m`
- Background 256-color: `\033[48;5;46mBright green background (46)\033[0m`
- Another color: `\033[38;5;129mPurple (129)\033[0m`

## True Color (RGB)

- RGB red: `\033[38;2;255;0;0mTrue red (255,0,0)\033[0m`
- RGB green: `\033[38;2;0;255;0mTrue green (0,255,0)\033[0m`
- RGB blue: `\033[38;2;0;0;255mTrue blue (0,0,255)\033[0m`
- RGB background: `\033[48;2;255;165;0mOrange background (255,165,0)\033[0m`

## Bright Colors

- Bright red: `\033[91mBright red\033[0m`
- Bright cyan: `\033[96mBright cyan\033[0m`
- Bright background: `\033[101mBright red background\033[0m`

## Mixed Format Test

Complex formatting: `\033[1;38;2;255;100;50mBold custom color\033[0m`

Instructions:

1. Open this file in VS Code
2. You should see exactly ONE colored square next to each ANSI escape sequence (no duplicates!)
3. Click on a colored square to open the native color picker
4. Change the color and see it update the ANSI code automatically
5. Test with different formats to ensure all work correctly
6. Verify that there are no duplicate color picker squares
