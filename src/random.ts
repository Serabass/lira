
import { Random, nativeMath } from "random-js";

export const random = new Random(nativeMath); // uses the nativeMath engine

export function pick<T>(source: T[]): T {
  let a = random.shuffle(source);
  return random.pick(a);
}
