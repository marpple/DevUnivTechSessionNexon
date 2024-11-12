import { html, Page } from 'rune-ts';
import { setting } from './apps/setting';
import { todo } from "./apps/todo/TodoPage";
import { todo2 } from './apps/todo/TodoPage2';
import { todo3 } from './apps/todo/TodoPage3';

export class Session10Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    todo3();
    todo2();
    todo();
    setting();
  }
}
