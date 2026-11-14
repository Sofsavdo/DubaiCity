import type { CurriculumNode } from '../../content/curriculum/types';
import { LEVELS } from '../../content/curriculum/types';
import { TAXONOMY_IDS, isTaxonomyId } from './taxonomy';

/** Structural validation of the curriculum graph. Returns human-readable problems (empty = valid). */
export function validateGraph(nodes: CurriculumNode[]): string[] {
  const problems: string[] = [];
  const byId = new Map<string, CurriculumNode>();
  for (const n of nodes) { if (byId.has(n.id)) problems.push(`duplicate id ${n.id}`); byId.set(n.id, n); }
  for (const n of nodes) {
    if (!n.objective.trim()) problems.push(`${n.id}: missing objective`);
    if (!n.hasPractice) problems.push(`${n.id}: no practice`);
    if (!n.hasCheck) problems.push(`${n.id}: no mastery check`);
    if (n.estMinutes <= 0) problems.push(`${n.id}: estMinutes must be > 0`);
    for (const t of n.taxonomyIds) if (!isTaxonomyId(t)) problems.push(`${n.id}: unknown taxonomy id ${t}`);
    for (const p of n.prerequisites) {
      const pn = byId.get(p);
      if (!pn) problems.push(`${n.id}: unknown prerequisite ${p}`);
      else if (LEVELS.indexOf(pn.level) > LEVELS.indexOf(n.level)) problems.push(`${n.id}: prerequisite ${p} is a higher level`);
    }
  }
  // cycles (DFS colouring)
  const color = new Map<string, 0 | 1 | 2>();
  const visit = (id: string, path: string[]): void => {
    const c = color.get(id) ?? 0;
    if (c === 2) return;
    if (c === 1) { problems.push(`cycle: ${[...path, id].join(' -> ')}`); return; }
    color.set(id, 1);
    for (const p of byId.get(id)?.prerequisites ?? []) if (byId.has(p)) visit(p, [...path, id]);
    color.set(id, 2);
  };
  for (const n of nodes) visit(n.id, []);
  // reachability: every node must descend from a root (no prerequisites) that is level A1
  const reachable = (id: string, seen = new Set<string>()): boolean => {
    if (seen.has(id)) return false; seen.add(id);
    const n = byId.get(id); if (!n) return false;
    if (!n.prerequisites.length) return n.level === 'A1';
    return n.prerequisites.every((p) => reachable(p, new Set(seen)));
  };
  if (!problems.some((p) => p.startsWith('cycle'))) for (const n of nodes) if (!reachable(n.id)) problems.push(`${n.id}: not reachable from an A1 root`);
  return problems;
}

/** Taxonomy ids with no remedial node — a coverage GAP report, not a validation failure while content is being written. */
export function uncoveredTaxonomy(nodes: CurriculumNode[]): string[] {
  const covered = new Set(nodes.flatMap((n) => n.taxonomyIds));
  return TAXONOMY_IDS.filter((t) => !covered.has(t));
}
