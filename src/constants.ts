// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';

export type MementoType = 'global' | 'workspace';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type InternalMemento = vscode.Memento & ({ f: Record<string, unknown> } | { _value: Record<string, unknown> });

export const outputChannel = vscode.window.createOutputChannel(vscode.l10n.t('Memento Explorer'), { log: true });
