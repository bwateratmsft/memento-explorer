// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';
import { IMementoExplorerExtension } from './IMementoExplorerExtension';
import { detailedDiff } from 'deep-object-diff';
import { InternalMemento, MementoType, outputChannel } from './constants';

export class MementoFileSystemProvider implements vscode.FileSystemProvider {
    public async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
        const memento = await getMemento(uri);

        return {
            type: vscode.FileType.File,
            ctime: 0,
            mtime: Date.now(),
            size: JSON.stringify(memento.f, undefined, 4).length,
        };
    }

    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        const memento = await getMemento(uri);

        return objectToJsonUint8Array(memento.f);
    }

    public async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): Promise<void> {
        const memento = await getMemento(uri);
        const oldValue = memento.f;
        const newValue = uint8ArrayJsonToObject(content) as Record<string, unknown>;

        const diff = <DetailedDiff>detailedDiff(oldValue, newValue);

        // Log some info on what we're about to do
        outputChannel.show();
        outputChannel.appendLine(`>>>> Attempting updates to '${uri.authority}' '${uri.path.replace(/^\//i, '')}' memento <<<<`);
        outputChannel.appendLine(JSON.stringify(diff, undefinedToNull, 4));
        outputChannel.appendLine('');

        // Perform the updates
        for (const deletedKey of Object.keys(diff.deleted)) {
            await memento.update(deletedKey, undefined);
        }

        for (const addedKey of Object.keys(diff.added)) {
            await memento.update(addedKey, newValue[addedKey]);
        }

        for (const updatedKey of Object.keys(diff.updated)) {
            await memento.update(updatedKey, newValue[updatedKey]);
        }
    }

    //#region Methods not valid for `MementoFileSystemProvider`
    // The change emitter is not actually used
    private readonly changeEmitter: vscode.EventEmitter<vscode.FileChangeEvent[]> = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this.changeEmitter.event;

    public watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[]; }): vscode.Disposable {
        throw new Error('Method not implemented.');
    }

    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        throw new Error('Method not implemented.');
    }

    public async createDirectory(uri: vscode.Uri): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async delete(uri: vscode.Uri, options: { recursive: boolean; }): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): Promise<void> {
        throw new Error('Method not implemented.');
    }
    //#endregion Methods not valid for `MementoFileSystemProvider`
}

async function getMemento(uri: vscode.Uri): Promise<InternalMemento> {
    const extensionId = uri.authority;
    const type: MementoType = <MementoType>uri.path.replace(/^\//i, '');

    const extension = vscode.extensions.getExtension<IMementoExplorerExtension>(extensionId);
    if (!extension) {
        throw new Error(`Extension '${extensionId}' could not be found`);
    }

    if (!extension.isActive) {
        await extension.activate();
    }

    if (type === 'global') {
        if (extension.exports?.memento?.globalState) {
            return <InternalMemento>extension.exports.memento.globalState;
        }
    } else {
        if (extension.exports?.memento?.workspaceState) {
            return <InternalMemento>extension.exports.memento.workspaceState;
        }
    }

    throw new Error(`Extension '${extensionId}' does not export \`Memento\` of type '${type}'`);
}

function objectToJsonUint8Array(obj: object): Uint8Array {
    return Uint8Array.from(
        Buffer.from(
            JSON.stringify(obj, undefined, 4),
            'utf8'
        )
    );
}

function uint8ArrayJsonToObject(array: Uint8Array): object {
    const json = Buffer.from(array).toString('utf8');

    return JSON.parse(json);
}

function undefinedToNull(k: string, v: unknown): unknown {
    return v === undefined ?
        null :
        v;
}

interface DetailedDiff {
    readonly added: object;
    readonly deleted: object;
    readonly updated: object;
}
