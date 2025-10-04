# Refactored ANSI Color Viewer Extension

## 📁 **New Project Structure**

The extension has been refactored into a clean, modular architecture:

```
src/
├── extension.ts           # Main entry point - clean and focused
├── constants.ts           # Color mappings and regex patterns
├── types.ts              # TypeScript interfaces and types
├── utils.ts              # Utility functions for color operations
├── colorManager.ts       # Handles color picker interactions
├── decorationManager.ts  # Manages text decorations
└── providers/
    ├── index.ts          # Provider exports
    ├── hoverProvider.ts  # Hover tooltips
    └── colorProvider.ts  # Native color picker integration
```

## 🏗️ **Architecture Overview**

### **Main Components**

1. **Extension.ts** - Clean entry point that orchestrates all components
2. **ColorManager** - Handles color selection and replacement logic
3. **DecorationManager** - Manages text highlighting and visual decorations
4. **Providers** - VS Code language service providers (hover, color picker)
5. **Utils** - Pure functions for color calculations and ANSI parsing

### **Key Improvements**

✅ **Separation of Concerns** - Each file has a single responsibility
✅ **Type Safety** - Proper TypeScript interfaces and types
✅ **Testability** - Modular functions that can be easily unit tested
✅ **Maintainability** - Clean interfaces between components
✅ **Extensibility** - Easy to add new features without touching core logic

## 🔧 **Development Benefits**

- **Easier Debugging** - Issues can be isolated to specific modules
- **Better Code Organization** - Related functionality is grouped together
- **Improved Readability** - Smaller, focused files are easier to understand
- **Enhanced Reusability** - Utility functions can be reused across modules
- **Simplified Testing** - Each component can be tested in isolation

## 🚀 **Usage**

The extension works exactly the same as before, but now with:

- Better performance due to optimized code structure
- More reliable error handling
- Cleaner logging and debugging information
- Easier maintenance and future development

All your existing functionality remains intact:

- ANSI code highlighting with color swatches
- Native VS Code color picker integration
- Hover tooltips with color information
- Right-click context menu for color selection
