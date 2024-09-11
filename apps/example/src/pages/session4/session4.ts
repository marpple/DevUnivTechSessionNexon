// 비동기 에러 핸들링
// AsyncGenerator/AsyncIterator/AsyncIterable
// LISP + AsyncIterable + Class 조합

const { log } = console;

export async function main() {
  // 1. 비동기 에러 핸들링

  // - 이미지를 불러와서 모든 이미지의 높이를 더한다.

  const imgs = [
    { name: "HEART", url: "https://s3.marpple.co/files/m2/t3/colored_images/45_1115570_1162087_150x0.png" },
    { name: "6", url: "https://s3.marpple.co/f1/2018/1/1054966_1516076919028_64501_150x0.png"},
    { name: "하트", url: "https://s3.marpple.co/f1/2019/1/1235206_1548918825999_78819_150x0.png" },
    { name: "도넛", url:"https://s3.marpple.co/f1/2019/1/1235206_1548918758054_55883_150x0.png"},
  ];

  const imgs2 = [
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

  // loadImage(imgs[0].url).then((img) => log(img.height));

  // - calcHeight

  async function calcHeight() {
    try {
      let isError = false;
      const totalHeight = await imgs2
        .map(async (info) => {
          // if (isError) return;
          try {
            const img = await loadImage(info);
            return img.height;
          } catch (e) {
            // isError = true;
            throw e;
          }
        })
        .reduce(
          async (a, b) => await a + await b,
          Promise.resolve(0)
        );

      log(totalHeight);
    } catch (e) {
      log('에러가 발생 했음', e);
      log(0);
    }
  }

  // calcHeight();

  // - calcHeight2

  const getHeight = (imgs) =>
    reduceAsync((a, b) => a + b, 0,
      map(img => img.height,
        map(info => loadImage(info), imgs)));

  // getHeight(imgs).then(log);
  // getHeight(imgs2).catch(() => 0).then(log);
  // getHeight(imgs2).then(log).catch((e) => console.error(e));

  function* map(f, iterable) {
    const iterator = iterable[Symbol.iterator]();
    while (true) {
      const { value, done } = iterator.next();
      if (done) return;
      yield value instanceof Promise ? value.then(f) : f(value);
    }
  }

  async function reduceAsync(f, acc, iterable) {
    for await (const a of iterable) acc = f(acc, a);
    return acc;
  }

  // # 정리

  // - Promise, async/await, try/catch 를 정확히 다루는 것이 중요합니다.

  // - 제너레이터/이터레이터/이터러블을 잘 응용하면
  //   코드의 표현력을 더할 뿐 아니라 에러 핸들링도 더 잘할 수 있습니다.

  // - 순수 함수에서는 에러가 발생되도록 그냥 두는 것이 더 좋습니다.

  // - 에러 핸들링 코드는 부수효과를 일으킬 코드 주변에 작성하는 것이 좋습니다.

  // - 불필요하게 에러 핸들링을 미리 해두는 것은 에러를 숨길 뿐입니다.

  // - 차라리 에러를 발생시키는게 낫습니다.

  // - sentry.io 같은 서비스를 이용하여 발생되는
  //   모든 에러를 볼 수 있도록 하는 것이 더 좋은 해법입니다.

  // ---------

  // 2. LISP + AsyncIterable + Class 조합

  type IteratorNext<T> =
    { done?: false; value: T; } |
    { done: true; value: undefined; };

  interface Iterator<T> {
    next(): IteratorNext<T>;
  }

  interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
  }

  interface AsyncIterator<T> {
    next(): Promise<IteratorNext<T>>;
  }

  interface AsyncIterable<T> {
    [Symbol.asyncIterator](): AsyncIterator<T>;
  }

  function isIterable<T = unknown>(a: Iterable<T> | unknown): a is Iterable<T> {
    return typeof a?.[Symbol.iterator] === "function";
  }

  // Promise, delay
  function delay<T>(time: number, value: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), time);
    });
  }

  // toAsync

  // mapSync

  // mapAsync

  // filterSync

  // filterAsync

  // reduceSync

  // reduceAsync

  // map, filter, reduce

  // FxIterable, FxAsyncIterable
}

