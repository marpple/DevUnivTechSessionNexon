const { log } = console;

export function main() {

  // identity
  function identity<T>(a: T): T {
    return a;
  }
  const r1 = identity(1);
  const r2 = identity("a");
  const r3 = identity([1]);

  // add
  function add(a: number, b: number) {
    return a + b;
  }

  const r4 = add(10, 5);

  // double 함수 오버로드
  function double(a: string): string;
  function double(a: number): number;
  function double(a: number | string): number | string {
    if (typeof a === 'number') {
      return a * 2;
    } else {
      return a + a;
    }
  }

  const r5 = double(10);
  const r6 = double("A");
  console.log(r5, r6);

  // div 화살표 함수 및 타입추론
  const div = (a: number, b: number) => a / b;

  const r7 = div(10, 5);

  // constant 고차함수
  function constant<A>(a: A) {
    return function () {
      return a;
    }
  }

  const f1 = constant(10);
  const r8 = f1();

  const f2 = constant("a");
  const r9 = f2();

  const f3 = constant([1]);
  const r10 = f3();
  const r101 = r10[0];

  const f4 = constant([1][Symbol.iterator]());
  const r11 = f4();
  // const value = r11.next().value;
  // for (const a of r11) {
  //   console.log(a);
  // }
  // const arr = [...r11];
  while (true) {
    const { value, done } = r11.next();
    if (done) break;
    const a = value;
  }

  // naturals 타입추론
  function* naturals(end = Infinity) {
    let i = 0;
    while (++i <= end) {
      yield i;
    }
  }

  const iterator = naturals(10);
  const arr2 = [...iterator];

  console.clear();

  // forEach
  function forEach<A>(f: (a: A) => void, iterable: Iterable<A>) {
    const iterator = iterable[Symbol.iterator]();
    while (true) {
      const { value, done } = iterator.next();
      if (done) break;
      f(value);
    }
  }

  forEach(log, [1, 2, 3]);

  // map
  function map<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B> {
    const iterator = iterable[Symbol.iterator]();
    return {
      next() {
        const { value, done } = iterator.next();
        return done ? { value, done } : { value: f(value), done };
      },
      [Symbol.iterator]() { return this; }
    }
  }

  const mapped = map(a => a * 10, [1, 2, 3]);
  // log(mapped.next());
  // log(mapped.next());
  // log(mapped.next());
  // log(mapped.next());
  log([...mapped]);

  const r12 = [...mapped];

  // filter :: (a => boolean, [a]) => [a]

  // filter
  function filter<A>(f: (a: A) => boolean, iterable: Iterable<A>): IterableIterator<A> {
    const iterator = iterable[Symbol.iterator]();
    return {
      next() {
        const { value, done } = iterator.next();
        if (done) {
          return { value, done };
        }
        if (f(value)) {
          return { value, done };
        } else {
          return this.next();
        }
      },
      [Symbol.iterator]() { return this; }
    }
  }

  const r13 = filter(a => a % 2 === 1, [11, 22, 33, 44]);
  // log(...r13);

  forEach(log, [1, 2, 3]);
  forEach(log, new Set([1, 1, 2, 3]));
  forEach(log, new Map([['a', 'A'], ['b', 'B']]));
  forEach(log, new Map([['a', 'A'], ['b', 'B']]).values());
  forEach(log, new Map([['a', 'A'], ['b', 'B']]).keys());
  forEach(log, function* (arr) {
    yield 3;
    if (false) yield 2;
    yield 1;
  } ());
  forEach(log, r13);

  console.clear();

  forEach(log,
    filter(a => a % 2 === 1,
      map(a => a + 10,
        [1, 2, 3, 4, 5])));

  // FxIterable
  class FxIterable<A> {
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

    toArray() {
      return [...this];
    }
  }

  function fx<A>(iterable: Iterable<A>) {
    return new FxIterable(iterable);
  }

  // fx([1, 2, 3, 4, 5, 6, 7])
  //   .map(a => a + 10)
  //   .filter(a => a % 2 === 1)
  //   .forEach(log);

  // toArray
  // const [first, second] = [1, 2, 3, 4, 5];
  // console.log(first, second);

  console.clear();

  // const [first, second] = fx([1, 2, 3, 4, 5, 6, 7])
  //   .map(a => a + 10)
  //   .filter(a => a % 2 === 1)
  //   .toArray();

  // vs 이터러블 프로토콜

  const [first, second] = fx([1, 2, 3, 4, 5, 6, 7])
    .map(a => a + 10)
    .filter(a => a % 2 === 1);

  console.log(first, second);

  log(...fx([1, 2, 3, 4, 5, 6, 7]).map(a => a + 10));

  console.clear();

  // function* take<A>(length: number, iterable: Iterable<A>) {
  //   for (const a of iterable) {
  //     yield a;
  //     if (--length === 0) break;
  //   }
  // }

  function* take<T>(length: number, iterable: Iterable<T>) {
    const iterator = iterable[Symbol.iterator]();
    while (length-- > 0) {
      const { value, done } = iterator.next();
      if (done) break;
      yield value;
    }
  }

  function reduce<A, B>(f: (acc: B, a: A) => B, acc: B, iterable: Iterable<A>) {
    for (const a of iterable) {
      acc = f(acc, a);
    }
    return acc;
  }

  // sumOfSquaresOfOddNumbers
  const sumOfSquaresOfOddNumbers = (limit: number, list: number[]) =>
    reduce((a, b) => a + b, 0,
      take(limit,
        map(a => a * a,
          filter(a => a % 2 === 1,
            list))));

  // log([...take(2, [1, 2, 3, 4, 5, 6])]);

  console.log(
    sumOfSquaresOfOddNumbers(3, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  );

  // 명령형을 리스트 프로세싱으로 전환
  // - if를 filter로
  // - 값 변화 후 변수 할당을 map으로
  //   (잠시 LISP 보고 오기)
  // - break를 take로
  // - 합산을 reduce로

  const sumOfSquaresOfOddNumbers2 = (limit: number, list: number[]) =>
    fx(list)
      .filter(a => a % 2 === 1)
      .map(a => a * a)
      .take(limit)
      .reduce((a, b) => a + b, 0);

  console.log(
    sumOfSquaresOfOddNumbers2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  );
}

