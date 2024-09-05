export function fx<A>(iterable: Iterable<A>) {
  return new FxIterable(iterable);
}

export class FxIterable<A> {
  constructor(private iterable: Iterable<A>) {
  }

  [Symbol.iterator]() {
    return this.iterable[Symbol.iterator]();
  }

  map<B>(f: (a: A) => B) {
    return fx(map(f, this));
  }

  filter(f: (a: A) => boolean) {
    return fx(filter(f, this));
  }

  forEach(f: (a: A) => void) {
    return forEach(f, this);
  }

  take(length: number) {
    return fx(take(length, this));
  }

  reduce<B>(f: (acc: B, a: A) => B, acc: B) {
    return reduce(f, acc, this);
  }

  chunk(size: number) {
    return fx(chunk(size, this));
  }

  toArray() {
    return [...this];
  }

  to<B>(f: (fxIterable: this) => B) {
    return f(this);
  }
}

export function* map<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B> {
  const iterator = iterable[Symbol.iterator]();
  while (true) {
    const { value, done } = iterator.next();
    if (done) break;
    yield f(value);
  }
}

export function* filter<A>(f: (a: A) => boolean, iterable: Iterable<A>): IterableIterator<A> {
  const iterator = iterable[Symbol.iterator]();
  while (true) {
    const { value, done } = iterator.next();
    if (done) break;
    if (f(value)) {
      yield value;
    }
  }
}

export function* take<T>(length: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  while (length-- > 0) {
    const { value, done } = iterator.next();
    if (done) break;
    yield value;
  }
}

export function reduce<A, B>(f: (acc: B, a: A) => B, acc: B, iterable: Iterable<A>) {
  for (const a of iterable) {
    acc = f(acc, a);
  }
  return acc;
}

export function forEach<A>(f: (a: A) => void, iterable: Iterable<A>) {
  const iterator = iterable[Symbol.iterator]();
  while (true) {
    const { value, done } = iterator.next();
    if (done) break;
    f(value);
  }
}

function toIterable<A>(iterator: Iterator<A>): Iterable<A> {
  return { [Symbol.iterator]() { return iterator } }
}

export function* chunk<A>(size: number, iterable: Iterable<A>) {
  const iterator = iterable[Symbol.iterator]();
  while (true) {
    const arr = [...take(size, toIterable(iterator))];
    if (arr.length) yield arr;
    if (arr.length < size) break;
  }
}

export async function fromAsync<T>(iterable: Iterable<Promise<T>>) {
  const res: T[] = [];
  for await (const a of iterable) {
    res.push(a);
  }
  return res;
}










