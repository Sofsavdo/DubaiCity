import assert from 'node:assert/strict';
import { GRAMMAR_NODES, nodeForGrammarTopic, nodeForPracticeTopic } from './inventory';
import { validateGraph, uncoveredTaxonomy } from '../../lib/adaptive/graph';
import { grammar, grammarTopics } from '../grammar';
import { exercises } from '../practice';
import { LEVELS } from './types';

assert.deepEqual(validateGraph(GRAMMAR_NODES), [], 'legacy grammar graph is structurally valid');
assert.equal(GRAMMAR_NODES.length, grammarTopics.length, 'every grammar topic has a node');
for (const t of grammarTopics) assert.ok(nodeForGrammarTopic(t), `topic ${t} mapped`);
for (const g of grammar) { const n = GRAMMAR_NODES.find((x) => x.id === nodeForGrammarTopic(g.topic)); assert.ok(n); assert.equal(n.level, g.level, `item ${g.id} level matches its node`); }
assert.ok(GRAMMAR_NODES.every((n) => LEVELS.includes(n.level) && n.reviewStatus === 'legacy'));
// report (not fail): practice topics without a node, and taxonomy gaps
const unmapped = [...new Set(exercises.map((e) => e.topic))].filter((t) => !nodeForPracticeTopic(t));
const gaps = uncoveredTaxonomy(GRAMMAR_NODES);
console.log(`inventory: ${GRAMMAR_NODES.length} grammar nodes; practice topics unmapped: ${unmapped.join(', ') || 'none'}; taxonomy ids without remedial node: ${gaps.length}`);
const mappedEx = exercises.filter((e) => nodeForPracticeTopic(e.topic)).length;
console.log(`practice exercises mapped to a grammar node: ${mappedEx}/${exercises.length}`);
assert.ok(mappedEx / exercises.length >= 0.5, 'at least half of the practice exercises map to a node');
console.log('inventory.test: OK');
