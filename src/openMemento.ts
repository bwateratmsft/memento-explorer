// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';
import { MementoType } from './IMementoExplorerExtension';
import { UserCancelledError } from './UserCancelledError';

export async function openMemento(type: MementoType): Promise<void> {
    const extensionId = await showExtensionQuickPick();
    const uri = getExtensionMementoUri(extensionId, type);
    const document = await vscode.workspace.openTextDocument(uri);

    void vscode.window.showTextDocument(document);
}

interface ExtensionQuickPickItem extends vscode.QuickPickItem {
    readonly extensionId: string;
}

async function showExtensionQuickPick(): Promise<string> {
    const pick = await vscode.window.showQuickPick(
        getExtensionQuickPickItems(),
        {
            placeHolder: 'Choose an extension',
        }
    );

    if (pick === undefined) {
        throw new UserCancelledError();
    }

    return pick.extensionId;
}

function getExtensionQuickPickItems(): ExtensionQuickPickItem[] {
    return vscode.extensions.all
        .filter(e => e.exports !== undefined || !e.isActive)
        .map(e => ({ 
            label: e.packageJSON?.name || e.id,
            detail: e.id,
            extensionId: e.id,
        }));
}

function getExtensionMementoUri(extensionId: string, memento: MementoType): vscode.Uri {
    return vscode.Uri.parse(`memento://${extensionId}/${memento}`, true);
}
