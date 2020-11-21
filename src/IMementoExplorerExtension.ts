// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';

/**
 * In order to use the Memento Explorer extension, an extension's `activate()` method must return an object implementing this interface.
 * If desired, the extension can choose to not exclude one of the `Memento`s.
 * For reference purposes, this extension exports an `IMementoExplorerExtension` object.
 */
export interface IMementoExplorerExtension {
    readonly memento: {
        readonly globalState?: vscode.Memento;
        readonly workspaceState?: vscode.Memento;
    };
}

export type MementoType = 'global' | 'workspace';
