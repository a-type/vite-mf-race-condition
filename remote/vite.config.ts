import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		federation({
			name: 'remote',
			filename: 'remoteEntry.js',
			exposes: {
				'./definition': './src/definition.ts',
			},
			shared: {
				'@repro/shared-lib': {
					singleton: true,
					import: false,
				},
			},
			shareScope: 'default',
			manifest: true,
		}),
	],
	build: {
		target: 'esnext',
		minify: true,
	},
});
