import { CustomEventWithDetail, html, on, View } from 'rune-ts';

export class InputTextReturned extends CustomEventWithDetail<string> {}

export class InputTextReturnEnterView extends View<{ value?: string }> {
  override template() {
    return html` <input type="text" value="${this.data.value ?? ''}" /> `;
  }

  @on('keypress')
  private _keypress(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      const input = e.target as HTMLInputElement;
      if (input.value) {
        const detail = input.value;
        input.value = '';
        this.dispatchEvent(InputTextReturned, { detail, bubbles: true });
      }
    }
  }
}