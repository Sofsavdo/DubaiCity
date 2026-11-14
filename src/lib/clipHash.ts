/** Matn bo'yicha qisqa barqaror kalit (FNV-1a, 2 ta o'tish). Generator va brauzer bir xil ishlatadi. */
export function clipKey(text: string): string {
  const t = text.normalize('NFC').replace(/\s+/g, ' ').trim();
  let h1 = 0x811c9dc5, h2 = 0x01000193;
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ (c + i), 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}
