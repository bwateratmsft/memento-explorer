// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';
import { InternalMemento } from './constants';
import { IMementoExplorerExtension } from './IMementoExplorerExtension';
import { LocalMementoWatcher } from './LocalMementoWatcher';
import { MementoFileSystemProvider } from './MementoFileSystemProvider';
import { openMemento } from './openMemento';
import { UserCancelledError } from './UserCancelledError';

export function activate(context: vscode.ExtensionContext): IMementoExplorerExtension {
    registerCommand(context, 'memento-explorer.openGlobalMemento', () => openMemento('global'));
    registerCommand(context, 'memento-explorer.openWorkspaceMemento', () => openMemento('workspace'));

    context.subscriptions.push(
        vscode.workspace.registerFileSystemProvider(
            'memento',
            new MementoFileSystemProvider(),
            {
                isCaseSensitive: true,
                isReadonly: false,
            }
        )
    );

    context.subscriptions.push(new LocalMementoWatcher(<InternalMemento><unknown>context.globalState));

    // Here is an example of what to return from `activate()`. You can literally copy and paste just this code, and it will work.
    // Note though, we highly recommend exporting only in test scenarios--for example, you can use a magic environment variable to gate the export.
    return {
        memento: {
            globalState: context.globalState,
            workspaceState: context.workspaceState,
        },
    };
}

export function deactivate(): void {}

function registerCommand(context: vscode.ExtensionContext, commandId: string, callback: () => Promise<void>): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(commandId, async () => {
            try {
                await callback();
            } catch (e) {
                if (e instanceof UserCancelledError) {
                    return;
                }

                const error: { message: string } = {
                    message: e.message || e.toString(),
                };

                vscode.window.showErrorMessage(error.message);
            }
        })
    );
}
