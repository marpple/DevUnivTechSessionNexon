// Promise, race, all
// 올바른 비동기/동시성 핸들링으로 나아가는 계단 지연성

import {chunk, fx, map, take, fromAsync} from "./fx";

const { log } = console;

const imgs = [
  { name: "HEART", url: "https://s3.marpple.co/files/m2/t3/colored_images/45_1115570_1162087_150x0.png" },
  { name: "6", url: "https://s3.marpple.co/f1/2018/1/1054966_1516076919028_64501_150x0.jpg"},
  { name: "하트", url: "https://s3.marpple.co/f1/2019/1/1235206_1548918825999_78819_150x0.png" },
  { name: "도넛", url:"https://s3.marpple.co/f1/2019/1/1235206_1548918758054_55883_150x0.png"},
];

// log('start');
// console.time();
// setTimeout(function() {
//   console.timeEnd();
//   log('hi~~');
//   setTimeout(function() {
//     console.timeEnd();
//     log('hi~~2');
//   }, 2000);
// }, 1000);

export async function main() {
  // Promise, delay
  function delay<T>(time: number, value: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), time);
    });
  }

  // delay(1000, 'hi')
  //   .then(log)
  //   .then(() => delay(1000, 'bb'))
  //   .then(log);

  // loadImage
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = function() {
        resolve(image);
      }
      image.onerror = function() {
        reject(new Error(`이미지를 불러오지 못함: ${src}`));
      }
      image.src = src;
    });
  }

  // loadImage(imgs[0].url)
  //   .then((img) => log(img.height))
  //   .catch((err) => console.error(err));
  //
  // loadImage(imgs[1].url)
  //   .then((img) => log(img.height))
  //   .catch((err) => console.error(err));
  //
  // try {
  //   const image = await loadImage(imgs[1].url);
  //   log(image.height);
  // } catch (e) {
  //   log(e);
  // }

  // Promise<string> & Array<string>
  const p1 = Promise.resolve('a')
    .then(a => a + a)
    .then(a => a.toUpperCase());

  // p1.then(a => log(a));
  // log(await p1);

  const a1 = ['a']
    .map(a => a + a)
    .map(a => a.toUpperCase());

  // a1.forEach(a => log(a));
  // log(a1[0]);

  interface File {
    name: string;
    body: string;
    size: number;
  }

  // getFile
  function getFile(name: string, size = 1000): Promise<File> {
    log(name, '시작!');
    return delay(size, { name, body: '....', size });
  }

  // const f1 = await getFile('1-image.png', 200);
  // log(f1);

  // Promise.race
  // const r1 = await Promise.race([
  //   delay(1000, 'A'),
  //   delay(500, 'B'),
  //   delay(1500, 'C'),
  // ]);
  // log(r1);

  // getFriends, getRandomValue
  interface User {
    name: string,
    age: number
  }

  function getFriends(): Promise<User[]> {
    return delay(3000, [
      { name: 'idy', age: 40 },
      { name: 'hdy', age: 34 },
      { name: 'hdy', age: 31 },
    ]);
  }

  // const users = await Promise.race([
  //   getFriends(),
  //   delay(2000, 'timeout')
  // ]);

  // if (users === 'timeout') {
  //   log('네트워크를 확인해주세요');
  // } else {
  //   log('친구 목록 그리기', users);
  // }
  // log(users);

  // renderFriendsPicker: 책에 있어요.

  // Promise.all
  // console.time('1');
  // const files = await Promise.all([
  //   getFile('1-image.png', 1000),
  //   getFile('2-image.jpg', 1000),
  //   getFile('3-ppt.pdf', 1000),
  //   getFile('4-image.png', 1000),
  //   getFile('5-image.jpg', 1000),
  //   getFile('6-ppt.pdf', 1000),
  // ]);
  // console.timeEnd('1');
  // log(files);


  // executeWithLimit
  // console.time('2');
  // const files = await executeWithLimit(3, [
  //   () => getFile('1-image.png', 100),
  //   () => getFile('2-image.jpg', 100),
  //   () => getFile('3-ppt.pdf', 100),
  //   () => getFile('4-image.png', 100),
  //   () => getFile('5-image.jpg', 100),
  //   () => getFile('6-ppt.pdf', 100),
  //   () => getFile('7-ppt.pdf', 100),
  // ]);
  // console.log(files);
  // console.timeEnd('2');


  async function executeWithLimit<T>(limit: number, fs: (() => Promise<T>)[]) {
    let tmp: T[][] = [];
    for (let i = 0; i < fs.length / limit; i++) {
      let ps: Promise<T>[] = [];
      for (let j = 0; j < limit; j++) {
        const f = fs[i * limit + j];
        if (f) {
          ps.push(f());
        }
      }
      tmp.push(await Promise.all(ps));
    }
    return tmp.flat();
  }

  const executeWithLimit2 = <T>(limit: number, fs: (() => Promise<T>)[]) =>
    fx(fs)
      .map(f => f())
      .chunk(limit)
      .map(ps => Promise.all(ps))
      .to(fromAsync)
      .then(arr => arr.flat());

  console.time('2');
  const files = await executeWithLimit2(3, [
    () => getFile('1-image.png', 1000),
    () => getFile('2-image.jpg', 1000),
    () => getFile('3-ppt.pdf', 1000),
    () => getFile('4-image.png', 1000),
    () => getFile('5-image.jpg', 1000),
    () => getFile('6-ppt.pdf', 1000),
    () => getFile('7-ppt.pdf', 1000),
  ]);
  console.log(files);
  console.timeEnd('2');


  // const iter = chunk(3, [1, 2, 3, 4, 5, 6, 7, 8]);
  // log([...iter])
  // log(iter.next().value);
  // log(iter.next().value);
  // log(iter.next().value);
  // log(iter.next().value);
  // log(iter.next().value);

  //   const iterator = [1, 2, 3, 4, 5][Symbol.iterator]();
  // const taked = take(3, iterator);
  // log([...taked]);
  //
  // const taked2 = take(3, iterator);
  // log([...taked2]);
  //
  // const taked3 = take(2, iterator);
  // log([...taked3]);
}

