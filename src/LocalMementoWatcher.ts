// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import * as assert from 'assert';
import * as vscode from 'vscode';
import { InternalMemento, outputChannel } from './constants';

export class LocalMementoWatcher implements vscode.Disposable {
    private oldValue: any;
    private readonly disposable: NodeJS.Timeout;

    public constructor(private readonly memento: InternalMemento) {
        this.oldValue = memento._value;

        this.disposable = setInterval(() => this.checkForChanges(this), 1000);
    }

    public dispose() {
        clearInterval(this.disposable);
    }

    private checkForChanges(thisArg: LocalMementoWatcher): void {
        if (!assert.deepStrictEqual(thisArg.memento._value, thisArg.oldValue)) {
            outputChannel.appendLine('Detected a change to this extension\'s memento.');
            thisArg.oldValue = thisArg.memento._value;
        }
    }
}
