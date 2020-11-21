// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';

/**
 * @description In order to use the Memento Explorer extension, an extension's `activate()` method must return an object implementing this interface. If desired, the extension can choose to exclude one of the `Memento` types (global or workspace).
 * Please note, is not necessary to reference this extension as a Node.js package; it is fine to simply copy and paste the below interface, or not use an interface at all. As long as the exported object conforms to the below shape, it will work.
 * @example For reference purposes, this extension exports an object conforming to `IMementoExplorerExtension`.
 */
export interface IMementoExplorerExtension {
    readonly memento: {
        readonly globalState?: vscode.Memento;
        readonly workspaceState?: vscode.Memento;
    };
}

export type MementoType = 'global' | 'workspace';
