/**
 * A naïve implementation of a _.get style utility function.
 * @param obj object with property to be returned
 * @param path dot-delimited path into the object
 */
export function get(obj: object, path: string): object | null {
  const p = path.split('.');
  let o: $AnyFixMe = obj;
  do {
    const c = p.shift();
    if (c && c in o) {
      o = o[c];
    }
  } while (p.length);
  return Object.is(obj, o) ? null : o;
}
