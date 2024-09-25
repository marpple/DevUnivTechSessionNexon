import { html, Page } from 'rune-ts';
import { main } from './session5';

export class Session5Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    await main();
  }
}
