import { html, Page } from 'rune-ts';
import { main } from './session6';
import { main as main2 } from './session6-2';

export class Session6Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override async onRender() {
    await main();
    await main2();
  }
}
