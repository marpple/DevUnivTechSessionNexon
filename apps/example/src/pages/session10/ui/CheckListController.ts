import {Toggled} from "./Toggled";
import type {View, ListView} from "rune-ts";
import type {ToggleView} from "./ToggleView";

export class CheckListController<T extends object, IV extends View<T>> {
  constructor(
    public checkAllView: ToggleView,
    public listView: ListView<T, IV>,
    private getItemViewChecked: (itemView: IV) => boolean,
    private setItemViewChecked: (itemView: IV, bool: boolean) => void
  ) {
    this.checkAllView.data.on = this._isCheckAll();
    this.checkAllView.addEventListener(Toggled, (e) => this._checkAll(e.detail.on));
    this.listView.addEventListener(Toggled, () => this.syncCheckAll());
  }

  private _checkAll(bool: boolean) {
    this.listView.itemViews
      .filter((itemView) => this.getItemViewChecked(itemView) !== bool)
      .forEach(itemView => this.setItemViewChecked(itemView, bool));
  }

  syncCheckAll() {
    this.checkAllView.setOn(this._isCheckAll());
  }

  private _isCheckAll() {
    return this.listView.itemViews.every(itemView => this.getItemViewChecked(itemView));
  }
}