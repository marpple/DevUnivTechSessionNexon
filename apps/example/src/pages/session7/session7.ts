import {flat, forEach, fx, map, pipe, range, reduce, zip} from "@fxts/core";
import {escapeHtml} from "./helper";

const log = console.log;

export async function main() {
  // 커링
  // const add = (a, b) => a + b;
  // const add = a => b => a + b;
  //
  // const add10 = add(10);
  // const add20 = add(20);
  //
  // log(add10(5));
  // log(add10(5));
  //
  // function map(f) {
  //   return function* (iterable) {
  //     for (const a of iterable) {
  //       yield f(a);
  //     }
  //   }
  // }
  //
  // function doubleAll1(numbers: number[]) {
  //   return numbers.map(a => a * 2);
  // }
  //
  // log(doubleAll1([1, 2, 3]));
  //
  // const doubleAll2 = map(a => a * 2);
  //
  // log(...doubleAll2([1, 2, 3]));
  //
  // // pipe
  pipe(
    [10, 20, 30],
    map(a => a * 2),
    map(a => a * 10),
    forEach(log)
  );

  // index가 필요할 때
  const users = [
    { name: 'AA' },
    { name: 'BB' },
    { name: 'CC' },
    { name: 'DD' },
    { name: 'EE' },
  ];

  let i = 0;
  users
    .map(u => [++i, u.name])
    .forEach(val => log(val));

  fx(
    zip(
      range(1, Infinity),
      map(u => u.name, users)
    )
  ).forEach(log);

  const iter = zip(
    range(1, Infinity),
    [10, 20, 30, 40, 50]
  );

  // log([...iter]);
  // log(iter.next().value);
  // log(iter.next().value);
  // log(iter.next().value);
  // log(iter.next().value);
  // log(iter.next().value);
  // log(iter.next().value);

  console.clear();

  function joinTT<T>(
    strs: TemplateStringsArray,
    vals: T[],
    transform: (a: T) => string
  ) {
    return pipe(
      zip(
        strs,
        concat(map(transform, vals), ['']),
      ),
      flat,
      reduce((a, b) => a + b)
    );
  }

  // Tagged Templates upper
  const a = 'a';
  const b = 'b';
  const c = 'c';

  // function joinMaker(f) {
  //   return function(strs, ...vals: string[]) {
  //     return joinTT(strs, vals, f);
  //   }
  // }

  function upper(strs, ...vals: string[]) {
    return joinTT(
      strs,
      vals,
      val => val.toUpperCase()
    );
  }

  // const upper = joinMaker(val => val.toUpperCase());

  const result = upper`11111${a}2${b}3${c}4${c}4`;
  log(result);

  // log('<li>' + escapeHtml(e) + '</li>');

  // log(
  //   `
  //     <li>${escapeHtml(e)}</li>
  //     <li>${escapeHtml(f)}</li>
  //     <li>${escapeHtml(g)}</li>
  //   `
  // );

  // console.clear();

  // html
  const e = '<script>';
  const f = '<img onload="">';
  const g = '&&&';

  function* concat<T>(...iterables: Iterable<T>[]) {
    for (const iterable of iterables) {
      for (const a of iterable) {
        yield a;
      }
    }
  }

  class Html {
    constructor(
      private strs: TemplateStringsArray,
      private vals: unknown[]
    ) {}

    private merge(val: unknown) {
      return Array.isArray(val)
        ? val.reduce((a, b) => html`${a}${b}`)
        : val;
    }

    private escape(val: unknown) {
      return val instanceof Html
        ? val.toHtml()
        : escapeHtml(val);
    }

    toHtml() {
      return joinTT(
        this.strs,
        this.vals,
        val => this.escape(this.merge(val))
      );
    }
  }

  const html = (strs: TemplateStringsArray, ...vals: unknown[]) =>
    new Html(strs, vals);

  // log(html`11${a}22${b}333${c}44`);

  const user = {
    name: 'AA',
    age: 40
  };

  interface User {
    name: string;
    age: number;
  }

  function userHtml(user: User) {
    return html`
      <li>${user.name} (${user.age})</li>
    `;
  }

  const users2: User[] = [
    { name: 'idy', age: 40 },
    { name: 'hdy', age: 34 },
    { name: 'hdy', age: 31 },
    { name: 'idy', age: 40 },
    { name: 'hdy', age: 34 },
    { name: 'hdy', age: 31 },
    { name: 'idy', age: 40 },
    { name: 'hdy', age: 34 },
    { name: 'hdy', age: 31 },
    { name: 'idy', age: 40 },
    { name: 'hdy', age: 34 },
    { name: 'hdy', age: 31 },
    { name: 'idy', age: 40 },
    { name: 'hdy', age: 34 },
    { name: 'hdy', age: 31 },
  ];

  const result2 = html`
    <ul>
      <li>${f}</li>
      <li>${g}</li>
      ${userHtml(users2[0])}
      ${userHtml(users2[1])}
      ${userHtml(users2[2])}
      <li>
        <ul>
          ${users2.map(user => userHtml(user))}
        </ul>
      </li>
    </ul>
  `;

  log(result2.toHtml());

  // View
  // UserView
  // TeamMemberView

  abstract class View<T> {
    private _element: HTMLElement | null = null;

    constructor(public data: T) {}

    element() {
      return this._element!;
    }

    abstract template(): Html;

    render(): HTMLElement {
      const wrapEl = document.createElement('div');
      wrapEl.innerHTML = this.template().toHtml();
      this._element = wrapEl.children[0] as HTMLElement;
      this.onRender();
      return this._element;
    }

    onRender() {}
  }

  class UserView extends View<User> {
    template(): Html {
      return html`
        <span>${this.data.name} (<em>${this.data.age}</em>)</span>
      `;
    }
  }

  class TeamMemberView extends View<User> {
    template(): Html {
      return html`
        <li>
          ${new UserView(this.data).template()}
          <button>x</button>
        </li>
      `;
    }

    override onRender() {
      this.element().querySelector('button')!
        .addEventListener('click', () => this.element().remove());
    }
  }

  pipe(
    users2,
    map(user => new TeamMemberView(user)),
    map(view => view.render()),
    forEach(view => document.body.append(view))
  );

  // document.body.append(
  //   new TeamMemberView(users2[0]).render()
  // );

}

