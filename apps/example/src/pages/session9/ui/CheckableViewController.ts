import {Toggled} from "./Toggled";
import type {View} from "rune-ts";
import type {ToggleView} from "./ToggleView";
import type {ListView} from "./ListView"; {}

export interface CheckableView<T extends object = object, IV extends View<T> = View<T>> {
  checkAllView: ToggleView;
  listView: ListView<T, IV>;
  getItemViewChecked(itemView: IV): boolean;
  setItemViewChecked(itemView: IV, bool: boolean): void;
}

export class CheckableViewController<T extends object, IV extends View<T>> {
  constructor(private view: CheckableView<T, IV>) {
    this.view.checkAllView.data.on = this._isCheckAll();
    this.view.checkAllView.addEventListener(Toggled, (e) => this._checkAll(e.detail.on));
    this.view.listView.addEventListener(Toggled, () => this._syncCheckAll());
  }

  private _checkAll(bool: boolean) {
    this.view.listView.itemViews
      .filter((itemView) => this.view.getItemViewChecked(itemView) !== bool)
      .forEach(itemView => this.view.setItemViewChecked(itemView, bool));
  }

  private _syncCheckAll() {
    this.view.checkAllView.setOn(this._isCheckAll());
  }

  private _isCheckAll() {
    return this.view.listView.itemViews.every(itemView => this.view.getItemViewChecked(itemView));
  }
}