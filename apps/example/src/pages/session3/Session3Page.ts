import { html, Page } from 'rune-ts';
import { main } from './session3';

export class Session3Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    await main();
  }
}
