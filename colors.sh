#!/bin/bash

# 🎨 Color definitions for AutoDevKit
# Used for beautiful output formatting

# Basic color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'  # No Color

# Extended colors for better UI
BRIGHT_GREEN='\033[1;32m'
BRIGHT_BLUE='\033[1;34m'
BRIGHT_RED='\033[1;31m'
BRIGHT_YELLOW='\033[1;33m'
BRIGHT_PURPLE='\033[1;35m'
BRIGHT_CYAN='\033[1;36m'
WHITE='\033[1;37m'
ORANGE='\033[0;33m'
MAGENTA='\033[0;95m'
LIGHT_GRAY='\033[0;37m'
DARK_GRAY='\033[1;30m'

# Background colors
BG_RED='\033[41m'
BG_GREEN='\033[42m'
BG_YELLOW='\033[43m'
BG_BLUE='\033[44m'

# Export all colors for use in other scripts
export GREEN BLUE RED YELLOW PURPLE CYAN NC
export BRIGHT_GREEN BRIGHT_BLUE BRIGHT_RED BRIGHT_YELLOW BRIGHT_PURPLE BRIGHT_CYAN
export WHITE ORANGE MAGENTA LIGHT_GRAY DARK_GRAY
export BG_RED BG_GREEN BG_YELLOW BG_BLUE