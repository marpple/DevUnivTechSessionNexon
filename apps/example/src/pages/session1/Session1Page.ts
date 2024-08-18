import { html, Page } from 'rune-ts';
import { main } from './session1';

export class Session1Page extends Page<object> {
  override template() {
    return html`<div></div>`;
  }

  override onRender() {
    main();
  }
}
