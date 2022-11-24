
import { Random } from "random-js";

export const random = new Random(); // uses the nativeMath engine

export function pick<T>(source: T[]): T {
  let a = random.shuffle(source);
  return random.pick(source);
}
