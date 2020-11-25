// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';

export type MementoType = 'global' | 'workspace';

export type InternalMemento = vscode.Memento & { _value: any };

export const outputChannel = vscode.window.createOutputChannel('Memento Explorer');
