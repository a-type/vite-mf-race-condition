import * as Shared from '@repro/shared-lib';
import { exportedThing } from '@repro/shared-lib';

// Keep this side effect so test output can show module shape if it breaks.
console.log('remote shared namespace keys', Object.keys(Shared));

const result = exportedThing.method();

export default {
	result,
};
