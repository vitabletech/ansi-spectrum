/**
 * Type definitions for ANSI Spectrum extension
 * Ultimate Visualization
 */
import * as vscode from 'vscode';

export interface AnsiColorInfo {
  code: string;
  range: vscode.Range;
  colorCode: string;
  hexColor: string;
  colorName: string;
}

export interface ColorMatch {
  fullMatch: string;
  colorCode: string;
  attribute?: string;
  startIndex: number;
  endIndex: number;
}

export interface DecorationGroup {
  [colorCode: string]: vscode.Range[];
}
