import assert from 'node:assert/strict';
import format, { subslate } from '@josh-hemphill/subslate';

assert.equal(format, subslate);
assert.equal(format('😀 ${x} ${y} ${x}', { x: 'expanded', y: 'B' }), '😀 expanded B expanded');
