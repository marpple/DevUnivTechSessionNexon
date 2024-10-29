import { html, Page } from 'rune-ts';
import { main } from './session8';

export class Session8Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    await main();
  }
}
