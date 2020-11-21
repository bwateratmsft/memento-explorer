// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from 'vscode';
import { IMementoExplorerExtension, MementoType } from './IMementoExplorerExtension';
import { detailedDiff } from 'deep-object-diff';

export class MementoFileSystemProvider implements vscode.FileSystemProvider {
    private readonly changeEmitter: vscode.EventEmitter<vscode.FileChangeEvent[]> = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this.changeEmitter.event;

    public async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
        const memento = await getMemento(uri);

        return {
            type: vscode.FileType.File,
            ctime: 0,
            mtime: Date.now(),
            size: JSON.stringify(memento._value, undefined, 4).length,
        };
    }

    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        const memento = await getMemento(uri);

        return objectToJsonUint8Array(memento._value);
    }

    public async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): Promise<void> {
        const memento = await getMemento(uri);
        const oldValue = memento._value;
        const newValue = uint8ArrayJsonToObject(content);

        const diff = <DetailedDiff>detailedDiff(oldValue, newValue);

        for (const addedKey of Object.keys(diff.added)) {
            await memento.update(addedKey, (<any>diff.added)[addedKey]);
        }

        for (const updatedKey of Object.keys(diff.updated)) {
            await memento.update(updatedKey, (<any>diff.updated)[updatedKey]);
        }

        for (const deletedKey of Object.keys(diff.deleted)) {
            await memento.update(deletedKey, undefined);
        }
    }

    //#region Methods not valid for `MementoFileSystemProvider`
    public watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[]; }): vscode.Disposable {
        throw new Error('Method not implemented.');
    }

    public readDirectory(uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        throw new Error('Method not implemented.');
    }

    public createDirectory(uri: vscode.Uri): void | Thenable<void> {
        throw new Error('Method not implemented.');
    }

    public delete(uri: vscode.Uri, options: { recursive: boolean; }): void | Thenable<void> {
        throw new Error('Method not implemented.');
    }

    public rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error('Method not implemented.');
    }
    //#endregion MementoFileSystemProvider
}

async function getMemento(uri: vscode.Uri): Promise<(vscode.Memento & { _value: any })> {
    const extensionId = uri.authority;
    const type: MementoType = <MementoType>uri.path;

    const extension = await vscode.extensions.getExtension<IMementoExplorerExtension>(extensionId);
    if (!extension) {
        throw new Error(`Extension '${extensionId}' could not be found`);
    }

    if (!extension.isActive) {
        await extension.activate();
    }

    if (type === 'global') {
        if (extension.exports?.memento?.globalState) {
            return <(vscode.Memento & { _value: object })>extension.exports.memento.globalState;
        }
    } else {
        if (extension.exports?.memento?.workspaceState) {
            return <(vscode.Memento & { _value: object })>extension.exports.memento.workspaceState;
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

interface DetailedDiff {
    readonly added: object;
    readonly deleted: object;
    readonly updated: object;
}
