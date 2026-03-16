// Copyright Brandon Waterloo. All rights reserved.
// Licensed under the MIT license.

import { azExtEslintRecommendedTypeChecked } from '@microsoft/vscode-azext-eng/eslint';
import eslintPluginHeader from '@tony.ganchev/eslint-plugin-header';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    azExtEslintRecommendedTypeChecked,
    {
        plugins: {
            'header': eslintPluginHeader,
        },
        rules: {
            'header/header': [
                'error',
                {
                    header: {
                        commentType: 'line',
                        lines: [
                            {
                                pattern: /Brandon Waterloo/,
                                template: ' Copyright Brandon Waterloo. All rights reserved.',
                            },
                            {
                                pattern: /LICENSE/i,
                                template: ' Licensed under the MIT license.',
                            },
                        ],
                    },
                    trailingEmptyLines: {
                        minimum: 2,
                    },
                },
            ],
        },
    }
)
