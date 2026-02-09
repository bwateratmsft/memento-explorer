// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import { autoEsbuildOrWatch, autoSelectEsbuildConfig } from '@microsoft/vscode-azext-eng/esbuild';

await autoEsbuildOrWatch(autoSelectEsbuildConfig());
