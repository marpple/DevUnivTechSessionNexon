import {fx, map, reduce} from "@fxts/core";

const { log } = console;

export async function main() {
  // 2차원 배열 다루기
  const arr = [
    [1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10]
  ];

  const result = fx(arr)
    .map(arr => arr)
    .flat()
    .filter(a => a % 2 === 1)
    .map(a => a * a)
    .take(3)
    .reduce((a, b) => a + b);

  log(result);

  // 농구팀 데이터 다루기
  interface Player {
    name: string,
    point: number
  }

  interface Team {
    name: string,
    players: Player[]
  }

  const teams: Team[] = [
    {
      name: 'A', players: [
        { name: 'a1', point: 32 },
        { name: 'a2', point: 28 },
        { name: 'a3', point: 15 },
        { name: 'a4', point: 14 }
      ]
    },
    {
      name: 'B', players: [
        { name: 'b1', point: 37 },
        { name: 'b2', point: 20 },
        { name: 'b3', point: 19 },
        { name: 'b4', point: 22 }
      ]
    },
    {
      name: 'C', players: [
        { name: 'c1', point: 32 },
        { name: 'c2', point: 37 },
        { name: 'c3', point: 15 },
        { name: 'c4', point: 14 }
      ]
    },
    {
      name: 'D', players: [
        { name: 'd1', point: 37 },
        { name: 'd2', point: 21 },
        { name: 'd3', point: 19 },
        { name: 'd4', point: 22 }
      ]
    },
  ];

  // const result = fx(arr)
  //   .map(arr => arr)
  //   .flat()
  //   .filter(a => a % 2 === 1)
  //   .map(a => a * a)
  //   .take(3)
  //   .reduce((a, b) => a + b);
  //
  // log(result);

  const result2 = fx(teams)
    .map(team => team.players)
    .flat()
    .filter(p => p.point >= 20)
    .map(p => p.point)
    .take(5)
    .reduce((a, b) => a + b)
  ;

  log(result2);


  // 상품 & 장바구니 다루기

  interface Option {
    name: string,
    price: number,
    quantity: number,
  }

  interface Product {
    name: string,
    price: number,
    selected: boolean,
    options: Option[]
  }

  const products: Product[] = [
    {
      name: '티셔츠',
      price: 10000,
      selected: true,
      options: [
        { name: 'L', price: 0, quantity: 3 },
        { name: 'XL', price: 1000, quantity: 2 },
        { name: '2XL', price: 3000, quantity: 2 },
      ]
    },
    {
      name: '후디',
      price: 30000,
      selected: false,
      options: [
        { name: 'L', price: 0, quantity: 2 },
        { name: 'XL', price: 1000, quantity: 5 },
        { name: '2XL', price: 3000, quantity: 4 },
      ]
    },
    {
      name: '바지',
      price: 15000,
      selected: true,
      options: [
        { name: 'XL', price: 500, quantity: 3 },
        { name: '2XL', price: 3000, quantity: 5 },
      ]
    }
  ];

  // const totalQuantity2 = products
  //   .reduce((total, p) => {
  //     if (p.selected) {
  //       return total + p.quantity;
  //     } else {
  //       return total;
  //     }
  //   }, 0);

  // 총 수량
  const totalQuantity = fx(products)
    .filter(p => p.selected)
    .map(p => p.options)
    .flat()
    .map(o => o.quantity)
    .reduce((a, b) => a + b)
  ;
  log('totalQuantity', totalQuantity);

  // 총 가격
  const totalPrice = fx(products)
    .filter(p => p.selected)
    .map(p =>
      p.options
        .map(o => (p.price + o.price) * o.quantity)
    )
    .flat()
    .reduce((a, b) => a + b)
  ;
  log('totalPrice', totalPrice);

  // 지연된 로직을 제한하여 평가시키는 take 유형의 함수
  // - takeWhile 과 takeUntil에 대해
  log('takeWhile');

  fx([1, 2, 3, 4, 5, 0, 0, 0, 5, 6])
    .takeWhile(a => {
      log('tw', a, a >= 1);
      return a >= 1;
    })
    .forEach(a => log(a));

  log('takeUntil');

  fx([0, 10, 1, 2, 3, 4, 5, 0, 0, 0])
    .takeUntil(a => {
      log('tu', a, a === 5);
      return a === 5;
    })
    .forEach(a => log(a));


}

