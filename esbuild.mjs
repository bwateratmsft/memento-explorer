// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import { autoSelectEsbuildConfig } from '@microsoft/vscode-azext-eng/esbuild';
import { build, context } from 'esbuild';

const { extensionConfig, isAutoWatch } = autoSelectEsbuildConfig();

await autoEsbuildOrWatch(extensionConfig);

async function autoEsbuildOrWatch(config) {
    // Build (or watch) the extension bundle
    if (isAutoWatch) {
        const ctx = await context(config);
        process.on('SIGINT', () => {
            console.log('Stopping esbuild watch');
            void ctx.dispose();
        });
        await ctx.watch();
    } else {
        const result = await build(config);

        if (!!config.metafile && !!result.metafile) {
            await fs.writeFile('esbuild.meta.json', JSON.stringify(result.metafile));
        }
    }
}
