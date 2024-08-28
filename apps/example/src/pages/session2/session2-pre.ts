// // 고차 함수와 함수 타입, 그리고 제네릭
// // 타입시스템 + 함수형 함수 + 객체지향 클래스
// // LISP 핵심 컨셉 - 로직이 담긴 리스트, 지연평가
//
// export function main() {
//   // identity
//   function identity<T>(arg: T): T {
//     return arg;
//   }
//
//   const d = identity(1);
//   const a = identity([1]);
//   const b = identity([1][Symbol.iterator]());
//
//   while (true) {
//     const { done, value } = b.next();
//     if (done) break;
//     const current = value;
//   }
//
//   // add
//   function add(a: number, b: number) {
//     return a + b;
//   }
//
//   const r = add(1, 2);
//
//   // double 함수 오버로드
//   function double(n: string): string;
//   function double(n: number): number;
//   function double(n: number | string): number | string {
//     if (typeof n === 'number') {
//       return n * 2;
//     } else {
//       return n + n;
//     }
//   }
//
//   // div 화살표 함수 및 타입 추론
//   const div = (a: number, b: number) => a / b;
//   const r2 = div(10, 5);
//
//   // constant 고차 함수
//   function constant<T>(a: T) {
//     return function () {
//       return a;
//     }
//   }
//
//   const f1 = constant(10);
//   const r1 = f1();
//
//   const f2 = constant("aa");
//   const r22 = f2();
//
//   const r33 = f2() + f2();
//
//   // naturals 타입추론
//   function* naturals(end = Infinity) {
//     let i = 0;
//     while (++i <= end) {
//       yield i;
//     }
//   }
//
//   // forEach
//
//   // map
//
//   // filter
//
//   // FxIterable
//
//   // toArray
//
//   // vs 이터러블 프로토콜
//
//   // sumOfSquaresOfOddNumbers
//   function sumOfSquaresOfOddNumbers(limit: number, list: number[]): number {
//     let acc = 0;
//     for (const a of list) {
//       if (a % 2 === 1) {
//         const b = a * a;
//         acc += b;
//         if (--limit === 0) break;
//       }
//     }
//     return acc;
//   }
//
//   console.log(
//     sumOfSquaresOfOddNumbers(3, [1, 2, 3, 4, 5, 6, 7, 8, 9])
//   );
//
//   // 명령형을 리스트 프로세싱으로 전환
//   // - if를 filter로
//   // - 값 변화 후 변수 할당을 map으로
//   //   (잠시 LISP 보고 오기)
//   // - break를 take로
//   // - 합산을 reduce로
//
//   function reduce<A, B>(f: (a: B, b: A) => B, acc: B, iterable: Iterable<A>): B {
//     for (const a of iterable) {
//       acc = f(acc, a);
//     }
//     return acc;
//   }
// }
//
