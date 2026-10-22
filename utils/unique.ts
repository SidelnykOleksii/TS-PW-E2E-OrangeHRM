/**
 * Produces a value unique to this test run, so records created against the
 * shared demo instance don't collide with leftovers from a previous or
 * concurrent run (e.g. on retry, or duplicate-username validation).
 */
export function uniqueName(base: string): string {
  return `${base}${Date.now()}`;
}
