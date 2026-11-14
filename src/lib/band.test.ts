import assert from 'node:assert/strict';
import {
  LISTENING_TABLE, READING_ACADEMIC_TABLE, READING_GENERAL_TABLE,
  rawToBand, scaledBand, overallBand,
} from './band';

assert.equal(rawToBand(40, LISTENING_TABLE), 9);
assert.equal(rawToBand(30, LISTENING_TABLE), 7);
assert.equal(rawToBand(29, LISTENING_TABLE), 6.5);
assert.equal(rawToBand(0, LISTENING_TABLE), 0);
assert.equal(rawToBand(33, READING_ACADEMIC_TABLE), 7.5);
assert.equal(rawToBand(40, READING_GENERAL_TABLE), 9);
assert.equal(rawToBand(34, READING_GENERAL_TABLE), 7);
assert.equal(scaledBand(10, 10, LISTENING_TABLE), 9);
assert.equal(scaledBand(5, 10, LISTENING_TABLE), 5.5); // 20/40 -> 5.5

// IELTS yaxlitlash qoidasi
assert.equal(overallBand(6, 6, 6.5, 6.5), 6.5); // 6.25 -> 6.5
assert.equal(overallBand(6, 6, 6, 6.5), 6); // 6.125 -> 6.0
assert.equal(overallBand(6.5, 7, 7, 7), 7); // 6.875 -> 7.0
assert.equal(overallBand(6.5, 6.5, 6.5, 7), 6.5); // 6.625 -> 6.5
assert.equal(overallBand(7, 7, 7, 6.5), 7); // 6.875 -> 7.0
assert.equal(overallBand(5.5, 6, 6, 6), 6); // 5.875 -> 6.0
console.log('band.test: OK');
