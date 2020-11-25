// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';
import { MementoType } from './constants';
import { UserCancelledError } from './UserCancelledError';

export async function openMemento(type: MementoType): Promise<void> {
    const extensionId = await showExtensionQuickPick();
    const uri = getExtensionMementoUri(extensionId, type);
    const document = await vscode.workspace.openTextDocument(uri);

    await vscode.window.showTextDocument(document);
    await vscode.languages.setTextDocumentLanguage(document, 'json'); // TODO: when opening the memento directly from URI, this doesn't get set
}

interface ExtensionQuickPickItem extends vscode.QuickPickItem {
    readonly extensionId: string;
}

async function showExtensionQuickPick(): Promise<string> {
    const pick = await vscode.window.showQuickPick(
        getExtensionQuickPickItems(),
        {
            placeHolder: 'Choose an extension',
            matchOnDetail: true,
        }
    );

    if (pick === undefined) {
        throw new UserCancelledError();
    }

    return pick.extensionId;
}

function getExtensionQuickPickItems(): ExtensionQuickPickItem[] {
    return vscode.extensions.all
        .filter(e => !e.isActive || e.exports !== undefined)
        .map(e => ({
                label: e.packageJSON?.displayName || e.packageJSON?.name || e.id,
                detail: e.id,
                extensionId: e.id,
            })
        )
        .sort((a, b) => a.extensionId.localeCompare(b.extensionId));
}

function getExtensionMementoUri(extensionId: string, memento: MementoType): vscode.Uri {
    return vscode.Uri.parse(`memento://${extensionId}/${memento}`, true);
}
