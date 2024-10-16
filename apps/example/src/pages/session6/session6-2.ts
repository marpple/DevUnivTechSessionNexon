import {chunk, fx, range, sortBy} from "@fxts/core";

const { log } = console;

function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), time);
  });
}

interface Payment {
  pay_id: string,
  order_id: number,
  amount: number
}

const paymentServiceData: Payment[][] = [
  [
    { pay_id: 'PS11', order_id: 1, amount: 15000 },
    { pay_id: 'PS12', order_id: 2, amount: 25000 },
    { pay_id: 'PS13', order_id: 3, amount: 10000 }
  ],
  [
    { pay_id: 'PS14', order_id: 4, amount: 25000 },
    { pay_id: 'PS15', order_id: 5, amount: 45000 },
    { pay_id: 'PS16', order_id: 6, amount: 15000 }
  ],
  [
    { pay_id: 'PS17', order_id: 7, amount: 20000 },
    { pay_id: 'PS18', order_id: 8, amount: 30000 }
  ],
];

const PayApi = {
  getPayments(page: number) {
    console.log(`https://pay.com/payments?page=${page}`);
    return delay(500, paymentServiceData[page-1] ?? []);
  },
  cancelPayment(pay_id: string) {
    return delay(300, `${pay_id}: 취소완료`);
  }
}

interface Order {
  id: number,
  amount: number
}

const OurShopDB = {
  getOrders(ids: Iterable<number>): Promise<Order[]> {
    log(`SELECT * FROM orders WHERE IN (${ids})`);
    return delay(100, [
      { id: 1, amount: 15000 },
      { id: 3, amount: 10000 },
      { id: 7, amount: 20000 }
    ])
  }
};

async function job() {
  // 1. 결제된 결제 서비스 측의 결제 내역(payments)을 가져오기
  //  - page 단위로 가져오는데,
  //  - 불러와지는 결제 데이터가 있을 때까지 모두 가져와서 하나로 합친다.
  const payments = await
    fx(range(1, Infinity))
      .toAsync()
      .map(page => PayApi.getPayments(page))
      .takeUntil(payments => payments.length < 3)
      .flat()
      .toArray();

  log(payments);

  // 2. 결제된 내역과 매칭되는 우리샵 측 주문서들을 뽑기
  // const orders = await OurShopDB.getOrders(
  //   payments.map(p => p.order_id)
  // );

  const orders = await
    fx(chunk(5, payments))
      .toAsync()
      .map(payments => payments.map(p => p.order_id))
      .map(OurShopDB.getOrders)
      .flat()
      .toArray();

  const ordersById =
    orders
      .map(o => ({ [o.id]: true }))
      .reduce((a, b) => Object.assign(a, b));

  // 3. 누락된 결제를 취소하기
  //  - 결제 서비스의 결제 내역(payments)과 우리샵의 주문서를 비교하여
  //  - 결제를 취소해야 할 결제 서비스 측 pay_id들을 뽑아서
  //  - 결제 서비스의 취소 API를 실행한다.
  await fx(payments)
    .reject(p => ordersById[p.order_id])
    .toAsync()
    .map(p => PayApi.cancelPayment(p.pay_id))
    .forEach(a => log(a))
}

export async function main() {
  await fx(range(0, Infinity))
    .toAsync()
    .forEach(() => Promise.all([
      job(),
      delay(7000, undefined)
    ]));
}