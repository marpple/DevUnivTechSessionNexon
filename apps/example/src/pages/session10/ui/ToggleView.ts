import {View} from "rune-ts";
import {Toggled} from "./Toggled";

interface Toggle {
  on: boolean;
}

export abstract class ToggleView extends View<Toggle> {
  constructor(data?: Toggle) {
    super(data ?? { on: false });
  }

  override onRender() {
    this.element().addEventListener('click', () => this._toggle());
  }

  private _toggle() {
    this.setOn(!this.data.on);
    this.dispatchEvent(Toggled, { bubbles: true, detail: this.data });
  }

  setOn(bool: boolean) {
    this.data.on = bool;
    this.element().classList.toggle('on', bool);
  }
}