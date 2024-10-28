import { html, Page } from 'rune-ts';
import { main } from './session7';

export class Session7Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    await main();
  }
}
