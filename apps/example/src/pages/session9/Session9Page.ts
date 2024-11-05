import { html, Page } from 'rune-ts';
import { setting } from './apps/setting';
import { todo } from './apps/todo';

export class Session9Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    todo();
    setting();
  }
}
