// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as util from 'util';
import * as vscode from 'vscode';
import { IMementoExplorerExtension } from './IMementoExplorerExtension';
import { MementoFileSystemProvider } from './MementoFileSystemProvider';
import { openMemento } from './openMemento';

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

    // Here is an example of what to return from `activate()`. You can literally copy and paste just this code, and it will work.
    // Note though, we highly recommend exporting only in test scenarios--for example, you can use a magic environment variable to gate the export.
    return {
        memento: {
            globalState: context.globalState,
            workspaceState: context.workspaceState,
        },
    };
}

export function deactivate(): void {
    // noop
}

function registerCommand(context: vscode.ExtensionContext, commandId: string, callback: () => Promise<void>): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(commandId, async () => {
            try {
                await callback();
            } catch (e) {
                let message: string | undefined;
                if (e instanceof vscode.CancellationError) {
                    return;
                } else if (e instanceof Error) {
                    message = e.message;
                } else {
                    message = util.inspect(e);
                }

                vscode.window.showErrorMessage(message);
            }
        })
    );
}
