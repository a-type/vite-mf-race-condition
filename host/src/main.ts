import { createInstance } from '@module-federation/enhanced/runtime';
import * as Shared from '@repro/shared-lib';

const status = document.getElementById('status')!;

const federation = createInstance({
	name: 'host',
	remotes: [
		{
			name: 'remote',
			entry: 'http://127.0.0.1:4174/mf-manifest.json',
			type: 'module',
		},
	],
});

const scope = 'default';

federation.registerShared({
	'@repro/shared-lib': {
		version: '0.0.1',
		scope,
		lib: () => Shared,
		strategy: 'loaded-first',
		shareConfig: {
			singleton: true,
			requiredVersion: '0.0.1',
		},
	},
});

// Toggle this to true to apply workaround and "fix" the error... by
// manually injecting things into the runtime cache
const seedWorkaround = false;
if (seedWorkaround) {
	const g = globalThis as any;
	const cache = (g.__mf_module_cache__ ??= { share: {}, remote: {} });
	cache.share ??= {};
	cache.share['@repro/shared-lib'] = Shared;
	cache.share['default:@repro/shared-lib'] = Shared;
}

async function run() {
	try {
		const mod = await federation.loadRemote<{ default: { result: string } }>(
			'remote/definition',
		);
		status.textContent = `OK:${mod.default.result}`;
		(window as any).__REPRO_RESULT__ = status.textContent;
	} catch (err) {
		const message =
			err instanceof Error ? err.stack || err.message : String(err);
		status.textContent = `ERR:${message}`;
		(window as any).__REPRO_RESULT__ = status.textContent;
		console.error(err);
	}
}

run();
