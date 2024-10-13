const { log } = console;

function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), time);
  });
}

interface ImgInfo {
  name: string,
  url: string
}

export async function main() {
  const imgs: ImgInfo[] = [
    { name: "HEART", url: "https://s3.marpple.co/files/m2/t3/colored_images/45_1115570_1162087_150x0.png" },
    { name: "6", url: "https://s3.marpple.co/f1/2018/1/1054966_1516076919028_64501_150x0.png"},
    { name: "하트", url: "https://s3.marpple.co/f1/2019/1/1235206_1548918825999_78819_150x0.png" },
    { name: "도넛", url:"https://s3.marpple.co/f1/2019/1/1235206_1548918758054_55883_150x0.png"},
  ];

  const imgs2: ImgInfo[] = [
    { name: "HEART", url: "https://s3.marpple.co/files/m2/t3/colored_images/45_1115570_1162087_150x0.png" },
    { name: "6", url: "https://s3.marpple.co/f1/2018/1/1054966_1516076919028_64501_150x0.jpg"},
    { name: "하트", url: "https://s3.marpple.co/f1/2019/1/1235206_1548918825999_78819_150x0.png" },
    { name: "도넛", url:"https://s3.marpple.co/f1/2019/1/1235206_1548918758054_55883_150x0.png"},
  ];

  // - loadImage
  function loadImage({ name, url }: { name: string, url: string}): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = function() {
        log('loadImage: ', name);
        resolve(image);
      }
      image.onerror = function() {
        reject(new Error(`load error : ${url}`));
      }
    })
  }

  // const getHeight = (imgs) =>
  //   reduceAsync((a, b) => a + b, 0,
  //     map(img => img.height,
  //       map(info => loadImage(info), imgs)));

  // getHeight(imgs).then(log);
  // getHeight(imgs2).catch(() => 0).then(log);
  // getHeight(imgs2).then(log).catch((e) => console.error(e));

  function isIterable<T = unknown>(a: Iterable<T> | unknown): a is Iterable<T> {
    return typeof a?.[Symbol.iterator] === "function";
  }

  function toAsync<A>(iterable: Iterable<A | Promise<A>>): AsyncIterable<Awaited<A>> {
    return {
      [Symbol.asyncIterator](): AsyncIterator<Awaited<A>> {
        const iterator = iterable[Symbol.iterator]();
        return {
          async next() {
            const { value, done } = iterator.next();
            return done ? { value, done } : { value: await value, done};
          }
        }
      }
    }
  }

  // async function* toAsync3<A>(iterable: Iterable<A | Promise<A>>) {
  //   const iterator = iterable[Symbol.iterator]();
  //   while (true) {
  //     const { value, done } = iterator.next();
  //     if (done) break;
  //     yield await value;
  //   }
  // }
  //
  // async function* toAsync<A>(iterable: Iterable<A | Promise<A>>) {
  //   const asyncIterable = toAsync2(iterable);
  //   for await (const a of asyncIterable) {
  //     yield a;
  //   }
  // }

  const ait1 = toAsync([1, 2, 3]);
  const ait2 = toAsync([delay(100, 1), delay(100, 2), delay(100, 3)]);

  const aiterator1 = ait1[Symbol.asyncIterator]();
  const r1Promise = aiterator1.next();
  // log(await r1Promise);
  const r1 = await aiterator1.next();
  // log(r1);

  const aiterator2 = ait2[Symbol.asyncIterator]();
  const r2Promise = aiterator2.next();
  // log(await r2Promise);
  const r2 = await aiterator2.next();
  // log(r2);

  function* mapSync<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B> {
    const iterator = iterable[Symbol.iterator]();
    while (true) {
      const { value, done } = iterator.next();
      if (done) break;
      yield f(value);
    }
  }

  async function* mapAsync<A, B>(f: (a: A) => B, asyncIterable: AsyncIterable<A>): AsyncIterableIterator<Awaited<B>> {
    const iterator = asyncIterable[Symbol.asyncIterator]();
    while (true) {
      const { value, done } = await iterator.next();
      if (done) break;
      yield f(value);
    }
  }

  function map<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B>;
  function map<A, B>(
    f: (a: A) => B,
    asyncIterable: AsyncIterable<A>
  ): AsyncIterableIterator<Awaited<B>>;
  function map<A, B>(
    f: (a: A) => B,
    iterable: Iterable<A> | AsyncIterable<A>
  ): IterableIterator<B> | AsyncIterableIterator<Awaited<B>> {
    return isIterable(iterable)
      ? mapSync(f, iterable)
      : mapAsync(f, iterable);
  }

  // const it1 = mapSync(a => a * 2, [1, 2, 3]);
  // // log(it1.next());
  //
  // const it2 = mapSync(
  //   a => a.then(a => a * 2),
  //   [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
  // );
  // // log(it2.next());
  //
  // const it3 = mapAsync(
  //   a => a * 2,
  //   toAsync([1, 2, 3])
  // );
  // const r3= await it3.next();
  // // log(r3);
  //
  // const it41 = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  // const asyncIterable = toAsync(it41);
  //
  // const it4 = mapAsync(
  //   a => a * 2,
  //   asyncIterable
  // );
  // const r4= await it3.next();
  // // log(r4);

  const it1 = map(a => a * 2, [1, 2, 3]);
  // log(it1.next());

  const it2 = map(
    a => a.then(a => a * 2),
    [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
  );
  // log(it2.next());

  const it3 = map(
    a => a * 2,
    toAsync([1, 2, 3])
  );
  const r3= await it3.next();
  // log(r3);

  const it41 = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const asyncIterable = toAsync(it41);

  const it4 = map(
    a => a * 2,
    asyncIterable
  );
  const r4= await it3.next();
  // log(r4);

  // map(a => a.toUpperCase(),
  //   toAsync([delay(100, 'a'), delay(100, 'b')]))


  function* filterSync<A>(f: (a: A) => boolean, iterable: Iterable<A>): IterableIterator<A> {
    for (const a of iterable) {
      if (f(a)) {
        yield a;
      }
    }
  }

  async function* filterAsync<A>(f: (a: A) => boolean | Promise<boolean>, asyncIterable: AsyncIterable<A>): AsyncIterableIterator<A> {
    for await (const a of asyncIterable) {
      if (await f(a)) {
        yield a;
      }
    }
  }

  function filter<A>(f: (a: A) => boolean, iterable: Iterable<A>): IterableIterator<A>;
  function filter<A>(
    f: (a: A) => boolean | Promise<boolean>,
    asyncIterable: AsyncIterable<A>
  ): AsyncIterableIterator<A>;
  function filter<A>(
    f: any,
    iterable: Iterable<A> | AsyncIterable<A>
  ): IterableIterator<A> | AsyncIterableIterator<A> {
    return isIterable(iterable)
      ? filterSync(f, iterable)
      : filterAsync(f, iterable);
  }

  for (const a of filter(a => a % 2 === 1, [1, 2, 3, 4])) {
    log(a);
  }
  const filtered = filter(a => a % 2 === 1,
    toAsync([delay(10, 1), delay(10, 2), delay(10, 3)]));

  for await (const a of filtered) {
    log(a);
  }

  // log([...await Array.fromAsync(filtered)]);


  // filterSync(a => !a, [1, 2, 3]);
  //
  // const fi1 = filterAsync(a => !a, toAsync([1, 2, 3]));
  //
  // const fi2 = filterAsync(a => {
  //   return delay(1000, 'db').then(res => !res);
  // }, toAsync([Promise.resolve(1), Promise.resolve(2)]));

  function reduceSync<A, B>(
    f: (acc: B, a: A) => B,
    acc: B,
    iterable: Iterable<A>
  ): B {
    for (const a of iterable) {
      acc = f(acc, a);
    }
    return acc;
  }

  async function reduceAsync<A, B>(
    f: (acc: B, a: A) => B | Promise<B>,
    acc: B,
    asyncIterable: AsyncIterable<A>
  ): Promise<B> {
    for await (const a of asyncIterable) {
      acc = await f(acc, a);
    }
    return acc;
  }

  function reduce<A, B>(
    f: (acc: B, a: A) => B,
    acc: B,
    iterable: Iterable<A>
  ): B;
  function reduce<A, B>(
    f: (acc: B, a: A) => B | Promise<B>,
    acc: B,
    asyncIterable: AsyncIterable<A>
  ): Promise<B>;
  function reduce<A, B>(
    f: any,
    acc: B,
    iterable: Iterable<A> | AsyncIterable<A>
  ): B | Promise<B> {
    return isIterable(iterable)
      ? reduceSync(f, acc, iterable)
      : reduceAsync(f, acc, iterable);
  }

  function fx<A>(iterable: Iterable<A>): FxIterable<A>;
  function fx<A>(asyncIterable: AsyncIterable<A>): FxAsyncIterable<A>;
  function fx<A>(iterable: Iterable<A> | AsyncIterable<A>) {
    return isIterable(iterable)
      ? new FxIterable(iterable)
      : new FxAsyncIterable(iterable);
  }

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

    reduce<B>(f: (acc: B, a: A) => B, acc: B) {
      return reduce(f, acc, this);
    }

    toAsync() {
      return new FxAsyncIterable(toAsync(this));
    }
  }

  class FxAsyncIterable<A> {
    constructor(private asyncIterable: AsyncIterable<A>) {
    }

    [Symbol.asyncIterator]() {
      return this.asyncIterable[Symbol.asyncIterator]();
    }

    map<B>(f: (a: A) => B) {
      return fx(map(f, this));
    }

    filter(f: (a: A) => boolean) {
      return fx(filter(f, this));
    }

    reduce<B>(f: (acc: B, a: A) => B | Promise<B>, acc: B) {
      return reduce(f, acc, this);
    }
  }


  // const getHeight = (imgs) =>
  //   reduceAsync((a, b) => a + b, 0,
  //     map(img => img.height,
  //       map(info => loadImage(info), imgs)));

  const getHeight = async (imgs: ImgInfo[]) =>
    fx(toAsync(imgs))
      .map(info => loadImage(info))
      .map(img => img.height)
      .reduce((a, b) => a + b, 0);

  getHeight(imgs).then(log);
  getHeight(imgs2).catch(() => 0).then(log);
  getHeight(imgs2).then(log).catch((e) => console.error(e));
}

