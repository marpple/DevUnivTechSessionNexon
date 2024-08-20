import { html, Page } from 'rune-ts';
import { main } from './session1';

export class Session1Page extends Page<object> {
  override template() {
    return html`
      <section>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </section>
    `;
  }

  override onRender() {
    main();
  }
}
