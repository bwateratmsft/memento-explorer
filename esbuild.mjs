// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import { autoSelectEsbuildConfig } from '@microsoft/vscode-azext-eng/esbuild';

await autoEsbuildOrWatch(autoSelectEsbuildConfig(false, false));
