interface IteratorYieldResult<TYield> {
  done?: false;
  value: TYield;
}

interface IteratorReturnResult {
  done: true;
  value: undefined;
}

interface Iterator<T> {
  next(): IteratorYieldResult<T> | IteratorReturnResult;
}

// function naturals(end = Infinity): IterableIterator<number> {
//   let i = 0;
//   return {
//     next() {
//       return ++i <= end
//         ? { value: i, done: false }
//         : { value: undefined, done: true }
//     },
//     [Symbol.iterator]() { return this; }
//   }
// }

function* naturals(end = Infinity) {
  let i = 0;
  while (++i <= end) {
    yield i;
  }
}

function reverse<T>(arr: T[]): IterableIterator<T> {
  let { length } = arr;
  return {
    next() {
      return length
        ? { value: arr[--length], done: false }
        : { value: undefined, done: true }
    },
    [Symbol.iterator]() { return this; }
  }
}

// function logEach2<T>(iterable: Iterable<T>) {
//   const iterator = iterable[Symbol.iterator]();
//   while (true) {
//     const { value, done } = iterator.next();
//     if (done) break;
//     console.log(value);
//   }
// }


function logEach<T>(iterable: Iterable<T>) {
  for (const value of iterable) {
    console.log(value);
  }
}

export function main() {

  // window.naturals = naturals;
  // arr[0]
  const arr = ['A', 'B', 'C', 'D'];
  console.log(arr);
  // console.log(arr.length);
  // console.log(arr[1]);

  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }

  console.log('----');

  // arr.at(-1);
  for (let i = -1; i >= -arr.length; i--) {
    console.log(-i, arr.at(i));
  }

  console.log('----');

  // Set
  const set = new Set([2, 2, 4, 6, 6]);
  set.forEach(a => console.log(a));

  // function naturals(): Iterator<number> {};
  const iterator = naturals(3);
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());

  const iterator2 = naturals(2);
  while (true) {
    const { value, done } = iterator2.next();
    if (done) break;
    console.log(value);
  }

  console.clear();

  // logEach
  logEach(naturals(3));

  // arr.values()
  // const iterator3 = arr.values();
  // console.log(iterator3.next());
  // console.log(iterator3.next());
  // console.log(iterator3.next());
  // console.log(iterator3.next());
  // console.log(iterator3.next());

  logEach(arr.values());

  // set.values()
  logEach(set.values());

  // reverse()
  console.log(arr);

  // const arr2 = [...arr].reverse();
  // arr2[1]
  // arr2[2]

  logEach(reverse(arr));

  console.clear();

  // IterableIterator
  for (const value of arr) {
    console.log(value);
  }

  for (const value of naturals(3)) {
    console.log(value);
  }

  for (const value of reverse(arr)) {
    console.log(value);
  }

  console.log([...reverse(arr)]);
  console.log([...arr]);

  console.clear();
  // Generator

  console.log([...naturals(3)]);

  logEach(naturals(5));

  // upperCaseAll

  function* upperCaseAllLazy(iterable: Iterable<string>) {
    for (const value of iterable) {
      yield value.toUpperCase();
    }
  }

  function upperCaseAll(iterable: Iterable<string>) {
    return [...upperCaseAllLazy(iterable)];
  }

  // const iterator5 = upperCaseAllLazy(['a', 'b', 'c', 'd']);
  // console.log(iterator5.next());
  // console.log(iterator5.next());

  const [first] = upperCaseAllLazy(['a', 'b', 'c', 'd', '...']);
  console.log(first);


  console.log(upperCaseAll(['a', 'b']));
  console.log(...map(a => a.toUpperCase(), ['a', 'b']));


  // console.log(upperCaseAll(new Set(['a', 'a', 'b', 'c'])));

  // doubleAll

  // function* doubleAllLazy(iterable: Iterable<number>) {
  //   for (const value of iterable) {
  //     yield value * 2;
  //   }
  // }

  function doubleAllLazy(iterable: Iterable<number>) {
    return map(a => a * 2, iterable);
  }

  function doubleAll(iterable: Iterable<number>) {
    return [...doubleAllLazy(iterable)];
  }

  const iterator6 = doubleAllLazy([1, 2, 3, 4]);
  logEach(iterator6);

  console.log(doubleAll([10, 20, 30]));

  // filterOdds
  function* filterOddsLazy(iterable: Iterable<number>) {
    for (const value of iterable) {
      if (value % 2 === 1) {
        yield value;
      }
    }
  }
  console.log([...filterOddsLazy([1, 2, 3, 4, 5, 6])]);

  // filterSingleChars
  function* filterSingleChars(iterable: Iterable<string>) {
    for (const value of iterable) {
      if (value.length === 1) {
        yield value;
      }
    }
  }
  console.log(...filterSingleChars(['aa', 'a', 'b', 'cc', 'd']));

  const iterator7 = filterSingleChars(['aa', 'a', 'b', 'cc', 'd']);
  console.log(iterator7.next());
  console.log(iterator7.next());
  console.log(iterator7.next());
  console.log(iterator7.next());

  // ----- { next() {} }

  // + 일급함수

  // map
  function* map<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B> {
    for (const value of iterable) {
      yield f(value);
    }
  }

  // function* filterOddsLazy(iterable: Iterable<number>) {
  //   for (const value of iterable) {
  //     if (value % 2 === 1) {
  //       yield value;
  //     }
  //   }
  // }

  // filter
  function* filter<A>(f: (a: A) => boolean, iterable: Iterable<A>): IterableIterator<A> {
    for (const value of iterable) {
      if (f(value)) {
        yield value;
      }
    }
  }

  function forEach<A>(f: (a: A) => void, iterable: Iterable<A>) {
    for (const value of iterable) {
      f(value);
    }
  }

  const isOdd = (a: number) => a % 2 === 1;

  console.clear();

  logEach(filterOddsLazy([1, 2, 3, 4, 5]));

  logEach(filter(isOdd, [1, 2, 3, 4, 5]));

  // forEach
  forEach(console.log, filter(isOdd, [1, 2, 3, 4, 5]));
  console.clear();

  // NodeList
  const divs= document.querySelectorAll('div');

  forEach(console.log,
    filter(isOdd,
      map(text => parseInt(text),
        map(node => node.textContent!,
          document.querySelectorAll('section div')))));
}

