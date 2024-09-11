import { html, Page } from 'rune-ts';
import { main } from './session4';

export class Session4Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    await main();
  }
}
