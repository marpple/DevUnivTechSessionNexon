import { html, Page } from 'rune-ts';
import { main } from './session2';

export class Session2Page extends Page<object> {
  override template() {
    return html`
      <div></div>
    `;
  }

  override onRender() {
    main();
  }
}
